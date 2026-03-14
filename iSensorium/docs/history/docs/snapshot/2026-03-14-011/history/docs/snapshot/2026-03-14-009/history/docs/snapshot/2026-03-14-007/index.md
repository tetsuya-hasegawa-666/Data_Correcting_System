# Documentation Index

このプロジェクトでは、`docs/` は運用規約と source-of-truth を扱う。
`develop/` は実開発の計画、設計具体化、開発履歴、変更対象文書を扱う。

新しい ad hoc 文書は原則作らない。
追加は既存レイヤに編入し、修正は履歴とスナップショットを対で残す。

## Governance Principle

この文書体系は、拡張的変更にオープンであり、修正的変更にクローズであることを基本原則とする。

- 拡張的変更にオープン:
  新しい価値、観点、運用要求、履歴観点は既存レイヤへ追加できる。
- 修正的変更にクローズ:
  既存定義の意味を曖昧に上書きせず、所定レイヤでのみ更新し、要約履歴と対応スナップショットを対で残す。

## Scope Boundary

- `docs/`
  規約、前提、不変条件、意味体系、運用ルール、source-of-truth
- `develop/`
  実開発の計画、release line 詳細、実装準備文書、開発履歴、変更文書スナップショット
- `Codex_Dashborad/`
  メインプロジェクトとは完全分離した Codex 向けダッシュボード用サブプロジェクト。ダッシュボードの文書、計画、実装、保持データ定義、結果整理、履歴はこの配下だけで扱う

## Source-of-Truth Layout

| Layer | File | Purpose | Fixed Content | Changeable Content |
|---|---|---|---|---|
| Artifact | `docs/artifact/north_star.md` | 目的、非交渉条件、成功判定 | Human Goal、対象端末、非機能の不変条件 | 優先順位づけの仮説 |
| Artifact | `docs/artifact/system_blueprint.md` | 実装対象の構造定義 | 文書の章立て責務、構成境界、成果物の結線 | 実装案、比較結果、採用理由 |
| Artifact | `docs/artifact/story_release_map.md` | User Story Map と release line の意味体系 | 階層構造、表記規約、意味連鎖 | 各 story、line、change point |
| Process | `docs/process/research_operation.md` | Human + AI 継続研究の実行ルール | 研究サイクル、task state、証跡の残し方 | 現行の運用テンプレート |
| Process | `docs/process/change_protocol.md` | 変更要求の受理と意味確認 | 入出力フォーマット、競合判定、履歴項目 | 実案件ごとの判断例 |
| Observability | `docs/observability/current_state.md` | 現在地の一枚絵 | ステータス項目、更新責任 | 現在の release、進捗、未解決点 |
| HistoryRoot | `docs/history/README.md` | docs 履歴階層の全体規約 | 履歴レイヤの責務分離 | 履歴運用の追加指針 |
| DocsSummary | `docs/history/docs/summary/summary.md` | docs 全体の単一要約履歴 | エントリ形式、対応関係 | エントリ追加 |
| DocsSnapshot | `docs/history/docs/snapshot/README.md` | docs 全体のスナップショット | 保存単位、保存対象、命名規則 | 各時点の全体保存 |

## Update Rules

1. 目的や不変条件の変更は `north_star.md` を先に更新する。
2. 実装対象の追加や分割は `system_blueprint.md` を先に更新する。
3. release line、story、Mermaid は `story_release_map.md` に集約する。
4. 会話ルール、変更要求、競合判定は `change_protocol.md` のみを更新する。
5. 現在の進捗や進行中判断は `current_state.md` のみを更新する。
6. `docs/` 内の意味体系に関わる変更を行ったら、`docs/history/docs/summary/summary.md` に要約エントリを 1 件追加する。
7. 同じ変更時点の `docs/` 全体スナップショットを `docs/history/docs/snapshot/` に保存する。
8. `develop/` 側の計画や履歴の変更は `develop/` 配下の規約に従って管理する。
9. 当面は docs 変更も develop 変更も、要約履歴と対応スナップショットを常に対で運用する。
10. `Codex_Dashborad/` の仕様、計画、実装、データ運用の変更は、ルート直下ではなく `Codex_Dashborad/` 配下のローカル規約で管理する。

## Anti-Duplication Rules

- 同じ定義を複数ファイルに書かない。
- Mermaid の元定義は `story_release_map.md` だけに置く。
- task state の定義は `research_operation.md` だけに置く。
- docs 全体の要約履歴は `docs/history/docs/summary/summary.md` に集約する。
- docs 全体のスナップショットは `docs/history/docs/snapshot/` だけに置く。
- 実開発変更の履歴とスナップショットは `develop/` 配下だけに置く。
- release line 計画実体は `develop/plans/YYYY-MM-DD-XXX/` の dated set で管理する。
- `current_state.md` には要約だけを書き、定義本文は他ファイルへリンクする。
- `Codex_Dashborad/` の feature 定義や設計方針を、ルート `docs/` や `develop/` に重複記載しない。

## Agent Scope

- このプロジェクトでは、ルート `AGENTS.md` は `docs/` を入口にしつつ、`develop/` を実開発作業面として扱う。
- 以後の Codex は、規約変更時に `docs/index.md` を入口として扱う。
- 実開発文書作成時は `develop/index.md` を入口として扱う。
- `Codex_Dashborad/` 配下で作業する場合は、そのローカル `AGENTS.md` とローカル `docs/index.md` / `develop/index.md` を入口とし、ルート側は境界管理だけを担う。
