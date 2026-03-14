# Project Contract

## Purpose

This project exists to replace the current `iSensorium` camera implementation without changing downstream assumptions.

## Required Inputs

- start/stop recording lifecycle
- `TextureView` preview surface for isolated lifecycle control
- `Camera2` camera frames
- ARCore shared camera session
- optional sensor streams later aligned with `iSensorium`

## Required Outputs

- session-oriented file tree
- file names compatible with `iSensorium`
- timestamp contract based on monotonic alignment
- manifest carrying enough metadata for later parser compatibility
- adapter seam named `shared-camera-session-adapter`

## Frozen Compatibility Boundary

- preserve `startSession`, `stopSession`, and `findLatestSession` as the outer session operations
- preserve the session file-name set:
  - `session_manifest.json`
  - `video.mp4`
  - `imu.csv`
  - `gnss.csv`
  - `ble_scan.jsonl`
  - `arcore_pose.jsonl`
  - `video_frame_timestamps.csv`
  - `video_events.jsonl`
- keep timestamp alignment rooted in `elapsedRealtimeNanos` plus per-session monotonic origin
- allow `MRL-1` to create placeholders for files that are not yet populated, as long as names and manifest semantics stay frozen

## Explicit Non-Goals In The Isolated Phase

- editing `iSensorium/app/`
- redesigning end-user UX inside `iSensorium`
- changing existing release-line governance
- introducing a second adapter seam before `MRL-4`
