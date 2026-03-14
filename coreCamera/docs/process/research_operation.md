# Research Operation

## First Re-entry Files

1. `coreCamera/docs/index.md`
2. `coreCamera/docs/observability/current_state.md`
3. `coreCamera/USER_PREPARATION.md`
4. `coreCamera/SESSION_HANDOVER.md`
5. `coreCamera/develop/index.md`
6. `coreCamera/develop/plans/2026-03-14-001/market_release_lines.md`
7. `coreCamera/develop/plans/2026-03-14-001/micro_release_lines.md`

## Scope Rule

Develop the replacement stack only inside `coreCamera/` until later integration is explicitly started.

## First Implementation Objective

- create a minimal `Camera2 + Shared Camera` skeleton that can start and stop without changing any `iSensorium` code
- preserve the current outer recording contract so later swap-in can happen through code replacement rather than workflow redesign

## Validation Standard

- compare `ARCore OFF` and `ARCore ON` continuity against frozen `iSensorium` evidence
- preserve the current in/out contract
- update docs/develop/history with the same discipline level as `iSensorium`
- keep user-facing evaluation route simple enough for later experience-based testing
