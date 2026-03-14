# System Blueprint

## Frozen Fact From iSensorium

- `ARCore OFF`: camera timestamp max gap about `139.6 ms`
- `ARCore ON`: camera timestamp max gap about `2634 ms`
- `IMU` remained stable in both runs
- therefore the blocking defect is in the camera path

## Target Architecture

- `Camera2`
- `ARCore Session.Feature.SHARED_CAMERA`
- adapter boundary that preserves the current `iSensorium` session in/out contract
- isolated Android app under `coreCamera/app/`
- controller entrypoint: `SharedCameraSessionController`
- swap seam: `SharedCameraSessionAdapter`

## Preserved Interface Shape

- start recording
- stop recording
- session directory discovery
- manifest emission
- per-stream file emission using the current `iSensorium` naming set

## Implemented MRL-2 Output Path

- `MainActivity` owns an isolated `TextureView` preview and start/stop controls
- `SharedCameraSessionController` initializes `Session.Feature.SHARED_CAMERA`, opens the back camera with wrapped ARCore callbacks, and creates a controlled `CameraCaptureSession` that includes preview, ARCore, and recording surfaces
- `SessionVideoRecorder` emits real `video.mp4` output through the shared-camera capture graph while `video_frame_timestamps.csv` is appended from `TotalCaptureResult`
- `ArCorePoseSampler` maintains an offscreen GL context so `Session.update()` can emit real `arcore_pose.jsonl` samples without changing the outer adapter boundary
- `SessionArtifactStore` writes a compatibility-preserving `session_manifest.json` whose stream entries now report real output state, sizes, and row counts
- start/stop lifecycle is still validated at build time by unit tests and debug assembly, while on-device continuity proof remains pending

## Replacement Boundary

- implementation starts in `coreCamera/` only
- output contract should remain compatible with:
  - `video.mp4`
  - `imu.csv`
  - `gnss.csv`
  - `ble_scan.jsonl`
  - `arcore_pose.jsonl`
  - `video_frame_timestamps.csv`
  - `video_events.jsonl`
  - `session_manifest.json`

## Integration Rule

- no direct replacement inside `iSensorium/` until continuity validation is complete
- swap-in must be possible through an adapter seam rather than a full upstream rewrite
- isolated development may define internal abstractions freely, but the outer contract must stay compatible
