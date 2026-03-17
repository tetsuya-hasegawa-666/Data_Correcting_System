# 文書インデックス

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

このプロジェクトでは、`docs/` は manager context collection system の source-of-truth を扱う。
`develop/` は release line、実装順序、履歴、snapshot を扱う。
`data/` は schema を具体化する seed data と検証用サンプルを扱う。

## 運用原則

- 新しい構想や要求は、既存 layer へ編入して正本化する。
- 既存意味の差し替えは、history summary と snapshot を対で残す。
- broad search や再帰読込では `docs/history/docs/snapshot/**` を既定除外とする。

## 対象境界

- `docs/`
  目的、価値、構造、プロセス、現在地
- `develop/`
  dated plan set、MRL、mRL、開発履歴、snapshot
- `data/`
  YAML schema の seed data、config sample、record sample
- `iDevelop/`
  後日 dashboard / review UI を切り出す場合の companion project。現時点の core data contract は `iSensorium/` 側で定義する。

## source-of-truth 構成

| layer | file | purpose |
|---|---|---|
| Artifact | `docs/artifact/north_star.md` | Human Goal、価値、非交渉条件 |
| Artifact | `docs/artifact/system_blueprint.md` | system architecture、schema、sequence、flow |
| Artifact | `docs/artifact/story_release_map.md` | story と release line の意味体系 |
| Process | `docs/process/research_operation.md` | Human + AI 開発運用 |
| Process | `docs/process/change_protocol.md` | 変更要求、境界、履歴規約 |
| Process | `docs/process/UX_check_work_flow.md` | manager UX check と利用者準備 |
| Observability | `docs/observability/current_state.md` | active plan set、risk、次検証点 |
| History | `docs/history/docs/summary/summary.md` | docs 全体の要約履歴 |

## データ位置

- sample config:
  `data/seed/manager_context/config/`
- sample project context:
  `data/seed/manager_context/projects/`
- sample YAML records:
  `data/seed/manager_context/records/`

## 更新ルール

1. 目的や境界の変更は `north_star.md` を先に更新する。
2. 接続、schema、ディレクトリ設計、Mermaid 図は `system_blueprint.md` を先に更新する。
3. story と release の関係は `story_release_map.md` にだけ集約する。
4. 利用者準備や UX check 手順は `UX_check_work_flow.md` に集約する。
5. 現在地は `current_state.md` だけを更新し、定義本文は他ファイルへ持たせる。
6. `docs/` を更新したら `docs/history/docs/summary/summary.md` と `docs/history/docs/snapshot/` を対で更新する。
7. `develop/` 側の active line を変えたら `develop/index.md` と active plan set を同時更新する。

## 重複防止ルール

- YAML schema の正本は `system_blueprint.md` と seed data の組で表現する。
- task state の定義は `research_operation.md` だけに置く。
- summary history は `docs/history/docs/summary/summary.md` に集約する。
- 実装前提の具体的な line 分解は `develop/` 側にのみ置く。
