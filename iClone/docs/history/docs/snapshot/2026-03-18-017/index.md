# 文書インデックス

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

この project では、`docs/` を manager context collection system の source-of-truth とする。
`develop/` は release line、task、履歴、snapshot を扱い、`data/` は schema sample と seed data を扱う。

## source-of-truth 構成

| layer | file | purpose |
|---|---|---|
| Artifact | `docs/artifact/north_star.md` | 背景、目的、価値、非交渉事項 |
| Artifact | `docs/artifact/system_blueprint.md` | architecture、schema、sequence、UX flow |
| Artifact | `docs/artifact/story_release_map.md` | user story と release line の対応 |
| Process | `docs/process/change_protocol.md` | change handling と履歴規約 |
| Process | `docs/process/research_operation.md` | Human + AI 開発運用 |
| Process | `docs/process/UX_check_work_flow.md` | UX check と利用者準備 |
| Observability | `docs/observability/current_state.md` | active line、risk、次検証点 |
| History | `docs/history/docs/summary/summary.md` | docs 要約履歴 |

## データ位置

- config sample:
  `data/seed/manager_context/config/`
- project context sample:
  `data/seed/manager_context/projects/`
- record sample:
  `data/seed/manager_context/records/`
- host stack sample:
  `data/seed/manager_context/config/host_stack.yaml`

## 更新ルール

1. 目的や提供価値の変更は `north_star.md` を先に更新する。
2. 接続、YAML schema、Mermaid 図、ディレクトリ構造は `system_blueprint.md` に集約する。
3. release line の意味は `story_release_map.md` と `develop/plans/` で管理する。
4. 進行中判断は `current_state.md` だけを更新する。
5. `docs/` の意味変更時は summary と snapshot を対で更新する。
