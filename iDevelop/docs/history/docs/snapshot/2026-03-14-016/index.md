# Documentation Index

このサブプロジェクトでは、`docs/` を source-of-truth とし、`develop/` を開発計画と履歴の管理場所とする。
新しい ad hoc 文書は増やさず、必要な更新は既存レイヤへ集約し、変更後は履歴とスナップショットを対で残す。

## Governance Principle

この dashboard project では、情報更新に open であり、その表現更新に closed であることを基本原則とする。

- 情報更新に open:
  画面実装、仕様更新、表示確認、実行ポイント更新を必要最小レイヤへ反映できる。
- 表現更新に closed:
  既存の意味を無言で上書きせず、必要なレイヤでのみ更新し、履歴とスナップショットを対で残す。
- 採番は連番維持:
  plan set と release line は、ユーザーが別指定しない限り次の連番を使う。
- 記載データは継続利用:
  ID、名称、状態名、成果物名、データ名は、明示変更がない限り既存表記を使い続ける。

## Scope Boundary

- `docs/`
  文書、原則、運用、観測、source-of-truth
- `develop/`
  開発計画、release line、変更履歴、計画スナップショット
- `src/`
  ダッシュボード実装コード
- `data/`
  サンプルデータ、検証用 seed、契約確認用データ

## Source-of-Truth Layout

| Layer | File | Purpose | Fixed Content | Changeable Content |
|---|---|---|---|---|
| Artifact | `docs/artifact/north_star.md` | 目的、対象範囲、非交渉条件 | Human Goal、採用原則、非交渉条件 | 判断更新 |
| Artifact | `docs/artifact/system_blueprint.md` | アーキテクチャと責務境界 | 画面責務、MVC 境界、設計方針 | 実装方針、契約詳細 |
| Process | `docs/process/research_operation.md` | BDD/TDD と開発運用 | 実装サイクル、test 方針、運用ルール | 新ルール、詳細運用 |
| Process | `docs/process/UX_check_work_flow.md` | 体験確認手順 | 起動方法、確認手順、停止方法 | 現行 UI に合わせた操作更新 |
| Process | `docs/process/change_protocol.md` | 変更時の扱い方 | 変更原則、履歴ルール、整合ルール | 差分扱いの補足 |
| Observability | `docs/observability/current_state.md` | 現在位置と次アクション | active plan、validation point | 完了状況、リスク、next actions |
| DocsSummary | `docs/history/docs/summary/summary.md` | docs 変更履歴の要約 | 変更エントリ形式、対応スナップショット方針 | 変更エントリ |
| DocsSnapshot | `docs/history/docs/snapshot/README.md` | docs スナップショット運用 | 保存粒度、命名規則 | 各時点の保存内容 |

## Update Rules

1. 原則や非交渉条件の変更は `north_star.md` に反映する。
2. 画面責務やアーキテクチャ変更は `system_blueprint.md` に反映する。
3. BDD/TDD や運用ルール変更は `research_operation.md` に反映する。
4. 変更ルールや履歴ルール変更は `change_protocol.md` に反映する。
5. 現在位置や validation point の変更は `current_state.md` に反映する。
6. `docs/` に関わる変更後は `docs/history/docs/summary/summary.md` に 1 件追記する。
7. 同じ変更時点の `docs/` スナップショットを `docs/history/docs/snapshot/` に保存する。
8. `develop/` 側の計画更新がある場合は対応する develop 履歴にも反映する。
