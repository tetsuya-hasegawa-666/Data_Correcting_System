# docs インデックス

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## source-of-truth

| layer | file | purpose |
|---|---|---|
| Artifact | `docs/artifact/north_star.md` | clone-first 方針と UX の目的 |
| Artifact | `docs/artifact/system_blueprint.md` | architecture / payload / bridge / KPI |
| Artifact | `docs/artifact/story_release_map.md` | story と MRL の対応 |
| Process | `docs/process/change_protocol.md` | docs 更新ルールと UX trace ルール |
| Process | `docs/process/research_operation.md` | Human + AI の調査ルール |
| Process | `docs/process/UX_check_work_flow.md` | 人が行う UX 確認手順 |
| Process | `docs/process/UX_auto_validation_report.md` | Codex による UX 検証の要約 |
| Process | `docs/process/UX_validation_trace.yaml` | 単一の UX 検証トレースデータ |
| Observability | `docs/observability/current_state.md` | 現況、既知事項、active release line |
| History | `docs/history/docs/summary/summary.md` | docs 更新履歴 |

## 更新順

1. UX / 構想の変更を `north_star.md` と `system_blueprint.md` に反映する
2. 実操作の確認方法を `UX_check_work_flow.md` に反映する
3. Codex 評価の要約を `UX_auto_validation_report.md` に反映する
4. 実行した検証の根拠を `UX_validation_trace.yaml` に 1 件追記する
5. `current_state.md`、summary、snapshot を更新する
