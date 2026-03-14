package com.corecamera.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertFalse
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File
import kotlin.io.path.createTempDirectory

class SessionContinuityAnalyzerTest {
    @Test
    fun analyze_marksSessionReady_whenContinuityBeatsFrozenBaseline() {
        val sessionDir = createTempDirectory("corecamera-ready-").toFile()
        val artifacts = buildArtifacts(sessionDir)

        artifacts.frameTimestampFile.writeText(
            """
            camera_sensor_timestamp_ns,elapsed_realtime_ns,wall_time_ms,frame_number,session_elapsed_ns
            1000000000,5000000000,0,1,0
            1080000000,5080000000,80,2,80000000
            1160000000,5160000000,160,3,160000000
            """.trimIndent() + "\n",
        )
        artifacts.arcoreFile.writeText(
            """
            {"frameTimestampNs":1000000000,"elapsedRealtimeNanos":5000000000,"sessionElapsedNanos":0}
            {"frameTimestampNs":1080000000,"elapsedRealtimeNanos":5080000000,"sessionElapsedNanos":80000000}
            {"frameTimestampNs":1160000000,"elapsedRealtimeNanos":5160000000,"sessionElapsedNanos":160000000}
            """.trimIndent() + "\n",
        )

        val analysis = SessionContinuityAnalyzer.analyze(artifacts)

        assertEquals("READY", analysis.swapReadinessStatus)
        assertTrue(analysis.improvedVsFrozenArcoreOn)
        assertTrue(analysis.withinFrozenArcoreOffBand)
        assertTrue(analysis.timestampContractSatisfied)
        assertTrue(analysis.blockers.isEmpty())
    }

    @Test
    fun analyze_marksSessionBlocked_whenContinuityIsWorseThanFrozenBaseline() {
        val sessionDir = createTempDirectory("corecamera-blocked-").toFile()
        val artifacts = buildArtifacts(sessionDir)

        artifacts.frameTimestampFile.writeText(
            """
            camera_sensor_timestamp_ns,elapsed_realtime_ns,wall_time_ms,frame_number,session_elapsed_ns
            1000000000,5000000000,0,1,0
            3800000000,7800000000,2800,2,2800000000
            """.trimIndent() + "\n",
        )
        artifacts.arcoreFile.writeText(
            """
            {"frameTimestampNs":1000000000,"elapsedRealtimeNanos":5000000000,"sessionElapsedNanos":0}
            """.trimIndent() + "\n",
        )

        val analysis = SessionContinuityAnalyzer.analyze(artifacts)

        assertEquals("BLOCKED", analysis.swapReadinessStatus)
        assertFalse(analysis.improvedVsFrozenArcoreOn)
        assertTrue(analysis.blockers.contains("camera continuity did not beat frozen ARCore ON baseline"))
        assertTrue(analysis.blockers.contains("insufficient arcore pose evidence"))
    }

    private fun buildArtifacts(sessionDir: File): SessionArtifacts =
        SessionArtifacts(
            sessionId = "session-test",
            sessionDir = sessionDir,
            manifestFile = File(sessionDir, "session_manifest.json"),
            videoFile = File(sessionDir, "video.mp4"),
            imuFile = File(sessionDir, "imu.csv"),
            gnssFile = File(sessionDir, "gnss.csv"),
            bleFile = File(sessionDir, "ble_scan.jsonl"),
            arcoreFile = File(sessionDir, "arcore_pose.jsonl"),
            frameTimestampFile = File(sessionDir, "video_frame_timestamps.csv"),
            videoEventsFile = File(sessionDir, "video_events.jsonl"),
            startedWallTimeMs = 0L,
            startedElapsedRealtimeNs = 5_000_000_000L,
        )
}
