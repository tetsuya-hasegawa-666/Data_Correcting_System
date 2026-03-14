package com.corecamera.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class ReplacementCameraContractTest {
    @Test
    fun requiredFileNames_matchFrozenContractShape() {
        assertEquals(
            listOf(
                "session_manifest.json",
                "video.mp4",
                "imu.csv",
                "gnss.csv",
                "ble_scan.jsonl",
                "arcore_pose.jsonl",
                "video_frame_timestamps.csv",
                "video_events.jsonl",
            ),
            ReplacementCameraContract.requiredFileNames,
        )
    }

    @Test
    fun adapterSeam_isNamedForFutureSwap() {
        assertTrue(ReplacementCameraContract.adapterSeamId.contains("adapter"))
    }
}
