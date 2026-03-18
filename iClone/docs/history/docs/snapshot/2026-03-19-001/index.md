# docs インデックス

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## source-of-truth

| layer | file | purpose |
|---|---|---|
| Artifact | `docs/artifact/north_star.md` | 背景、clone-first 原則、UX 優先順位 |
| Artifact | `docs/artifact/system_blueprint.md` | architecture、payload、API、bridge |
| Artifact | `docs/artifact/story_release_map.md` | story と MRL の対応 |
| Process | `docs/process/change_protocol.md` | docs 更新義務と report 更新ルール |
| Process | `docs/process/research_operation.md` | Human + AI 協働ルール |
| Process | `docs/process/UX_check_work_flow.md` | 人手の UX 確認手順 |
| Process | `docs/process/UX_auto_validation_report.md` | Codex による UX 自動検証結果 |
| Observability | `docs/observability/current_state.md` | 現況、確認済み、未解決 |
| History | `docs/history/docs/summary/summary.md` | docs 更新履歴 |

## 更新ルール

1. UX 優先順位を変えたら `north_star.md` を更新する
2. API / payload / bridge を変えたら `system_blueprint.md` を更新する
3. UX を変えたら `UX_check_work_flow.md` と `UX_auto_validation_report.md` を両方更新する
4. docs を更新したら summary と snapshot を残す
