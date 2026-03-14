# Documentation Index

`coreCamera/` is a standalone replacement-camera project dedicated to a `Camera2 + ARCore Shared Camera` implementation that can later replace the current `iSensorium` camera spine.

## Position

- project status: contract-compatible shared-camera output implemented
- entry point for next session: `coreCamera/develop/index.md`
- integration target: future replacement of the current `iSensorium` camera implementation
- current user preparation file: `coreCamera/USER_PREPARATION.md`

## Boundary Rule

- do not modify `iSensorium/` implementation from this project during the isolated build phase
- do not modify `iDevelop/` implementation from this project
- preserve the current `iSensorium` in/out contract so the replacement can be swapped in later
- keep the isolated adapter seam named `shared-camera-session-adapter` as the only intended swap boundary for now

## Governance Principle

- update source-of-truth first, then reflect the same decision in `develop/`
- preserve the release-line planning style already used in `iSensorium`
- keep UX validation and documentation discipline at the same granularity as `iSensorium`

## Source-of-Truth Files

- `docs/artifact/north_star.md`
- `docs/artifact/system_blueprint.md`
- `docs/artifact/story_release_map.md`
- `docs/artifact/project_contract.md`
- `docs/process/research_operation.md`
- `docs/process/change_protocol.md`
- `docs/process/UX_check_work_flow.md`
- `docs/observability/current_state.md`

## Re-entry Order

1. `coreCamera/docs/index.md`
2. `coreCamera/docs/observability/current_state.md`
3. `coreCamera/USER_PREPARATION.md`
4. `coreCamera/SESSION_HANDOVER.md`
5. `coreCamera/develop/index.md`
