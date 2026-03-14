# Current State

## Current Position

- project: `coreCamera`
- status: scaffolded, implementation not started
- active plan set: `develop/plans/2026-03-14-001/`
- purpose: build a `Camera2 + ARCore Shared Camera` replacement-camera stack for later swap-in to `iSensorium`

## Inherited Facts

- source project freeze point: `iSensorium` mainline frozen at `CameraX + ARCore`
- reason: `ARCore ON` reproduced multi-second camera-path stalls while `IMU` remained stable
- evidence sessions:
  - `session-20260314-194350` (`ARCore OFF`)
  - `session-20260314-194438` (`ARCore ON`)

