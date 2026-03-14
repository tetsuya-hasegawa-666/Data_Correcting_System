# Develop History Summary

## 2026-03-14-001 corecamera-project-bootstrap

- target_behavior: open a clean replacement-camera workstream without contaminating `iSensorium`
- intended_change: scaffold `coreCamera/` with docs, develop entry points, and a first release-line plan set
- background_reason: the frozen `CameraX + ARCore` mainline has a confirmed camera-path defect under `ARCore ON`
- change_summary: created isolated project boundaries and restart-ready planning artifacts for later `Camera2 + Shared Camera` implementation
- affected_documents: `coreCamera/docs/index.md`, `coreCamera/develop/index.md`, `coreCamera/develop/plans/2026-03-14-001/market_release_lines.md`, `coreCamera/develop/plans/2026-03-14-001/micro_release_lines.md`
- expected_effect: the next session can start implementation in `coreCamera/` immediately without re-establishing scope

## 2026-03-14-002 full-prestart-documentation-pack

- target_behavior: allow a future session to begin `Camera2 + Shared Camera` implementation immediately with no missing governance documents
- intended_change: extend `coreCamera/` to include artifact, process, observability, UX, contract, release-line, and handover documents at the same discipline level as `iSensorium`
- background_reason: a thin scaffold is not enough for a clean restart once implementation moves to a separate session
- change_summary: added contract, story map, UX flow, richer observability notes, and explicit restart order for the isolated project
- affected_documents: `coreCamera/docs/`, `coreCamera/develop/`, `coreCamera/SESSION_HANDOVER.md`
- expected_effect: the next session can begin implementation rather than spending time rebuilding project context

## 2026-03-14-003 shared-camera-skeleton-start

- target_behavior: start isolated `Camera2 + ARCore Shared Camera` development without touching `iSensorium`
- intended_change: add an Android app skeleton, a shared-camera lifecycle controller, a frozen compatibility contract, and local verification tests
- background_reason: `MRL-1` requires a controllable bootstrap and stop path before real output emission or upstream swap planning
- change_summary: implemented `shared-camera-session-adapter`, session artifact scaffolding, start/stop lifecycle handling, unit tests, and updated docs to record completed `mRL-0-*` and `mRL-1-*`
- affected_documents: `coreCamera/app/`, `coreCamera/docs/index.md`, `coreCamera/docs/artifact/project_contract.md`, `coreCamera/docs/artifact/system_blueprint.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/develop/index.md`, `coreCamera/SESSION_HANDOVER.md`
- expected_effect: the next session can proceed directly to `mRL-2-1` contract-output implementation on top of a buildable isolated shared-camera base

## 2026-03-14-004 contract-compatible-shared-camera-output

- target_behavior: complete `MRL-2` without breaking the frozen `shared-camera-session-adapter` boundary
- intended_change: replace placeholder session outputs with real shared-camera video, frame-timestamp, pose, and manifest emission
- background_reason: `MRL-3` continuity validation is not meaningful until the replacement stack emits the same contract-facing artifacts as the frozen mainline expects
- change_summary: added MediaRecorder-backed `video.mp4`, offscreen-GL ARCore pose sampling, richer manifest stream state reporting, and updated source-of-truth/develop restart documents to advance from `MRL-1` to `MRL-2`
- affected_documents: `coreCamera/app/`, `coreCamera/docs/index.md`, `coreCamera/docs/artifact/system_blueprint.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/develop/index.md`, `coreCamera/SESSION_HANDOVER.md`
- expected_effect: the next session can start `mRL-3-1` continuity comparison using contract-compatible outputs from the isolated replacement stack
