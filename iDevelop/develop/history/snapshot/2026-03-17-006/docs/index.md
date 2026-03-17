# Documentation Index

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

この subproject では、`docs/` を source-of-truth とし、`develop/` を実装計画と履歴の管理場所とする。新しい ad hoc 文書は増やさず、必要な更新は既存レイヤへ集約し、変更後は履歴とスナップショットを対で残す。

## Governance Principle

この dashboard project では、情報更新に open であり、その表現更新に closed であることを基本原則とする。

- 情報更新に open:
  画面実装、仕様更新、表示確認、実行ポイント更新を必要最小レイヤへ反映できる。
- 表現更新に closed:
  既存の意味を無言で上書きせず、必要なレイヤでのみ更新し、履歴とスナップショットを対で残す。
- 採番は連番維持:
  plan set と release line は、ユーザーが別指定しない限り次の連番を使う。
- 記載データは継続利用:
  ID、名称、状態名、成果物名、データ名は、明示変更がない限り既存表記を使う。

## Scope Boundary

- `docs/`
  artifact、process、observability の source-of-truth
- `develop/`
  実装計画、release line、変更履歴、snapshot
- `src/`
  dashboard 実装コード
- `data/`
  sample seed data

## 今回の役割整理

- `iDevelop/` は `iSensorium` が出力した記録データ、session 情報、文書カテゴリを閲覧し、取り出し、整理する server-side frontend 相当 project として扱う
- consultation workspace の価値は維持しつつ、記録データ閲覧、compact tree explorer、one-click download を主責務へ加える
- Android 計測や session/export 生成は `iSensorium/` 側で扱い、`iDevelop/` 側では viewer と operator UX に集中する

## Source-of-Truth Layout

| Layer | File | Purpose |
|---|---|---|
| Artifact | `docs/artifact/north_star.md` | 目的、非機能条件、原則 |
| Artifact | `docs/artifact/project_contract.md` | generic project contract |
| Artifact | `docs/artifact/system_blueprint.md` | module 境界と live 接続戦略 |
| Process | `docs/process/research_operation.md` | BDD/TDD と change operation |
| Process | `docs/process/UX_check_work_flow.md` | 全体 UX check、rollback rule、exit criteria |
| Observability | `docs/observability/current_state.md` | active state と next action |
| Observability | `docs/observability/UX_evidence_log.md` | integrated UX evidence |
| History | `docs/history/docs/summary/summary.md` | docs 変更履歴 |
| Snapshot | `docs/history/docs/snapshot/README.md` | docs snapshot |

## 全体実装原則

- UI、説明、エラー文、操作導線で自然に日本語化できる箇所は極力日本語にする
- file 名、directory 名、class 名、識別子、API 名、config key はアルファベットを維持する
- viewer、explorer、download、consultation の各機能は MVC 準拠で分離する
- empty state、warning state、retry、download failure、source mismatch を個別に扱う詳細エラーハンドリングを持つ
- 実装完了扱いは、原則として Codex 再テスト通過後に行う。ただしユーザーが明示した検証結果は完了根拠として採用できる
