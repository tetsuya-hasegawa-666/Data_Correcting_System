package com.corecamera.app

import android.annotation.SuppressLint
import android.content.Context
import android.graphics.SurfaceTexture
import android.hardware.camera2.CameraCaptureSession
import android.hardware.camera2.CameraCharacteristics
import android.hardware.camera2.CameraDevice
import android.hardware.camera2.CameraManager
import android.hardware.camera2.CaptureRequest
import android.hardware.camera2.CaptureResult
import android.hardware.camera2.TotalCaptureResult
import android.os.Handler
import android.os.HandlerThread
import android.util.Size
import android.view.Surface
import android.view.TextureView
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import com.google.ar.core.Config
import com.google.ar.core.Session

data class SharedCameraUiState(
    val lifecycleState: SharedCameraLifecycleState,
    val statusText: String,
    val currentSession: SessionArtifacts?,
    val currentMicroRelease: String,
    val nextMicroRelease: String,
    val blocker: String?,
)

interface SharedCameraSessionAdapter {
    fun startSession()
    fun stopSession()
    fun findLatestSession(): SessionArtifacts?
}

class SharedCameraSessionController(
    private val context: Context,
    private val lifecycleOwner: LifecycleOwner,
    private val previewTextureView: TextureView,
    private val statusListener: (SharedCameraUiState) -> Unit,
) : DefaultLifecycleObserver, SharedCameraSessionAdapter {
    private val artifactStore = SessionArtifactStore(context)
    private val lifecycleMachine = SharedCameraLifecycleMachine()
    private val cameraThread = HandlerThread("shared-camera-thread").apply { start() }
    private val cameraHandler = Handler(cameraThread.looper)
    private val cameraManager = context.getSystemService(CameraManager::class.java)

    private var currentSession: SessionArtifacts? = null
    private var arSession: Session? = null
    private var cameraDevice: CameraDevice? = null
    private var captureSession: CameraCaptureSession? = null
    private var previewSurface: Surface? = null
    private var videoRecorder: SessionVideoRecorder? = null
    private var poseSampler: ArCorePoseSampler? = null
    private var hostResumed = false
    private var sharedCameraResumed = false
    private var collectorStatus: MutableMap<String, String> = mutableMapOf(
        "camera2" to "idle",
        "sharedCamera" to "idle",
        "arcore" to "idle",
        "video" to "idle",
        "pose" to "idle",
    )

    init {
        lifecycleOwner.lifecycle.addObserver(this)
        bindPreviewListener()
        emitStatus(
            statusText = "MRL-2 implementation loaded. Ready for contract-compatible shared-camera output validation.",
            currentMicroRelease = "mRL-2-3",
            nextMicroRelease = "mRL-3-1",
            blocker = null,
        )
    }

    override fun onResume(owner: LifecycleOwner) {
        hostResumed = true
        if (lifecycleMachine.state == SharedCameraLifecycleState.RUNNING && !sharedCameraResumed) {
            resumeArSession()
        }
    }

    override fun onPause(owner: LifecycleOwner) {
        hostResumed = false
        pauseArSession()
    }

    override fun onDestroy(owner: LifecycleOwner) {
        shutdown()
    }

    override fun startSession() {
        if (!previewTextureView.isAvailable) {
            emitStatus("Preview surface is not ready yet.", "mRL-2-1", "mRL-2-2", "TextureView not available")
            return
        }
        if (lifecycleMachine.state == SharedCameraLifecycleState.RUNNING || lifecycleMachine.state == SharedCameraLifecycleState.STARTING) {
            return
        }

        lifecycleMachine.beginStart()
        collectorStatus = mutableMapOf(
            "camera2" to "starting",
            "sharedCamera" to "starting",
            "arcore" to "starting",
            "video" to "starting",
            "pose" to "starting",
        )
        currentSession = artifactStore.createSession()
        currentSession?.let {
            artifactStore.appendLifecycleEvent(it, "start_requested", mapOf("adapterSeamId" to ReplacementCameraContract.adapterSeamId))
        }
        emitStatus(
            "Starting contract-compatible Camera2 + Shared Camera recording.",
            "mRL-2-1",
            "mRL-2-2",
            null,
        )
        initializeSharedCamera()
    }

    override fun stopSession() {
        if (lifecycleMachine.state != SharedCameraLifecycleState.RUNNING && lifecycleMachine.state != SharedCameraLifecycleState.STARTING) {
            return
        }
        lifecycleMachine.beginStop()
        val session = currentSession
        session?.let { artifactStore.appendLifecycleEvent(it, "stop_requested", emptyMap()) }
        val runtimeMetadata = closeRuntime()
        lifecycleMachine.markStopped()
        session?.let {
            artifactStore.finalizeSession(
                artifacts = it,
                lifecycleState = lifecycleMachine.state,
                collectorStatus = collectorStatus.toMap(),
                additionalMetadata = mapOf(
                    "cameraId" to collectorStatus["cameraId"],
                    "adapterState" to "contract_outputs_captured_without_isensorium_integration",
                ) + runtimeMetadata + artifactStore.collectOutputMetrics(it),
            )
        }
        emitStatus(
            "mRL-2 complete. Contract-compatible shared-camera artifacts captured; ready for continuity validation.",
            "mRL-3-1",
            "mRL-3-2",
            null,
        )
    }

    override fun findLatestSession(): SessionArtifacts? = artifactStore.findLatestSession()

    fun shutdown() {
        if (lifecycleMachine.state == SharedCameraLifecycleState.RUNNING || lifecycleMachine.state == SharedCameraLifecycleState.STARTING) {
            stopSession()
        }
        previewSurface?.release()
        previewSurface = null
        previewTextureView.surfaceTextureListener = null
        cameraThread.quitSafely()
        lifecycleOwner.lifecycle.removeObserver(this)
    }

    private fun bindPreviewListener() {
        if (previewTextureView.isAvailable) {
            lifecycleMachine.markPreviewReady()
            emitStatus("Preview ready. Start mRL-2 contract-output capture when needed.", "mRL-2-1", "mRL-2-2", null)
            return
        }

        previewTextureView.surfaceTextureListener = object : TextureView.SurfaceTextureListener {
            override fun onSurfaceTextureAvailable(surface: SurfaceTexture, width: Int, height: Int) {
                lifecycleMachine.markPreviewReady()
                emitStatus("Preview ready. Start mRL-2 contract-output capture when needed.", "mRL-2-1", "mRL-2-2", null)
            }

            override fun onSurfaceTextureSizeChanged(surface: SurfaceTexture, width: Int, height: Int) = Unit

            override fun onSurfaceTextureDestroyed(surface: SurfaceTexture): Boolean {
                previewSurface?.release()
                previewSurface = null
                return true
            }

            override fun onSurfaceTextureUpdated(surface: SurfaceTexture) = Unit
        }
    }

    private fun initializeSharedCamera() {
        val sessionArtifacts = currentSession ?: return
        try {
            val session = Session(context, setOf(Session.Feature.SHARED_CAMERA))
            session.configure(
                Config(session).apply {
                    updateMode = Config.UpdateMode.LATEST_CAMERA_IMAGE
                },
            )
            arSession = session
            collectorStatus["sharedCamera"] = "ar_session_created"
            collectorStatus["cameraId"] = resolveBackCameraId(session)
            prepareOutputRuntime(sessionArtifacts, collectorStatus["cameraId"]!!)
            artifactStore.writeManifest(
                artifacts = sessionArtifacts,
                status = "starting",
                lifecycleState = lifecycleMachine.state,
                collectorStatus = collectorStatus,
                additionalMetadata = mapOf(
                    "cameraId" to collectorStatus["cameraId"],
                    "adapterState" to "shared_camera_session_created",
                ),
            )
            openCamera(session, sessionArtifacts)
        } catch (error: Exception) {
            failSession("Shared camera initialization failed: ${error.javaClass.simpleName}", error)
        }
    }

    private fun resolveBackCameraId(session: Session): String {
        val preferredId = session.cameraConfig.cameraId
        if (preferredId.isNotBlank()) {
            return preferredId
        }
        return cameraManager.cameraIdList.firstOrNull { id ->
            cameraManager.getCameraCharacteristics(id)
                .get(CameraCharacteristics.LENS_FACING) == CameraCharacteristics.LENS_FACING_BACK
        } ?: cameraManager.cameraIdList.first()
    }

    @SuppressLint("MissingPermission")
    private fun openCamera(session: Session, sessionArtifacts: SessionArtifacts) {
        val cameraId = collectorStatus["cameraId"] ?: resolveBackCameraId(session)
        val wrappedCallback = session.sharedCamera.createARDeviceStateCallback(
            object : CameraDevice.StateCallback() {
                override fun onOpened(device: CameraDevice) {
                    cameraDevice = device
                    collectorStatus["camera2"] = "camera_opened"
                    artifactStore.appendLifecycleEvent(sessionArtifacts, "camera_opened", mapOf("cameraId" to cameraId))
                    createCaptureSession(device, session, sessionArtifacts)
                }

                override fun onDisconnected(device: CameraDevice) {
                    collectorStatus["camera2"] = "camera_disconnected"
                    device.close()
                    failSession("Camera disconnected during shared-camera bootstrap.", null)
                }

                override fun onError(device: CameraDevice, error: Int) {
                    collectorStatus["camera2"] = "camera_error_$error"
                    device.close()
                    failSession("Camera open failed with error $error.", null)
                }
            },
            cameraHandler,
        )
        cameraManager.openCamera(cameraId, wrappedCallback, cameraHandler)
    }

    private fun createCaptureSession(
        device: CameraDevice,
        session: Session,
        sessionArtifacts: SessionArtifacts,
    ) {
        val surfaceTexture = previewTextureView.surfaceTexture
            ?: throw IllegalStateException("Preview surface texture missing.")
        surfaceTexture.setDefaultBufferSize(
            previewTextureView.width.coerceAtLeast(1),
            previewTextureView.height.coerceAtLeast(1),
        )
        previewSurface?.release()
        previewSurface = Surface(surfaceTexture)
        val recorderSurface = checkNotNull(videoRecorder?.surface) { "Video recorder surface missing." }
        session.sharedCamera.setAppSurfaces(
            collectorStatus["cameraId"] ?: resolveBackCameraId(session),
            listOf(previewSurface!!, recorderSurface),
        )
        val targets = buildList {
            addAll(session.sharedCamera.arCoreSurfaces)
            add(previewSurface!!)
            add(recorderSurface)
        }
        val request = device.createCaptureRequest(CameraDevice.TEMPLATE_RECORD).apply {
            targets.forEach(::addTarget)
            set(CaptureRequest.CONTROL_AF_MODE, CaptureRequest.CONTROL_AF_MODE_CONTINUOUS_VIDEO)
        }
        val captureCallback = object : CameraCaptureSession.CaptureCallback() {
            override fun onCaptureCompleted(
                session: CameraCaptureSession,
                request: CaptureRequest,
                result: TotalCaptureResult,
            ) {
                collectorStatus["camera2"] = "streaming"
                artifactStore.appendFrameTimestamp(
                    artifacts = sessionArtifacts,
                    sensorTimestampNs = result.get(CaptureResult.SENSOR_TIMESTAMP),
                    frameNumber = result.frameNumber,
                )
            }
        }
        session.sharedCamera.setCaptureCallback(captureCallback, cameraHandler)
        val wrappedSessionCallback = session.sharedCamera.createARSessionStateCallback(
            object : CameraCaptureSession.StateCallback() {
                override fun onConfigured(cameraCaptureSession: CameraCaptureSession) {
                    captureSession = cameraCaptureSession
                    collectorStatus["sharedCamera"] = "capture_session_configured"
                    cameraCaptureSession.setRepeatingRequest(request.build(), captureCallback, cameraHandler)
                    checkNotNull(videoRecorder).start()
                    collectorStatus["video"] = "recording"
                    artifactStore.appendLifecycleEvent(sessionArtifacts, "video_recording_started", emptyMap())
                    lifecycleMachine.markRunning()
                    artifactStore.appendLifecycleEvent(
                        sessionArtifacts,
                        "capture_session_configured",
                        mapOf("surfaceCount" to targets.size),
                    )
                    artifactStore.writeManifest(
                        artifacts = sessionArtifacts,
                        status = "running",
                        lifecycleState = lifecycleMachine.state,
                        collectorStatus = collectorStatus,
                        additionalMetadata = mapOf(
                            "cameraId" to collectorStatus["cameraId"],
                            "adapterState" to "camera2_shared_camera_running",
                        ),
                    )
                    emitStatus(
                        "mRL-2 running. Shared camera is emitting contract-compatible video and timestamps.",
                        "mRL-2-3",
                        "mRL-3-1",
                        null,
                    )
                }

                override fun onConfigureFailed(cameraCaptureSession: CameraCaptureSession) {
                    collectorStatus["sharedCamera"] = "capture_session_configure_failed"
                    failSession("Capture session configuration failed.", null)
                }

                override fun onActive(cameraCaptureSession: CameraCaptureSession) {
                    if (!sharedCameraResumed && hostResumed) {
                        resumeArSession()
                    }
                }
            },
            cameraHandler,
        )
        device.createCaptureSession(targets, wrappedSessionCallback, cameraHandler)
    }

    private fun resumeArSession() {
        val session = arSession ?: return
        val artifacts = currentSession ?: return
        runCatching { session.resume() }
            .onSuccess {
                sharedCameraResumed = true
                collectorStatus["arcore"] = "resumed"
                artifactStore.appendLifecycleEvent(artifacts, "ar_session_resumed", emptyMap())
                if (poseSampler == null) {
                    poseSampler = ArCorePoseSampler(cameraHandler, artifactStore, artifacts).also { sampler ->
                        sampler.start(session)
                    }
                    collectorStatus["pose"] = "sampling"
                    artifactStore.appendLifecycleEvent(artifacts, "arcore_pose_sampling_started", emptyMap())
                }
            }
            .onFailure {
                collectorStatus["arcore"] = "resume_failed_${it.javaClass.simpleName}"
                collectorStatus["pose"] = "sampling_blocked"
                artifactStore.appendLifecycleEvent(
                    artifacts,
                    "ar_session_resume_failed",
                    mapOf("error" to it.javaClass.simpleName),
                )
            }
    }

    private fun pauseArSession() {
        poseSampler?.stop()
        poseSampler = null
        runCatching { arSession?.pause() }
        sharedCameraResumed = false
        if (collectorStatus["arcore"] == "resumed") {
            collectorStatus["arcore"] = "paused"
        }
        if (collectorStatus["pose"] == "sampling") {
            collectorStatus["pose"] = "paused"
        }
    }

    private fun closeRuntime(): Map<String, Any> {
        pauseArSession()
        if (collectorStatus["pose"] == "paused") {
            collectorStatus["pose"] = "stopped"
        }
        runCatching { captureSession?.stopRepeating() }
        val videoBytes = stopVideoRecorder()
        runCatching { captureSession?.abortCaptures() }
        captureSession?.close()
        captureSession = null
        cameraDevice?.close()
        cameraDevice = null
        runCatching { arSession?.close() }
        arSession = null
        collectorStatus["camera2"] = "closed"
        collectorStatus["sharedCamera"] = "closed"
        collectorStatus["arcore"] = "closed"
        return mapOf("videoBytes" to videoBytes)
    }

    private fun failSession(message: String, error: Throwable?) {
        lifecycleMachine.fail()
        currentSession?.let {
            artifactStore.appendLifecycleEvent(
                it,
                "session_failed",
                mapOf("message" to message, "error" to error?.javaClass?.simpleName),
            )
            artifactStore.writeManifest(
                artifacts = it,
                status = "error",
                lifecycleState = lifecycleMachine.state,
                collectorStatus = collectorStatus,
                additionalMetadata = mapOf(
                    "failureMessage" to message,
                    "cameraId" to collectorStatus["cameraId"],
                ),
            )
        }
        closeRuntime()
        lifecycleMachine.markPreviewReady()
        emitStatus(message, "mRL-2-1", "mRL-2-2", message)
    }

    private fun prepareOutputRuntime(artifacts: SessionArtifacts, cameraId: String) {
        val recordingSize = selectRecordingSize(cameraId)
        videoRecorder?.release()
        videoRecorder = SessionVideoRecorder(artifacts.videoFile, recordingSize).also { recorder ->
            recorder.prepare()
        }
        collectorStatus["video"] = "prepared"
    }

    private fun selectRecordingSize(cameraId: String): Size {
        val streamMap = cameraManager.getCameraCharacteristics(cameraId)
            .get(CameraCharacteristics.SCALER_STREAM_CONFIGURATION_MAP)
            ?: error("No stream configuration map for camera $cameraId")
        val supportedSizes = streamMap.getOutputSizes(android.media.MediaRecorder::class.java)
            ?.sortedByDescending { it.width * it.height }
            .orEmpty()
        return supportedSizes.firstOrNull { it.width == 1280 && it.height == 720 }
            ?: supportedSizes.firstOrNull { it.width <= 1920 && it.height <= 1080 }
            ?: supportedSizes.firstOrNull()
            ?: Size(1280, 720)
    }

    private fun stopVideoRecorder(): Long {
        val recorder = videoRecorder ?: return currentSession?.videoFile?.length() ?: 0L
        val videoBytes = runCatching { recorder.stopAndRelease() }
            .onSuccess {
                collectorStatus["video"] = if (it > 0L) "captured" else "empty_output"
            }
            .onFailure {
                collectorStatus["video"] = "stop_failed_${it.javaClass.simpleName}"
            }
            .getOrDefault(currentSession?.videoFile?.length() ?: 0L)
        videoRecorder = null
        return videoBytes
    }

    private fun emitStatus(
        statusText: String,
        currentMicroRelease: String,
        nextMicroRelease: String,
        blocker: String?,
    ) {
        statusListener(
            SharedCameraUiState(
                lifecycleState = lifecycleMachine.state,
                statusText = statusText,
                currentSession = currentSession,
                currentMicroRelease = currentMicroRelease,
                nextMicroRelease = nextMicroRelease,
                blocker = blocker,
            ),
        )
    }
}
