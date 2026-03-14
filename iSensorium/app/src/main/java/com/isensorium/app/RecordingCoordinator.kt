package com.isensorium.app

import android.annotation.SuppressLint
import android.bluetooth.BluetoothManager
import android.bluetooth.le.ScanCallback
import android.bluetooth.le.ScanResult
import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.location.Location
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.SystemClock
import android.opengl.GLES11Ext
import android.opengl.GLES20
import android.opengl.GLSurfaceView
import androidx.camera.core.AspectRatio
import androidx.camera.core.CameraSelector
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.Preview
import androidx.camera.lifecycle.ProcessCameraProvider
import androidx.camera.video.FileOutputOptions
import androidx.camera.video.PendingRecording
import androidx.camera.video.Quality
import androidx.camera.video.QualitySelector
import androidx.camera.video.Recorder
import androidx.camera.video.Recording
import androidx.camera.video.VideoCapture
import androidx.camera.video.VideoRecordEvent
import androidx.camera.view.PreviewView
import androidx.core.content.ContextCompat
import androidx.core.content.PermissionChecker
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import com.google.android.gms.location.LocationCallback
import com.google.android.gms.location.LocationRequest
import com.google.android.gms.location.LocationResult
import com.google.android.gms.location.LocationServices
import com.google.android.gms.location.Priority
import com.google.ar.core.ArCoreApk
import com.google.ar.core.Config
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileWriter
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors
import javax.microedition.khronos.egl.EGLConfig
import javax.microedition.khronos.opengles.GL10

class RecordingCoordinator(
    private val context: Context,
    private val lifecycleOwner: LifecycleOwner,
    private val previewView: PreviewView,
    private val arCoreGlSurfaceView: GLSurfaceView,
    private val statusListener: (SessionUiState) -> Unit,
) : DefaultLifecycleObserver {

    private val sessionManager = SessionManager(context)
    private val cameraExecutor: ExecutorService = Executors.newSingleThreadExecutor()
    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val bluetoothManager = context.getSystemService(Context.BLUETOOTH_SERVICE) as BluetoothManager

    private val imuLogger = ImuLogger()
    private val gnssLogger = GnssLogger()
    private val bleLogger = BleLogger()
    private val arCoreLogger = ArCoreLogger()

    private var cameraProvider: ProcessCameraProvider? = null
    private var videoCapture: VideoCapture<Recorder>? = null
    private var analysis: ImageAnalysis? = null
    private var recording: Recording? = null
    private var currentSession: RecordingSession? = null

    init {
        lifecycleOwner.lifecycle.addObserver(this)
        arCoreGlSurfaceView.setEGLContextClientVersion(2)
        arCoreGlSurfaceView.preserveEGLContextOnPause = true
        arCoreGlSurfaceView.setRenderer(arCoreLogger)
        arCoreGlSurfaceView.renderMode = GLSurfaceView.RENDERMODE_CONTINUOUSLY
    }

    override fun onStop(owner: LifecycleOwner) {
        if (isRecording()) {
            stopSession()
        }
    }

    fun isRecording(): Boolean = recording != null

    fun startPreview(cameraSelector: CameraSelector) {
        val cameraProviderFuture = ProcessCameraProvider.getInstance(context)
        cameraProviderFuture.addListener(
            {
                cameraProvider = cameraProviderFuture.get()
                bindUseCases(cameraSelector)
            },
            ContextCompat.getMainExecutor(context),
        )
    }

    fun startSession() {
        if (recording != null) return

        val capture = videoCapture ?: run {
            statusListener(SessionUiState(false, null, "Camera is not ready yet."))
            return
        }

        val session = sessionManager.createSession()
        currentSession = session
        sessionManager.writeInitialManifest(session)
        statusListener(SessionUiState(false, session, "Session created. Preparing video + IMU + GNSS + BLE + ARCore."))

        imuLogger.start(sensorManager, session)
        gnssLogger.start(session)
        bleLogger.start(session)
        arCoreLogger.start(session)

        val outputOptions = FileOutputOptions.Builder(session.videoFile).build()
        val pendingRecording = capture.output
            .prepareRecording(context, outputOptions)
            .withAudioEnabled()

        startRecording(pendingRecording, session)
    }

    fun stopSession() {
        if (recording == null) return
        recording?.stop()
        recording = null
        stopCollectors()
        currentSession?.let {
            sessionManager.finalizeManifest(it, "stopped")
            statusListener(SessionUiState(false, it, "Session stopped. Review session directory for continuation."))
        }
    }

    fun shutdown() {
        if (isRecording()) {
            stopSession()
        }
        analysis?.clearAnalyzer()
        cameraProvider?.unbindAll()
        cameraExecutor.shutdown()
        lifecycleOwner.lifecycle.removeObserver(this)
    }

    fun onHostResume() {
        arCoreLogger.onResume()
        arCoreGlSurfaceView.onResume()
    }

    fun onHostPause() {
        arCoreLogger.onPause()
        arCoreGlSurfaceView.onPause()
    }

    @SuppressLint("MissingPermission")
    private fun startRecording(pendingRecording: PendingRecording, session: RecordingSession) {
        recording = pendingRecording.start(ContextCompat.getMainExecutor(context)) { event ->
            when (event) {
                is VideoRecordEvent.Start -> {
                    sessionManager.appendVideoEvent(
                        session,
                        VideoEvent(
                            type = "recording_start",
                            eventTimeMillis = System.currentTimeMillis(),
                            elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos(),
                            recordingStats = event.recordingStats,
                        ),
                    )
                    sessionManager.finalizeManifest(session, "recording")
                    statusListener(
                        SessionUiState(
                            recording = true,
                            session = session,
                            statusText = "Recording session ${session.sessionId}",
                            toastMessage = "MRL-2 collectors active",
                        ),
                    )
                }

                is VideoRecordEvent.Status -> {
                    sessionManager.appendVideoEvent(
                        session,
                        VideoEvent(
                            type = "recording_status",
                            eventTimeMillis = System.currentTimeMillis(),
                            elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos(),
                            recordingStats = event.recordingStats,
                        ),
                    )
                    statusListener(
                        SessionUiState(
                            recording = true,
                            session = session,
                            statusText = "Recording ${session.sessionId} (${event.recordingStats.numBytesRecorded} bytes, streams: ${session.activeStreamSummary()})",
                        ),
                    )
                }

                is VideoRecordEvent.Finalize -> {
                    stopCollectors()
                    sessionManager.appendVideoEvent(
                        session,
                        VideoEvent(
                            type = "recording_finalize",
                            eventTimeMillis = System.currentTimeMillis(),
                            elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos(),
                            recordingStats = event.recordingStats,
                            outputUri = event.outputResults.outputUri,
                            error = event.error.toString(),
                            cause = event.cause?.message,
                        ),
                    )
                    sessionManager.finalizeManifest(
                        session = session,
                        status = if (event.hasError()) "finalized_with_error" else "finalized",
                    )
                    recording?.close()
                    recording = null
                    statusListener(
                        SessionUiState(
                            recording = false,
                            session = session,
                            statusText = if (event.hasError()) {
                                "Session finalized with error: ${event.error}"
                            } else {
                                "Session finalized with extended sensors. Review directory."
                            },
                            toastMessage = if (event.hasError()) null else "Video + IMU + GNSS/BLE/AR session saved",
                        ),
                    )
                }
            }
        }
    }

    private fun stopCollectors() {
        imuLogger.stop()
        gnssLogger.stop()
        bleLogger.stop()
        arCoreLogger.stop()
    }

    private fun hasPermission(permission: String): Boolean =
        ContextCompat.checkSelfPermission(context, permission) == PermissionChecker.PERMISSION_GRANTED

    private fun bindUseCases(cameraSelector: CameraSelector) {
        val provider = cameraProvider ?: return
        val preview = Preview.Builder()
            .setTargetAspectRatio(AspectRatio.RATIO_16_9)
            .build()
            .also { it.surfaceProvider = previewView.surfaceProvider }

        val recorder = Recorder.Builder()
            .setQualitySelector(QualitySelector.from(Quality.FHD))
            .build()

        videoCapture = VideoCapture.withOutput(recorder)
        analysis = ImageAnalysis.Builder()
            .setTargetAspectRatio(AspectRatio.RATIO_16_9)
            .setBackpressureStrategy(ImageAnalysis.STRATEGY_KEEP_ONLY_LATEST)
            .build()
            .also { useCase ->
                useCase.setAnalyzer(cameraExecutor) { image ->
                    currentSession?.let { session ->
                        val frameTimestamp = FrameTimestamp(
                            sensorTimestampNs = image.imageInfo.timestamp,
                            elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos(),
                            wallTimeMillis = System.currentTimeMillis(),
                            rotationDegrees = image.imageInfo.rotationDegrees,
                        )
                        sessionManager.appendFrameTimestamp(session, frameTimestamp)
                    }
                    image.close()
                }
            }

        provider.unbindAll()
        provider.bindToLifecycle(
            lifecycleOwner,
            cameraSelector,
            preview,
            videoCapture,
            analysis,
        )

        statusListener(SessionUiState(false, currentSession, "Camera ready. Extended sensors can start."))
    }

    private inner class ImuLogger : SensorEventListener {
        private var session: RecordingSession? = null
        private var writer: FileWriter? = null

        fun start(sensorManager: SensorManager, recordingSession: RecordingSession) {
            session = recordingSession
            writer = FileWriter(recordingSession.imuFile, true).apply {
                append("sensor_type,event_timestamp_ns,elapsed_realtime_ns,wall_time_ms,x,y,z,accuracy\n")
                flush()
            }
            listOf(
                sensorManager.getDefaultSensor(Sensor.TYPE_ACCELEROMETER),
                sensorManager.getDefaultSensor(Sensor.TYPE_GYROSCOPE),
            ).forEach { sensor ->
                sensor?.let { sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME) }
            }
        }

        fun stop() {
            sensorManager.unregisterListener(this)
            writer?.flush()
            writer?.close()
            writer = null
            session = null
        }

        override fun onSensorChanged(event: SensorEvent) {
            val activeSession = session ?: return
            val activeWriter = writer ?: return
            val line = buildString {
                append(event.sensor.stringType)
                append(',')
                append(event.timestamp)
                append(',')
                append(SystemClock.elapsedRealtimeNanos())
                append(',')
                append(System.currentTimeMillis())
                append(',')
                append(event.values.getOrNull(0) ?: 0f)
                append(',')
                append(event.values.getOrNull(1) ?: 0f)
                append(',')
                append(event.values.getOrNull(2) ?: 0f)
                append(',')
                append(event.accuracy)
                append('\n')
            }
            synchronized(activeWriter) {
                activeWriter.append(line)
                activeWriter.flush()
            }
            activeSession.sensorSampleCount += 1
        }

        override fun onAccuracyChanged(sensor: Sensor?, accuracy: Int) = Unit
    }

    private inner class GnssLogger {
        private val fusedClient = LocationServices.getFusedLocationProviderClient(context)
        private var callback: LocationCallback? = null
        private var session: RecordingSession? = null
        private var writer: FileWriter? = null

        @SuppressLint("MissingPermission")
        fun start(recordingSession: RecordingSession) {
            if (!hasPermission(android.Manifest.permission.ACCESS_FINE_LOCATION)) {
                sessionManager.appendCollectorStatus(recordingSession, "gnss", "permission_denied")
                return
            }
            session = recordingSession
            writer = FileWriter(recordingSession.gnssFile, true).apply {
                append("provider,elapsed_realtime_ns,wall_time_ms,latitude,longitude,altitude,accuracy_m,speed_mps,bearing_deg,vertical_accuracy_m\n")
                flush()
            }
            val request = LocationRequest.Builder(Priority.PRIORITY_HIGH_ACCURACY, 1000L)
                .setMinUpdateIntervalMillis(500L)
                .build()
            callback = object : LocationCallback() {
                override fun onLocationResult(result: LocationResult) {
                    result.locations.forEach { location ->
                        appendLocation(recordingSession, location)
                    }
                }
            }
            callback?.let { fusedClient.requestLocationUpdates(request, it, context.mainLooper) }
            sessionManager.appendCollectorStatus(recordingSession, "gnss", "active")
        }

        fun stop() {
            callback?.let { fusedClient.removeLocationUpdates(it) }
            writer?.flush()
            writer?.close()
            writer = null
            session = null
            callback = null
        }

        private fun appendLocation(session: RecordingSession, location: Location) {
            val activeWriter = writer ?: return
            val line = buildString {
                append(location.provider ?: "unknown")
                append(',')
                append(SystemClock.elapsedRealtimeNanos())
                append(',')
                append(System.currentTimeMillis())
                append(',')
                append(location.latitude)
                append(',')
                append(location.longitude)
                append(',')
                append(location.altitude)
                append(',')
                append(location.accuracy)
                append(',')
                append(location.speed)
                append(',')
                append(location.bearing)
                append(',')
                append(if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) location.verticalAccuracyMeters else "")
                append('\n')
            }
            synchronized(activeWriter) {
                activeWriter.append(line)
                activeWriter.flush()
            }
            session.gnssSampleCount += 1
        }
    }

    private inner class BleLogger {
        private val bluetoothLeScanner get() = bluetoothManager.adapter?.bluetoothLeScanner
        private var session: RecordingSession? = null
        private var callback: ScanCallback? = null

        @SuppressLint("MissingPermission")
        fun start(recordingSession: RecordingSession) {
            if (!hasPermission(android.Manifest.permission.BLUETOOTH_SCAN) ||
                !hasPermission(android.Manifest.permission.BLUETOOTH_CONNECT)
            ) {
                sessionManager.appendCollectorStatus(recordingSession, "ble", "permission_denied")
                return
            }
            session = recordingSession
            val adapter = bluetoothManager.adapter
            if (adapter == null || !adapter.isEnabled) {
                sessionManager.appendCollectorStatus(recordingSession, "ble", "bluetooth_disabled")
                return
            }
            callback = object : ScanCallback() {
                override fun onScanResult(callbackType: Int, result: ScanResult) {
                    appendResult(recordingSession, callbackType, result)
                }

                override fun onBatchScanResults(results: MutableList<ScanResult>) {
                    results.forEach { appendResult(recordingSession, -1, it) }
                }

                override fun onScanFailed(errorCode: Int) {
                    sessionManager.appendBleEvent(
                        recordingSession,
                        BleEvent(
                            elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos(),
                            wallTimeMillis = System.currentTimeMillis(),
                            callbackType = "scan_failed",
                            address = null,
                            rssi = null,
                            name = null,
                            manufacturerDataHex = null,
                            errorCode = errorCode,
                        ),
                    )
                    sessionManager.appendCollectorStatus(recordingSession, "ble", "scan_failed_$errorCode")
                }
            }
            bluetoothLeScanner?.startScan(callback)
            sessionManager.appendCollectorStatus(recordingSession, "ble", "active")
        }

        @SuppressLint("MissingPermission")
        fun stop() {
            val activeCallback = callback
            if (activeCallback != null) {
                bluetoothLeScanner?.stopScan(activeCallback)
            }
            callback = null
            session = null
        }

        private fun appendResult(session: RecordingSession, callbackType: Int, result: ScanResult) {
            val manufacturerData = result.scanRecord?.manufacturerSpecificData
            val firstManufacturer = if (manufacturerData != null && manufacturerData.size() > 0) {
                manufacturerData.valueAt(0)?.joinToString("") { "%02x".format(it) }
            } else {
                null
            }
            sessionManager.appendBleEvent(
                session,
                BleEvent(
                    elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos(),
                    wallTimeMillis = System.currentTimeMillis(),
                    callbackType = callbackType.toString(),
                    address = result.device?.address,
                    rssi = result.rssi,
                    name = result.scanRecord?.deviceName,
                    manufacturerDataHex = firstManufacturer,
                    errorCode = null,
                ),
            )
            session.bleSampleCount += 1
        }
    }

    private inner class ArCoreLogger : GLSurfaceView.Renderer {
        private var session: RecordingSession? = null
        private var arSession: com.google.ar.core.Session? = null
        private var lastLoggedFrameAtNs: Long = 0L
        private var textureId: Int = 0
        private var hostResumed: Boolean = false
        private var started: Boolean = false

        fun start(recordingSession: RecordingSession) {
            session = recordingSession
            started = true
            val availability = ArCoreApk.getInstance().checkAvailability(context)
            sessionManager.appendCollectorStatus(recordingSession, "arcore", "availability_${availability.name.lowercase(Locale.US)}")
            if (availability.isUnsupported) {
                return
            }
        }

        override fun onSurfaceCreated(gl: GL10?, config: EGLConfig?) {
            textureId = createExternalTexture()
        }

        override fun onSurfaceChanged(gl: GL10?, width: Int, height: Int) = Unit

        override fun onDrawFrame(gl: GL10?) {
            val recordingSession = session ?: return
            if (!started || !hostResumed) return

            if (arSession == null) {
                tryCreateSession(recordingSession)
            }

            val activeSession = arSession ?: return
            if (textureId != 0) {
                activeSession.setCameraTextureName(textureId)
            }

            try {
                val frame = activeSession.update()
                val nowNs = SystemClock.elapsedRealtimeNanos()
                if (nowNs - lastLoggedFrameAtNs < 200_000_000L) {
                    return
                }
                val camera = frame.camera
                val pose = camera.displayOrientedPose
                sessionManager.appendArCorePose(
                    recordingSession,
                    ArCorePoseSample(
                        elapsedRealtimeNanos = nowNs,
                        wallTimeMillis = System.currentTimeMillis(),
                        trackingState = camera.trackingState.name,
                        translation = pose.translation.toList(),
                        rotationQuaternion = pose.rotationQuaternion.toList(),
                    ),
                )
                recordingSession.arCoreSampleCount += 1
                lastLoggedFrameAtNs = nowNs
                if (recordingSession.arCoreSampleCount == 1L) {
                    sessionManager.appendCollectorStatus(recordingSession, "arcore", "active")
                }
            } catch (error: Exception) {
                if (lastLoggedFrameAtNs == 0L) {
                    sessionManager.appendCollectorStatus(recordingSession, "arcore", "update_failed_${error.javaClass.simpleName}")
                    lastLoggedFrameAtNs = SystemClock.elapsedRealtimeNanos()
                }
            }
        }

        private fun tryCreateSession(recordingSession: RecordingSession) {
            try {
                val createdSession = com.google.ar.core.Session(context)
                createdSession.configure(
                    Config(createdSession).apply {
                        updateMode = Config.UpdateMode.LATEST_CAMERA_IMAGE
                    },
                )
                createdSession.resume()
                arSession = createdSession
                sessionManager.appendCollectorStatus(recordingSession, "arcore", "gl_session_ready")
            } catch (error: Exception) {
                sessionManager.appendCollectorStatus(recordingSession, "arcore", "init_failed_${error.javaClass.simpleName}")
                started = false
            }
        }

        fun stop() {
            runCatching { arSession?.pause() }
            runCatching { arSession?.close() }
            arSession = null
            session = null
            lastLoggedFrameAtNs = 0L
            started = false
        }

        fun onResume() {
            hostResumed = true
        }

        fun onPause() {
            hostResumed = false
            runCatching { arSession?.pause() }
        }

        private fun createExternalTexture(): Int {
            val textures = IntArray(1)
            GLES20.glGenTextures(1, textures, 0)
            GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, textures[0])
            GLES20.glTexParameteri(
                GLES11Ext.GL_TEXTURE_EXTERNAL_OES,
                GLES20.GL_TEXTURE_MIN_FILTER,
                GLES20.GL_LINEAR,
            )
            GLES20.glTexParameteri(
                GLES11Ext.GL_TEXTURE_EXTERNAL_OES,
                GLES20.GL_TEXTURE_MAG_FILTER,
                GLES20.GL_LINEAR,
            )
            GLES20.glTexParameteri(
                GLES11Ext.GL_TEXTURE_EXTERNAL_OES,
                GLES20.GL_TEXTURE_WRAP_S,
                GLES20.GL_CLAMP_TO_EDGE,
            )
            GLES20.glTexParameteri(
                GLES11Ext.GL_TEXTURE_EXTERNAL_OES,
                GLES20.GL_TEXTURE_WRAP_T,
                GLES20.GL_CLAMP_TO_EDGE,
            )
            return textures[0]
        }
    }
}

data class SessionUiState(
    val recording: Boolean,
    val session: RecordingSession?,
    val statusText: String,
    val toastMessage: String? = null,
)

data class RecordingSession(
    val sessionId: String,
    val sessionDir: File,
    val manifestFile: File,
    val videoFile: File,
    val imuFile: File,
    val gnssFile: File,
    val bleFile: File,
    val arCoreFile: File,
    val frameTimestampsFile: File,
    val videoEventsFile: File,
    val timebase: SessionTimebase,
    var sensorSampleCount: Long = 0L,
    var gnssSampleCount: Long = 0L,
    var bleSampleCount: Long = 0L,
    var arCoreSampleCount: Long = 0L,
) {
    fun listOutputFiles(): List<File> = listOf(
        manifestFile,
        videoFile,
        imuFile,
        gnssFile,
        bleFile,
        arCoreFile,
        frameTimestampsFile,
        videoEventsFile,
    ).filter { it.exists() }

    fun activeStreamSummary(): String =
        "imu=$sensorSampleCount gps=$gnssSampleCount ble=$bleSampleCount ar=$arCoreSampleCount"
}

data class SessionTimebase(
    val sessionStartWallTimeMs: Long,
    val sessionStartElapsedRealtimeNanos: Long,
)

data class FrameTimestamp(
    val sensorTimestampNs: Long,
    val elapsedRealtimeNanos: Long,
    val wallTimeMillis: Long,
    val rotationDegrees: Int,
)

data class VideoEvent(
    val type: String,
    val eventTimeMillis: Long,
    val elapsedRealtimeNanos: Long,
    val recordingStats: androidx.camera.video.RecordingStats,
    val outputUri: Uri? = null,
    val error: String? = null,
    val cause: String? = null,
)

data class BleEvent(
    val elapsedRealtimeNanos: Long,
    val wallTimeMillis: Long,
    val callbackType: String,
    val address: String?,
    val rssi: Int?,
    val name: String?,
    val manufacturerDataHex: String?,
    val errorCode: Int?,
)

data class ArCorePoseSample(
    val elapsedRealtimeNanos: Long,
    val wallTimeMillis: Long,
    val trackingState: String,
    val translation: List<Float>,
    val rotationQuaternion: List<Float>,
)

class SessionManager(private val context: Context) {
    private val timestampFormat = SimpleDateFormat("yyyyMMdd-HHmmss", Locale.US)

    fun createSession(): RecordingSession {
        val startedWall = System.currentTimeMillis()
        val startedMono = SystemClock.elapsedRealtimeNanos()
        val sessionId = "session-${timestampFormat.format(Date(startedWall))}"
        val root = File(
            context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS),
            "sessions/$sessionId",
        )
        root.mkdirs()

        return RecordingSession(
            sessionId = sessionId,
            sessionDir = root,
            manifestFile = File(root, "session_manifest.json"),
            videoFile = File(root, "video.mp4"),
            imuFile = File(root, "imu.csv"),
            gnssFile = File(root, "gnss.csv"),
            bleFile = File(root, "ble_scan.jsonl"),
            arCoreFile = File(root, "arcore_pose.jsonl"),
            frameTimestampsFile = File(root, "video_frame_timestamps.csv"),
            videoEventsFile = File(root, "video_events.jsonl"),
            timebase = SessionTimebase(startedWall, startedMono),
        )
    }

    fun writeInitialManifest(session: RecordingSession) {
        session.manifestFile.writeText(
            JSONObject()
                .put("sessionId", session.sessionId)
                .put("status", "initialized")
                .put("deviceModel", Build.MODEL)
                .put("recordingRoot", session.sessionDir.absolutePath)
                .put(
                    "timebase",
                    JSONObject()
                        .put("sessionStartWallTimeMs", session.timebase.sessionStartWallTimeMs)
                        .put("sessionStartElapsedRealtimeNanos", session.timebase.sessionStartElapsedRealtimeNanos),
                )
                .put(
                    "streams",
                    JSONArray()
                        .put(JSONObject().put("name", "video").put("file", session.videoFile.name).put("frameTimestampsFile", session.frameTimestampsFile.name))
                        .put(JSONObject().put("name", "imu").put("file", session.imuFile.name))
                        .put(JSONObject().put("name", "gnss").put("file", session.gnssFile.name))
                        .put(JSONObject().put("name", "ble").put("file", session.bleFile.name))
                        .put(JSONObject().put("name", "arcore").put("file", session.arCoreFile.name)),
                )
                .put("collectorStatus", JSONObject())
                .toString(2),
        )
    }

    fun finalizeManifest(session: RecordingSession, status: String) {
        val manifest = JSONObject(
            session.manifestFile.takeIf { it.exists() }?.readText()
                ?: JSONObject().put("sessionId", session.sessionId).toString(),
        )
        manifest.put("status", status)
        manifest.put("imuSampleCount", session.sensorSampleCount)
        manifest.put("gnssSampleCount", session.gnssSampleCount)
        manifest.put("bleSampleCount", session.bleSampleCount)
        manifest.put("arCoreSampleCount", session.arCoreSampleCount)
        manifest.put(
            "files",
            JSONArray().apply {
                session.listOutputFiles().forEach { file ->
                    put(JSONObject().put("name", file.name).put("sizeBytes", file.length()))
                }
            },
        )
        session.manifestFile.writeText(manifest.toString(2))
    }

    fun appendCollectorStatus(session: RecordingSession, collector: String, status: String) {
        val manifest = JSONObject(session.manifestFile.readText())
        val statusObject = manifest.optJSONObject("collectorStatus") ?: JSONObject()
        statusObject.put(collector, status)
        manifest.put("collectorStatus", statusObject)
        session.manifestFile.writeText(manifest.toString(2))
    }

    fun appendFrameTimestamp(session: RecordingSession, frameTimestamp: FrameTimestamp) {
        if (!session.frameTimestampsFile.exists()) {
            session.frameTimestampsFile.writeText(
                "camera_sensor_timestamp_ns,elapsed_realtime_ns,wall_time_ms,rotation_degrees,session_elapsed_ns\n",
            )
        }
        val sessionElapsed = frameTimestamp.elapsedRealtimeNanos - session.timebase.sessionStartElapsedRealtimeNanos
        session.frameTimestampsFile.appendText(
            "${frameTimestamp.sensorTimestampNs},${frameTimestamp.elapsedRealtimeNanos},${frameTimestamp.wallTimeMillis},${frameTimestamp.rotationDegrees},$sessionElapsed\n",
        )
    }

    fun appendVideoEvent(session: RecordingSession, event: VideoEvent) {
        val payload = JSONObject()
            .put("type", event.type)
            .put("eventTimeMillis", event.eventTimeMillis)
            .put("elapsedRealtimeNanos", event.elapsedRealtimeNanos)
            .put("bytesRecorded", event.recordingStats.numBytesRecorded)
            .put("durationNanos", event.recordingStats.recordedDurationNanos)
            .put("outputUri", event.outputUri?.toString())
            .put("error", event.error)
            .put("cause", event.cause)
        session.videoEventsFile.appendText("${payload}\n")
    }

    fun appendBleEvent(session: RecordingSession, event: BleEvent) {
        val payload = JSONObject()
            .put("elapsedRealtimeNanos", event.elapsedRealtimeNanos)
            .put("wallTimeMillis", event.wallTimeMillis)
            .put("callbackType", event.callbackType)
            .put("address", event.address)
            .put("rssi", event.rssi)
            .put("name", event.name)
            .put("manufacturerDataHex", event.manufacturerDataHex)
            .put("errorCode", event.errorCode)
        session.bleFile.appendText("${payload}\n")
    }

    fun appendArCorePose(session: RecordingSession, sample: ArCorePoseSample) {
        val payload = JSONObject()
            .put("elapsedRealtimeNanos", sample.elapsedRealtimeNanos)
            .put("wallTimeMillis", sample.wallTimeMillis)
            .put("trackingState", sample.trackingState)
            .put("translation", JSONArray(sample.translation))
            .put("rotationQuaternion", JSONArray(sample.rotationQuaternion))
        session.arCoreFile.appendText("${payload}\n")
    }
}
