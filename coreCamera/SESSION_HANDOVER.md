# Session Handover

## Decision

- freeze the current `iSensorium` camera mainline
- do not continue patching `CameraX + ARCore` as the primary path
- begin replacement work in `coreCamera/` in a later session

## Verified Facts To Carry Forward

- `ARCore OFF` baseline session: `session-20260314-194350`
- `ARCore ON` comparison session: `session-20260314-194438`
- `ARCore OFF` camera timestamp max gap: `139.6 ms`
- `ARCore ON` camera timestamp max gap: `2634 ms`
- `IMU` remained stable in both runs with max gap around `30-47 ms`

## Constraint

- preserve the current `iSensorium` session in/out contract
- keep release-line and documentation discipline unchanged
- avoid direct implementation changes inside `iSensorium/` until replacement readiness is proven

