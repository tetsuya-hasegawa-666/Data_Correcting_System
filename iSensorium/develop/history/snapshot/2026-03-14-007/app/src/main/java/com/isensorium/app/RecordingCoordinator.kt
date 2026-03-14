package com.isensorium.app

import android.annotation.SuppressLint
import android.content.ContentValues
import android.content.Context
import android.hardware.Sensor
import android.hardware.SensorEvent
import android.hardware.SensorEventListener
import android.hardware.SensorManager
import android.net.Uri
import android.os.Build
import android.os.Environment
import android.os.SystemClock
import android.provider.MediaStore
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
import androidx.lifecycle.DefaultLifecycleObserver
import androidx.lifecycle.LifecycleOwner
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.FileWriter
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale
import java.util.concurrent.ExecutorService
import java.util.concurrent.Executors

class RecordingCoordinator(
    private val context: Context,
    private val lifecycleOwner: LifecycleOwner,
    private val previewView: PreviewView,
    private val statusListener: (SessionUiState) -> Unit,
) : DefaultLifecycleObserver {

    private val sessionManager = SessionManager(context)
    private val cameraExecutor: ExecutorService = Executors.newSingleThreadExecutor()
    private val sensorManager = context.getSystemService(Context.SENSOR_SERVICE) as SensorManager
    private val imuLogger = ImuLogger()

    private var cameraProvider: ProcessCameraProvider? = null
    private var videoCapture: VideoCapture<Recorder>? = null
    private var analysis: ImageAnalysis? = null
    private var recording: Recording? = null
    private var currentSession: RecordingSession? = null

    init {
        lifecycleOwner.lifecycle.addObserver(this)
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
        statusListener(SessionUiState(false, session, "Session created. Preparing video + IMU capture."))

        imuLogger.start(sensorManager, session)

        val outputOptions = FileOutputOptions.Builder(session.videoFile).build()
        val pendingRecording = capture.output
            .prepareRecording(context, outputOptions)
            .withAudioEnabled()

        startRecording(pendingRecording, session)
    }

    fun stopSession() {
        recording?.stop()
        recording = null
        imuLogger.stop()
        currentSession?.let {
            sessionManager.finalizeManifest(it, "stopped")
            statusListener(SessionUiState(false, it, "Session stopped. Review session directory for continuation."))
        }
    }

    fun shutdown() {
        stopSession()
        analysis?.clearAnalyzer()
        cameraProvider?.unbindAll()
        cameraExecutor.shutdown()
        lifecycleOwner.lifecycle.removeObserver(this)
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
                            toastMessage = "mRL-0-1 complete: session started",
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
                            statusText = "Recording session ${session.sessionId} (${event.recordingStats.numBytesRecorded} bytes)",
                        ),
                    )
                }

                is VideoRecordEvent.Finalize -> {
                    imuLogger.stop()
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
                                "Session finalized. mRL-0-2 / mRL-0-3 evidence ready."
                            },
                            toastMessage = if (event.hasError()) null else "Video + IMU saved to one session",
                        ),
                    )
                }
            }
        }
    }

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
                        sessionManager.appendFrameTimestamp(
                            session = session,
                            frameTimestamp = FrameTimestamp(
                                sensorTimestampNs = image.imageInfo.timestamp,
                                elapsedRealtimeNanos = SystemClock.elapsedRealtimeNanos(),
                                wallTimeMillis = System.currentTimeMillis(),
                                rotationDegrees = image.imageInfo.rotationDegrees,
                            ),
                        )
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

        statusListener(SessionUiState(false, currentSession, "Camera ready. Start mRL-0-1."))
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
                sensor?.let {
                    sensorManager.registerListener(this, it, SensorManager.SENSOR_DELAY_GAME)
                }
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
    val frameTimestampsFile: File,
    val videoEventsFile: File,
    val timebase: SessionTimebase,
    var sensorSampleCount: Long = 0L,
) {
    fun listOutputFiles(): List<File> = listOf(manifestFile, videoFile, imuFile, frameTimestampsFile, videoEventsFile)
        .filter { it.exists() }
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
            frameTimestampsFile = File(root, "video_frame_timestamps.csv"),
            videoEventsFile = File(root, "video_events.jsonl"),
            timebase = SessionTimebase(
                sessionStartWallTimeMs = startedWall,
                sessionStartElapsedRealtimeNanos = startedMono,
            ),
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
                        .put(
                            JSONObject()
                                .put("name", "video")
                                .put("file", session.videoFile.name)
                                .put("frameTimestampsFile", session.frameTimestampsFile.name),
                        )
                        .put(
                            JSONObject()
                                .put("name", "imu")
                                .put("file", session.imuFile.name),
                        ),
                )
                .toString(2),
        )
    }

    fun finalizeManifest(session: RecordingSession, status: String) {
        val manifest = JSONObject(
            session.manifestFile.takeIf { it.exists() }?.readText()
                ?: JSONObject().put("sessionId", session.sessionId).toString(),
        )
        manifest.put("status", status)
        manifest.put("sensorSampleCount", session.sensorSampleCount)
        manifest.put(
            "files",
            JSONArray().apply {
                session.listOutputFiles().forEach { file ->
                    put(
                        JSONObject()
                            .put("name", file.name)
                            .put("sizeBytes", file.length()),
                    )
                }
            },
        )
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
}
