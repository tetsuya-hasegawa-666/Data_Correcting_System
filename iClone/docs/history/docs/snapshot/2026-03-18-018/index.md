# docs インデックス

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

この project では、`docs/` が manager context collection system の source-of-truth になる。  
`develop/` は release line、task、履歴、snapshot を保持する。  
`data/` は schema sample と seed data を保持する。

## source-of-truth

| layer | file | purpose |
|---|---|---|
| Artifact | `docs/artifact/north_star.md` | 背景、価値、UX 原則、copy-first 方針 |
| Artifact | `docs/artifact/system_blueprint.md` | architecture、schema、sequence、UX flow |
| Artifact | `docs/artifact/story_release_map.md` | user story と release line の対応 |
| Process | `docs/process/change_protocol.md` | change handling と履歴更新ルール |
| Process | `docs/process/research_operation.md` | Human + AI 協働ルール |
| Process | `docs/process/UX_check_work_flow.md` | UX check と利用者向け確認手順 |
| Observability | `docs/observability/current_state.md` | active line、確認済み、未解決 |
| History | `docs/history/docs/summary/summary.md` | docs の更新履歴 |

## データ位置

- config sample:
  `data/seed/manager_context/config/`
- project context sample:
  `data/seed/manager_context/projects/`
- record sample:
  `data/seed/manager_context/records/`

## 更新ルール

1. 背景や UX 原則の変更は `north_star.md` を先に更新する
2. 設計、sequence、schema、Mermaid 図は `system_blueprint.md` に集約する
3. release line の変更は `story_release_map.md` と `develop/plans/` を合わせて更新する
4. 実行手順が変わったら `UX_check_work_flow.md` を更新する
5. docs を更新したら summary と snapshot も更新する
