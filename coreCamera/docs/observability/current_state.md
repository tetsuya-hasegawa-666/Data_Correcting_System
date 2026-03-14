# Current State

## Current Position

- project: `coreCamera`
- status: contract-compatible shared-camera output implemented and build-verified
- active plan set: `develop/plans/2026-03-14-001/`
- purpose: build a `Camera2 + ARCore Shared Camera` replacement-camera stack for later swap-in to `iSensorium`
- market release line: `MRL-2`
- completed micro releases: `mRL-0-1 -> mRL-0-2 -> mRL-0-3 -> mRL-1-1 -> mRL-1-2 -> mRL-2-1 -> mRL-2-2 -> mRL-2-3`
- next micro release order: `mRL-3-1 -> mRL-3-2 -> mRL-3-3`

## Inherited Facts

- source project freeze point: `iSensorium` mainline frozen at `CameraX + ARCore`
- reason: `ARCore ON` reproduced multi-second camera-path stalls while `IMU` remained stable
- evidence sessions:
  - `session-20260314-194350` (`ARCore OFF`)
  - `session-20260314-194438` (`ARCore ON`)

## Working Rule

- this project inherits release-line discipline, docs discipline, and UX validation discipline from `iSensorium`
- implementation remains isolated under `coreCamera/app/`
- current adapter seam is `shared-camera-session-adapter`
- verified locally by `testDebugUnitTest` and `assembleDebug`
- `video.mp4`, `video_frame_timestamps.csv`, `arcore_pose.jsonl`, and additive `session_manifest.json` output are now emitted from the isolated shared-camera path

## Open Issues

- whether `Shared Camera` on Xperia 5 III can eliminate the frozen `ARCore ON` continuity defect remains unverified on-device
- non-camera side streams (`imu.csv`, `gnss.csv`, `ble_scan.jsonl`) remain placeholders until a later release line and must not drive upstream integration yet

## Restart Checklist

1. read `coreCamera/docs/index.md`
2. read `coreCamera/USER_PREPARATION.md`
3. read `coreCamera/SESSION_HANDOVER.md`
4. read `coreCamera/develop/index.md`
5. continue from `mRL-3-1` without touching `iSensorium/`

## Next Validation Point

- next session should begin from plan set `2026-03-14-001` and execute `mRL-3-1 -> mRL-3-2 -> mRL-3-3`
