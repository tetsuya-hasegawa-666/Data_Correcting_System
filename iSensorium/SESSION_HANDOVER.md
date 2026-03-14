# Session Handover

## Freeze Decision

- freeze the current `CameraX + ARCore` mainline
- do not continue incremental patching as the primary strategy
- start replacement-camera work in sibling project `coreCamera/` in a later session

## Verified Evidence

- baseline without ARCore: `session-20260314-194350`
- comparison with ARCore: `session-20260314-194438`
- `ARCore OFF`: `video_frame_timestamps.csv` max gap `139.6 ms`
- `ARCore ON`: `video_frame_timestamps.csv` max gap `2634 ms`
- `IMU` remained stable in both runs with max gap about `30-47 ms`

## Meaning

- the blocking defect is in the camera path
- `IMU` continuity is not the current blocker
- `ARCore` can remain only if the camera architecture is replaced

## Next Session Rule

- do not resume from `iSensorium/app/` for camera replacement
- resume from `coreCamera/`
- preserve the current session in/out contract for later swap-in

