package com.corecamera.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test
import java.io.File
import kotlin.io.path.createTempDirectory

class UpstreamTrialPackagePlannerTest {
    @Test
    fun returns_ready_when_all_required_artifacts_exist() {
        val root = createTempDirectory("upstream-trial-ready").toFile()
        val artifacts = sessionArtifacts(root)
        artifacts.listAllFiles().forEach { file ->
            file.parentFile?.mkdirs()
            file.writeText("x")
        }
        val analysis = SessionAnalysis(
            frameSampleCount = 10,
            poseSampleCount = 10,
            frameMaxGapMs = 10.0,
            poseMaxGapMs = 20.0,
            improvedVsFrozenArcoreOn = true,
            withinFrozenArcoreOffBand = true,
            timestampContractSatisfied = true,
            swapReadinessStatus = "READY",
            blockers = emptyList(),
        )

        val pkg = UpstreamTrialPackagePlanner.build(artifacts, analysis)

        assertEquals("READY", pkg.status)
        assertTrue(pkg.requiredArtifacts.contains("imu.csv"))
    }

    @Test
    fun returns_blocked_when_artifacts_are_missing() {
        val root = createTempDirectory("upstream-trial-blocked").toFile()
        val artifacts = sessionArtifacts(root)
        artifacts.manifestFile.writeText("x")
        val analysis = SessionAnalysis(
            frameSampleCount = 10,
            poseSampleCount = 10,
            frameMaxGapMs = 10.0,
            poseMaxGapMs = 20.0,
            improvedVsFrozenArcoreOn = true,
            withinFrozenArcoreOffBand = true,
            timestampContractSatisfied = true,
            swapReadinessStatus = "READY",
            blockers = emptyList(),
        )

        val pkg = UpstreamTrialPackagePlanner.build(artifacts, analysis)

        assertEquals("BLOCKED", pkg.status)
        assertTrue(pkg.blockers.any { it.contains("video.mp4") })
    }

    private fun sessionArtifacts(root: File): SessionArtifacts =
        SessionArtifacts(
            sessionId = "session-test",
            sessionDir = root,
            manifestFile = File(root, "session_manifest.json"),
            videoFile = File(root, "video.mp4"),
            imuFile = File(root, "imu.csv"),
            gnssFile = File(root, "gnss.csv"),
            bleFile = File(root, "ble_scan.jsonl"),
            arcoreFile = File(root, "arcore_pose.jsonl"),
            frameTimestampFile = File(root, "video_frame_timestamps.csv"),
            videoEventsFile = File(root, "video_events.jsonl"),
            startedWallTimeMs = 0L,
            startedElapsedRealtimeNs = 0L,
        )

    private fun SessionArtifacts.listAllFiles(): List<File> = listOf(
        manifestFile,
        videoFile,
        imuFile,
        gnssFile,
        bleFile,
        arcoreFile,
        frameTimestampFile,
        videoEventsFile,
    )
}
