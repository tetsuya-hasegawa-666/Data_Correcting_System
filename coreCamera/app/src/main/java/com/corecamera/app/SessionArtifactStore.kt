package com.corecamera.app

import android.content.Context
import android.os.Build
import android.os.Environment
import android.os.SystemClock
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.io.Writer
import java.text.SimpleDateFormat
import java.util.Date
import java.util.Locale

data class SessionArtifacts(
    val sessionId: String,
    val sessionDir: File,
    val manifestFile: File,
    val videoFile: File,
    val imuFile: File,
    val gnssFile: File,
    val bleFile: File,
    val arcoreFile: File,
    val frameTimestampFile: File,
    val videoEventsFile: File,
    val startedWallTimeMs: Long,
    val startedElapsedRealtimeNs: Long,
)

class SessionArtifactStore(private val context: Context) {
    private val timestampFormat = SimpleDateFormat("yyyyMMdd-HHmmss", Locale.US)

    fun createSession(): SessionArtifacts {
        val startedWallTimeMs = System.currentTimeMillis()
        val startedElapsedRealtimeNs = SystemClock.elapsedRealtimeNanos()
        val sessionId = "session-${timestampFormat.format(Date(startedWallTimeMs))}"
        val sessionDir = File(
            context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS),
            "sessions/$sessionId",
        ).apply { mkdirs() }

        val artifacts = SessionArtifacts(
            sessionId = sessionId,
            sessionDir = sessionDir,
            manifestFile = File(sessionDir, "session_manifest.json"),
            videoFile = File(sessionDir, "video.mp4"),
            imuFile = File(sessionDir, "imu.csv"),
            gnssFile = File(sessionDir, "gnss.csv"),
            bleFile = File(sessionDir, "ble_scan.jsonl"),
            arcoreFile = File(sessionDir, "arcore_pose.jsonl"),
            frameTimestampFile = File(sessionDir, "video_frame_timestamps.csv"),
            videoEventsFile = File(sessionDir, "video_events.jsonl"),
            startedWallTimeMs = startedWallTimeMs,
            startedElapsedRealtimeNs = startedElapsedRealtimeNs,
        )

        ensureContractFilesExist(artifacts)
        writeManifest(
            artifacts = artifacts,
            status = "initialized",
            lifecycleState = SharedCameraLifecycleState.IDLE,
            collectorStatus = emptyMap(),
        )
        appendLifecycleEvent(artifacts, "session_initialized", emptyMap())
        return artifacts
    }

    fun ensureContractFilesExist(artifacts: SessionArtifacts) {
        listOf(
            artifacts.imuFile,
            artifacts.gnssFile,
            artifacts.bleFile,
            artifacts.arcoreFile,
            artifacts.frameTimestampFile,
            artifacts.videoEventsFile,
        ).forEach { file ->
            if (!file.exists()) {
                file.parentFile?.mkdirs()
                file.createNewFile()
            }
        }
        if (artifacts.frameTimestampFile.length() == 0L) {
            artifacts.frameTimestampFile.writeText(
                "camera_sensor_timestamp_ns,elapsed_realtime_ns,wall_time_ms,frame_number,session_elapsed_ns\n",
            )
        }
        if (artifacts.imuFile.length() == 0L) {
            artifacts.imuFile.writeText(
                "sensor_type,event_timestamp_ns,elapsed_realtime_ns,wall_time_ms,x,y,z,accuracy,session_elapsed_ns\n",
            )
        }
        if (artifacts.gnssFile.length() == 0L) {
            artifacts.gnssFile.writeText(
                "provider,elapsed_realtime_ns,wall_time_ms,latitude,longitude,altitude,accuracy_m,speed_mps,bearing_deg,vertical_accuracy_m,session_elapsed_ns\n",
            )
        }
    }

    fun writeManifest(
        artifacts: SessionArtifacts,
        status: String,
        lifecycleState: SharedCameraLifecycleState,
        collectorStatus: Map<String, String>,
        additionalMetadata: Map<String, Any?> = emptyMap(),
    ) {
        val analysis = SessionContinuityAnalyzer.analyze(artifacts)
        val analysisJson = SessionContinuityAnalyzer.toJson(analysis)
        val integrationPlanJson = IntegrationCutoverPlanner.buildManifestSection(analysis)
        val integrationRecommendation = IntegrationRecommendationPlanner.build(analysis, collectorStatus)
        val upstreamTrialPackage = UpstreamTrialPackagePlanner.build(artifacts, analysis)
        val manifest = JSONObject()
            .put("sessionId", artifacts.sessionId)
            .put("status", status)
            .put("marketReleaseLine", ReplacementCameraContract.marketReleaseLine)
            .put("activePlanSet", ReplacementCameraContract.activePlanSet)
            .put("adapterSeamId", ReplacementCameraContract.adapterSeamId)
            .put("deviceModel", Build.MODEL)
            .put("recordingRoot", artifacts.sessionDir.absolutePath)
            .put("lifecycleState", lifecycleState.name)
            .put(
                "timebase",
                JSONObject()
                    .put("sessionStartWallTimeMs", artifacts.startedWallTimeMs)
                    .put("sessionStartElapsedRealtimeNanos", artifacts.startedElapsedRealtimeNs),
            )
            .put(
                "streams",
                JSONArray().apply { buildStreamEntries(artifacts).forEach(::put) },
            )
            .put(
                "collectorStatus",
                JSONObject().apply {
                    collectorStatus.forEach { (key, value) ->
                        put(key, value)
                    }
                },
            )
            .put(
                "compatibility",
                JSONObject()
                    .put("frozenContractSource", "iSensorium SessionManager / RecordingCoordinator")
                    .put("preservedFileNames", JSONArray(ReplacementCameraContract.requiredFileNames))
                    .put("preservedOperations", JSONArray().put("startSession").put("stopSession").put("findLatestSession"))
                    .put("notes", buildCompatibilityNote(artifacts)),
            )
            .put(
                "files",
                JSONArray().apply {
                    ReplacementCameraContract.requiredFileNames.forEach { fileName ->
                        val file = File(artifacts.sessionDir, fileName)
                        put(JSONObject().put("name", fileName).put("exists", file.exists()).put("sizeBytes", file.length()))
                    }
                },
            )
            .put("continuityValidation", analysisJson.getJSONObject("continuityValidation"))
            .put("timestampContract", analysisJson.getJSONObject("timestampContract"))
            .put("swapReadiness", analysisJson.getJSONObject("swapReadiness"))
            .put("integrationAdapterPlan", integrationPlanJson)
            .put("integrationRecommendation", IntegrationRecommendationPlanner.toJson(integrationRecommendation))
            .put("upstreamTrialPackage", UpstreamTrialPackagePlanner.toJson(upstreamTrialPackage))

        additionalMetadata.forEach { (key, value) ->
            manifest.put(key, value)
        }

        artifacts.manifestFile.writeText(manifest.toString(2))
    }

    fun appendLifecycleEvent(
        artifacts: SessionArtifacts,
        type: String,
        metadata: Map<String, Any?>,
    ) {
        val payload = JSONObject()
            .put("type", type)
            .put("eventTimeMillis", System.currentTimeMillis())
            .put("elapsedRealtimeNanos", SystemClock.elapsedRealtimeNanos())
        metadata.forEach { (key, value) ->
            payload.put(key, value)
        }
        artifacts.videoEventsFile.appendText("$payload\n")
    }

    fun appendFrameTimestamp(
        artifacts: SessionArtifacts,
        sensorTimestampNs: Long?,
        frameNumber: Long?,
    ) {
        val elapsedRealtimeNs = SystemClock.elapsedRealtimeNanos()
        val sessionElapsedNs = elapsedRealtimeNs - artifacts.startedElapsedRealtimeNs
        artifacts.frameTimestampFile.appendText(
            "${sensorTimestampNs ?: -1},$elapsedRealtimeNs,${System.currentTimeMillis()},${frameNumber ?: -1},$sessionElapsedNs\n",
        )
    }

    fun appendArCorePose(
        artifacts: SessionArtifacts,
        frameTimestampNs: Long,
        trackingState: String,
        translation: FloatArray,
        rotationQuaternion: FloatArray,
    ) {
        val elapsedRealtimeNs = SystemClock.elapsedRealtimeNanos()
        val payload = JSONObject()
            .put("frameTimestampNs", frameTimestampNs)
            .put("eventTimeMillis", System.currentTimeMillis())
            .put("elapsedRealtimeNanos", elapsedRealtimeNs)
            .put("sessionElapsedNanos", elapsedRealtimeNs - artifacts.startedElapsedRealtimeNs)
            .put("trackingState", trackingState)
            .put("translation", JSONArray().apply { translation.forEach(::put) })
            .put("rotationQuaternion", JSONArray().apply { rotationQuaternion.forEach(::put) })
        artifacts.arcoreFile.appendText("$payload\n")
    }

    fun appendImuSample(
        artifacts: SessionArtifacts,
        sensorType: String,
        eventTimestampNs: Long,
        elapsedRealtimeNs: Long,
        wallTimeMs: Long,
        x: Float,
        y: Float,
        z: Float,
        accuracy: Int,
        writer: Writer? = null,
    ) {
        val sessionElapsedNs = elapsedRealtimeNs - artifacts.startedElapsedRealtimeNs
        val line = "$sensorType,$eventTimestampNs,$elapsedRealtimeNs,$wallTimeMs,$x,$y,$z,$accuracy,$sessionElapsedNs\n"
        if (writer != null) {
            synchronized(writer) {
                writer.write(line)
            }
        } else {
            artifacts.imuFile.appendText(line)
        }
    }

    fun appendGnssSample(
        artifacts: SessionArtifacts,
        provider: String,
        elapsedRealtimeNs: Long,
        wallTimeMs: Long,
        latitude: Double,
        longitude: Double,
        altitude: Double,
        accuracyMeters: Float,
        speedMetersPerSecond: Float,
        bearingDegrees: Float,
        verticalAccuracyMeters: Float?,
        writer: Writer? = null,
    ) {
        val sessionElapsedNs = elapsedRealtimeNs - artifacts.startedElapsedRealtimeNs
        val line = "$provider,$elapsedRealtimeNs,$wallTimeMs,$latitude,$longitude,$altitude,$accuracyMeters,$speedMetersPerSecond,$bearingDegrees,${verticalAccuracyMeters ?: ""},$sessionElapsedNs\n"
        if (writer != null) {
            synchronized(writer) {
                writer.write(line)
            }
        } else {
            artifacts.gnssFile.appendText(line)
        }
    }

    fun appendBleSample(
        artifacts: SessionArtifacts,
        elapsedRealtimeNs: Long,
        wallTimeMs: Long,
        callbackType: String,
        address: String?,
        rssi: Int?,
        name: String?,
        manufacturerDataHex: String?,
        errorCode: Int?,
        writer: Writer? = null,
    ) {
        val payload = JSONObject()
            .put("elapsedRealtimeNanos", elapsedRealtimeNs)
            .put("wallTimeMillis", wallTimeMs)
            .put("sessionElapsedNanos", elapsedRealtimeNs - artifacts.startedElapsedRealtimeNs)
            .put("callbackType", callbackType)
            .put("address", address)
            .put("rssi", rssi)
            .put("name", name)
            .put("manufacturerDataHex", manufacturerDataHex)
            .put("errorCode", errorCode)
        val line = "$payload\n"
        if (writer != null) {
            synchronized(writer) {
                writer.write(line)
            }
        } else {
            artifacts.bleFile.appendText(line)
        }
    }

    fun collectOutputMetrics(artifacts: SessionArtifacts): Map<String, Any> = mapOf(
        "videoBytes" to artifacts.videoFile.length(),
        "frameTimestampRows" to countDataLines(artifacts.frameTimestampFile, hasHeader = true),
        "arcorePoseRows" to countDataLines(artifacts.arcoreFile, hasHeader = false),
        "swapReadinessStatus" to evaluateSession(artifacts).swapReadinessStatus,
    )

    fun finalizeSession(
        artifacts: SessionArtifacts,
        lifecycleState: SharedCameraLifecycleState,
        collectorStatus: Map<String, String>,
        additionalMetadata: Map<String, Any?> = emptyMap(),
    ) {
        writeManifest(
            artifacts = artifacts,
            status = "stopped",
            lifecycleState = lifecycleState,
            collectorStatus = collectorStatus,
            additionalMetadata = additionalMetadata,
        )
        appendLifecycleEvent(artifacts, "session_stopped", additionalMetadata)
    }

    fun findLatestSession(): SessionArtifacts? {
        val sessionsRoot = File(
            context.getExternalFilesDir(Environment.DIRECTORY_DOCUMENTS),
            "sessions",
        )
        val latestDir = sessionsRoot.listFiles { file -> file.isDirectory && file.name.startsWith("session-") }
            ?.maxByOrNull { it.name }
            ?: return null

        val manifest = latestDir.resolve("session_manifest.json").takeIf(File::exists)?.readText()?.let(::JSONObject)
        val timebase = manifest?.optJSONObject("timebase")
        return SessionArtifacts(
            sessionId = latestDir.name,
            sessionDir = latestDir,
            manifestFile = latestDir.resolve("session_manifest.json"),
            videoFile = latestDir.resolve("video.mp4"),
            imuFile = latestDir.resolve("imu.csv"),
            gnssFile = latestDir.resolve("gnss.csv"),
            bleFile = latestDir.resolve("ble_scan.jsonl"),
            arcoreFile = latestDir.resolve("arcore_pose.jsonl"),
            frameTimestampFile = latestDir.resolve("video_frame_timestamps.csv"),
            videoEventsFile = latestDir.resolve("video_events.jsonl"),
            startedWallTimeMs = timebase?.optLong("sessionStartWallTimeMs") ?: latestDir.lastModified(),
            startedElapsedRealtimeNs = timebase?.optLong("sessionStartElapsedRealtimeNanos") ?: 0L,
        )
    }

    fun evaluateSession(artifacts: SessionArtifacts): SessionAnalysis = SessionContinuityAnalyzer.analyze(artifacts)

    private fun buildStreamEntries(artifacts: SessionArtifacts): List<JSONObject> =
        ReplacementCameraContract.requiredStreamDescriptors.map { descriptor ->
            val file = File(artifacts.sessionDir, descriptor.fileName)
            val dataRows = when (descriptor.fileName) {
                "video.mp4" -> 0
                "video_frame_timestamps.csv" -> countDataLines(file, hasHeader = true)
                "imu.csv", "gnss.csv" -> countDataLines(file, hasHeader = true)
                else -> countDataLines(file, hasHeader = false)
            }
            JSONObject()
                .put("name", descriptor.name)
                .put("file", descriptor.fileName)
                .put("exists", file.exists())
                .put("sizeBytes", file.length())
                .put("dataRows", dataRows)
                .put("outputState", resolveOutputState(descriptor.fileName, file, dataRows))
        } + listOf(
            streamFileEntry("video_frame_timestamps", artifacts.frameTimestampFile, countDataLines(artifacts.frameTimestampFile, hasHeader = true)),
            streamFileEntry("video_events", artifacts.videoEventsFile, countDataLines(artifacts.videoEventsFile, hasHeader = false)),
        )

    private fun streamFileEntry(name: String, file: File, dataRows: Int): JSONObject =
        JSONObject()
            .put("name", name)
            .put("file", file.name)
            .put("exists", file.exists())
            .put("sizeBytes", file.length())
            .put("dataRows", dataRows)
            .put("outputState", resolveOutputState(file.name, file, dataRows))

    private fun resolveOutputState(fileName: String, file: File, dataRows: Int): String =
        when {
            !file.exists() -> "missing"
            fileName == "video.mp4" && file.length() > 0L -> "captured"
            fileName == "video.mp4" -> "pending"
            fileName == "imu.csv" || fileName == "gnss.csv" || fileName == "ble_scan.jsonl" -> {
                if (dataRows > 0 || file.length() > 0L) "captured" else "placeholder"
            }
            dataRows > 0 -> "captured"
            else -> "pending"
        }

    private fun buildCompatibilityNote(artifacts: SessionArtifacts): String {
        val videoReady = artifacts.videoFile.length() > 0L
        val poseReady = countDataLines(artifacts.arcoreFile, hasHeader = false) > 0
        val sensorsReady =
            countDataLines(artifacts.imuFile, hasHeader = true) > 0 &&
                countDataLines(artifacts.gnssFile, hasHeader = true) > 0 &&
                countDataLines(artifacts.bleFile, hasHeader = false) > 0
        return if (videoReady && poseReady && sensorsReady) {
            "MRL-7 preserves the outer session contract, emits shared-camera and full sensor evidence, and packages the guarded upstream trial boundary from the isolated adapter."
        } else if (videoReady && poseReady) {
            "MRL-5 preserves the outer session contract, emits shared-camera evidence, and records continuity plus swap-readiness evaluation from the isolated adapter."
        } else {
            "MRL-5 preserves the outer session contract while the isolated adapter is still collecting continuity-validation evidence."
        }
    }

    private fun countDataLines(file: File, hasHeader: Boolean): Int {
        if (!file.exists() || file.length() == 0L) {
            return 0
        }
        val lineCount = file.useLines { lines -> lines.count { it.isNotBlank() } }
        return if (hasHeader) (lineCount - 1).coerceAtLeast(0) else lineCount
    }
}
