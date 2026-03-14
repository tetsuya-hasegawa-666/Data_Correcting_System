# Current State

## Current Position

- project: `coreCamera`
- status: scaffolded, implementation not started
- active plan set: `develop/plans/2026-03-14-001/`
- purpose: build a `Camera2 + ARCore Shared Camera` replacement-camera stack for later swap-in to `iSensorium`
- market release line: `MRL-0`
- next micro release order: `mRL-0-1 -> mRL-0-2 -> mRL-0-3 -> mRL-1-1 -> mRL-1-2`

## Inherited Facts

- source project freeze point: `iSensorium` mainline frozen at `CameraX + ARCore`
- reason: `ARCore ON` reproduced multi-second camera-path stalls while `IMU` remained stable
- evidence sessions:
  - `session-20260314-194350` (`ARCore OFF`)
  - `session-20260314-194438` (`ARCore ON`)

## Working Rule

- this project inherits release-line discipline, docs discipline, and UX validation discipline from `iSensorium`
- implementation has not started yet; current work is preparation only

## Open Issues

- whether `Shared Camera` on Xperia 5 III can eliminate the frozen `ARCore ON` continuity defect remains unverified
- replacement should preserve output compatibility without silently narrowing the contract

## Restart Checklist

1. read `coreCamera/docs/index.md`
2. read `coreCamera/USER_PREPARATION.md`
3. read `coreCamera/SESSION_HANDOVER.md`
4. read `coreCamera/develop/index.md`
5. start the active plan set without touching `iSensorium/`

## Next Validation Point

- next session should begin from plan set `2026-03-14-001` and complete `mRL-0-1 -> mRL-0-2 -> mRL-0-3 -> mRL-1-1 -> mRL-1-2`
