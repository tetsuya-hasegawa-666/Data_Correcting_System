# Docs History Summary

## 2026-03-14-001 corecamera-project-bootstrap

- scope: documentation system
- trigger: open a separate thread for `Camera2 + Shared Camera` replacement work without interfering with `iSensorium`
- resulting_direction: scaffolded `coreCamera/` as an isolated sibling project with source-of-truth and develop entry points
- expected_benefit: the next session can start replacement-camera work immediately and still follow the same release-line discipline

## 2026-03-14-002 full-prestart-documentation-pack

- scope: documentation system
- trigger: the isolated project needed the same governance precision, handover quality, and UX/test guidance level already used in `iSensorium`
- resulting_direction: expanded `coreCamera/` with contract, story map, user preparation, restart order, UX check workflow, and richer handover/current-state documents
- expected_benefit: the next session can start `Camera2 + Shared Camera` implementation directly instead of rebuilding project context

## 2026-03-14-003 shared-camera-skeleton-start

- scope: documentation system
- trigger: isolated implementation started and the frozen contract plus adapter seam became concrete project truth
- resulting_direction: source-of-truth now records the `shared-camera-session-adapter`, completed `mRL-0-*` / `mRL-1-*`, and the move to `MRL-1`
- expected_benefit: the next session can continue from `mRL-2-1` with current implementation status and compatibility rules already frozen

## 2026-03-14-004 contract-compatible-output-implemented

- scope: documentation system
- trigger: isolated shared-camera code now emits real contract-facing video, frame-timestamp, pose, and manifest outputs
- resulting_direction: source-of-truth now records `MRL-2`, completed `mRL-2-*`, and the next validation move into `MRL-3`
- expected_benefit: the next session can begin continuity validation without re-establishing output-shape assumptions
