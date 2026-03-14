# Documentation Index

`coreCamera/` は、後に現在の `iSensorium` camera spine を置き換えるための、`Camera2 + ARCore Shared Camera` 専用 standalone replacement-camera project である。

## Position

- project status: integration recommendation まで実装済み
- next session の entry point: `coreCamera/develop/index.md`
- integration target: 将来の `iSensorium` camera 実装の置換
- current user preparation file: `coreCamera/USER_PREPARATION.md`

## Boundary Rule

- isolated build phase の間、この project から `iSensorium/` 実装を変更しない
- この project から `iDevelop/` 実装を変更しない
- 現在の `iSensorium` in/out contract を維持し、後で replacement を差し替え可能にする
- `shared-camera-session-adapter` という isolated adapter seam を、現時点で唯一の swap boundary として維持する

## Governance Principle

- まず source-of-truth を更新し、その後に同じ決定を `develop/` へ反映する
- `iSensorium` で既に使っている release-line planning の流儀を維持する
- UX validation と documentation discipline は `iSensorium` と同じ粒度で保つ
- `.md` は、意味・引用・API 名・技術精度のために別言語が必要な場合を除き、日本語で書く
- active な market release line がある間は、15 分前後で任意停止せず、user block または 6 時間上限に達するまで同一 session で継続する

## Source-of-Truth Files

- `docs/artifact/north_star.md`
- `docs/artifact/system_blueprint.md`
- `docs/artifact/story_release_map.md`
- `docs/artifact/project_contract.md`
- `docs/artifact/adapter_integration_plan.md`
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
