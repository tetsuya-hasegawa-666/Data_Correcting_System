# Session Handover

## Decision

- freeze the current `iSensorium` camera mainline
- do not continue patching `CameraX + ARCore` as the primary path
- begin replacement work in `coreCamera/` in a later session
- keep release-line, docs-history, and UX-check discipline at the same granularity already used in `iSensorium`

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

## Open Issues

- `Camera2 + Shared Camera` viability on target hardware is still unproven
- the replacement seam must be clean enough to swap in without redesigning downstream parser or validation flows

## Risks And Assumptions

- if `Shared Camera` cannot remove the continuity defect, the fallback path remains dropping `ARCore`
- isolated development should not leak partial implementation into `iSensorium`

## Next Session Start Order

1. read `coreCamera/docs/index.md`
2. read `coreCamera/docs/observability/current_state.md`
3. read `coreCamera/USER_PREPARATION.md`
4. read `coreCamera/docs/artifact/project_contract.md`
5. read `coreCamera/develop/index.md`
6. execute `coreCamera/develop/plans/2026-03-14-001/`
