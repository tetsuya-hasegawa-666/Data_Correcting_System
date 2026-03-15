# Micro Release Line Plan

## Purpose

This dated micro plan decomposes `MRL-6 guarded upstream trial` into rollback-safe steps inside `iSensorium`.

## Micro Release Lines

| ID | Parent | Developer Experience | Verification Method | Expected Result | Failure Split | Next Decomposition Target |
|---|---|---|---|---|---|---|
| mRL-6-1 | MRL-6 | preserved outer session operations are routed through `shared-camera-session-adapter` without changing the public call surface | local code inspection plus unit tests on route resolution metadata | `startSession`, `stopSession`, and `findLatestSession` remain unchanged upstream while a seam exists internally | seam leaks behavior upstream / fallback logic unclear | manifest metadata and guarded route reporting |
| mRL-6-2 | MRL-6 | frozen session contract stays stable while additive guarded-trial metadata is emitted | run parser-facing sanity checks on manifest shape and required file names | downstream readers still see the same required file set and timestamp basis | additive field breaks parser assumptions / file set drifts | reversible cutover gate definition |
| mRL-6-3 | MRL-6 | replacement route remains explicitly guarded and reversible before real runtime wiring | confirm rollback anchor, requested-route vs active-route reporting, and activation conditions | `corecamera_shared_camera_trial` can be requested without silently replacing the active frozen route | accidental cutover / rollback ambiguity | real runtime wiring only after explicit acceptance |

## Current Order

1. `mRL-6-1`
2. `mRL-6-2`
3. `mRL-6-3`

## Scope Guard

- Do not edit `coreCamera/`.
- Do not change the existing session file names.
- Do not remove or rename parser-visible manifest fields.
- Do not switch the default route away from `frozen_camerax_arcore`.
