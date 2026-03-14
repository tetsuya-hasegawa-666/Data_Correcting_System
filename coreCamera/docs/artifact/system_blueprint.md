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

## Preserved Interface Shape

- start recording
- stop recording
- session directory discovery
- manifest emission
- per-stream file emission using the current `iSensorium` naming set

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
