# Develop Index

`coreCamera/` follows the same release-line working style as `iSensorium`, but remains isolated until replacement readiness is proven.

## Active Plan Set

- current: `develop/plans/2026-03-14-001/`
- status: in progress through `mRL-2-3`
- rule: do not integrate into `iSensorium/` in this thread
- supporting handover files:
  - `coreCamera/docs/observability/current_state.md`
  - `coreCamera/USER_PREPARATION.md`
  - `coreCamera/SESSION_HANDOVER.md`

## Development Rule

- keep the replacement implementation isolated under `coreCamera/`
- preserve the current `iSensorium` in/out contract
- use the same release-line progression style already established in `iSensorium`
- current completed order: `mRL-0-1 -> mRL-0-2 -> mRL-0-3 -> mRL-1-1 -> mRL-1-2 -> mRL-2-1 -> mRL-2-2 -> mRL-2-3`

## Restart Order

1. `coreCamera/docs/index.md`
2. `coreCamera/docs/observability/current_state.md`
3. `coreCamera/USER_PREPARATION.md`
4. `coreCamera/SESSION_HANDOVER.md`
5. `coreCamera/develop/index.md`
6. `coreCamera/develop/plans/2026-03-14-001/`
