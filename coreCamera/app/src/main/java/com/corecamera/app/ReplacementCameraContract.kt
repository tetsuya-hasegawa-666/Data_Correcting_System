package com.corecamera.app

object ReplacementCameraContract {
    const val marketReleaseLine = "MRL-2"
    const val activePlanSet = "2026-03-14-001"
    const val adapterSeamId = "shared-camera-session-adapter"

    val requiredFileNames = listOf(
        "session_manifest.json",
        "video.mp4",
        "imu.csv",
        "gnss.csv",
        "ble_scan.jsonl",
        "arcore_pose.jsonl",
        "video_frame_timestamps.csv",
        "video_events.jsonl",
    )

    val requiredStreamDescriptors = listOf(
        StreamDescriptor("video", "video.mp4"),
        StreamDescriptor("imu", "imu.csv"),
        StreamDescriptor("gnss", "gnss.csv"),
        StreamDescriptor("ble", "ble_scan.jsonl"),
        StreamDescriptor("arcore", "arcore_pose.jsonl"),
    )
}

data class StreamDescriptor(
    val name: String,
    val fileName: String,
)
