# 文書インデックス

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

このプロジェクトでは、`docs/` は lightweight multi-agent collaboration experiment の source-of-truth を扱う。
`develop/` は release line、実装順序、履歴、snapshot を扱う。
`data/` は team config、seed brief、将来の評価入力を扱う。

## 運用原則

- 新しい agent 役割、協働ループ、評価観点は既存 layer に編入して正本化する。
- 実モデル接続前でも、mock 実行で流れを再現できる状態を維持する。
- broad search や再帰読込では `docs/history/docs/snapshot/**` を既定除外とする。

## 対象境界

- `docs/`
  目的、価値、協働設計、プロセス、現在地
- `develop/`
  dated plan set、MRL、mRL、開発履歴、snapshot
- `data/`
  team config、seed brief、将来の評価シナリオ
- `src/`
  agent orchestration、model adapter、CLI
- `tests/`
  最小の回帰検証

## source-of-truth 構成

| layer | file | purpose |
|---|---|---|
| Artifact | `docs/artifact/north_star.md` | Human Goal、価値、非交渉条件 |
| Artifact | `docs/artifact/system_blueprint.md` | system architecture、役割、実行 flow |
| Artifact | `docs/artifact/story_release_map.md` | story と release line の意味体系 |
| Process | `docs/process/research_operation.md` | Human + AI 実験運用 |
| Process | `docs/process/change_protocol.md` | 変更要求、境界、履歴規約 |
| Process | `docs/process/UX_check_work_flow.md` | CLI 実験手順と利用者準備 |
| Observability | `docs/observability/current_state.md` | active plan set、risk、次検証点 |
| History | `docs/history/docs/summary/summary.md` | docs 全体の要約履歴 |

## データ位置

- team config:
  `data/seed/config/agent_team.sample.json`
- seed brief:
  `data/seed/session/brief.md`

## 更新ルール

1. 目的や境界の変更は `north_star.md` を先に更新する。
2. 協働構成、役割、adapter、sequence の変更は `system_blueprint.md` を先に更新する。
3. story と release の関係は `story_release_map.md` に集約する。
4. 利用者準備や実験手順は `UX_check_work_flow.md` に集約する。
5. 現在地は `current_state.md` だけを更新し、定義本文は他ファイルへ持たせる。
6. `docs/` を更新したら `docs/history/docs/summary/summary.md` と `docs/history/docs/snapshot/` を対で更新する。
7. `develop/` 側の active line を変えたら `develop/index.md` と active plan set を同時更新する。

## 重複防止ルール

- agent 役割定義の正本は `system_blueprint.md` に置く。
- task 状態の定義は `research_operation.md` だけに置く。
- summary history は `docs/history/docs/summary/summary.md` に集約する。
- 実装前提の line 分解は `develop/` 側にのみ置く。
