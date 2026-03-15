# Market Release Line Plan

## Purpose

This dated plan set starts `iSensorium` guarded upstream trial preparation without breaking the frozen session contract or the rollback anchor.

## Baseline Interpretation

- `develop/plans/2026-03-14-006/` remains the validated historical baseline.
- `MRL-0` through `MRL-5` remain valid as the frozen mainline and documentation discipline baseline.
- `MRL-6` is additive and exists only to stage guarded upstream trial work behind a reversible seam.

## Gate Status

| RL | Status | Reason |
|---|---|---|
| RL-0 | ready | baseline session bootstrap is already validated |
| RL-1 | ready | frozen video/session/timestamp/IMU route is available |
| RL-2 | frozen_blocked | frozen `CameraX + ARCore` route still shows the known camera-path stall under `ARCore ON` |
| RL-3 | ready_as_baseline | parser-visible session contract exists and must stay backward compatible |
| RL-4 | out_of_scope_now | long-duration and thermal endurance remain explicitly out of scope |
| RL-5 | ready | docs/develop/history discipline is available for guarded integration work |
| RL-6 | in_progress | guarded upstream trial seam preparation is active inside `iSensorium` |

## Market Release Lines

| ID | Name | Delivered Value | Entrance Criteria | Exit Criteria | Linked Micro Releases | Change Drivers |
|---|---|---|---|---|---|---|
| MRL-6 | Guarded upstream trial | `iSensorium` can host a reversible camera cutover seam while preserving outer session operations and frozen artifact shape | `MRL-5` discipline active, rollback anchor fixed, `coreCamera` reports `upstreamTrialPackage.status = READY` | adapter seam is active, frozen route remains default, guarded metadata is additive only, and the replacement route still has an explicit reversible gate | mRL-6-1, mRL-6-2, mRL-6-3 | frozen mainline stall evidence, sibling replacement readiness, rollback-safe upstream preparation |

## Current Recommendation

1. Finish `mRL-6-1` by routing outer operations through the seam only.
2. Finish `mRL-6-2` by proving additive manifest metadata does not alter downstream assumptions.
3. Do not attempt real replacement runtime wiring until `mRL-6-3` defines the reversible cutover gate in concrete verification terms.
