# Documentation Index

このサブプロジェクトでは、`docs/` は運用規約と source-of-truth を扱う。
`develop/` は実開発の計画、設計具体化、開発履歴、変更対象文書を扱う。

新しい ad hoc 文書は原則作らない。
追加は既存レイヤに編入し、修正は履歴とスナップショットを対で残す。

## Governance Principle

このダッシュボードは、拡張的変更にオープンであり、修正的変更にクローズであることを基本原則とする。

- 拡張的変更にオープン:
  画面追加、集計追加、表示拡張、拡張ポイント追加を既存レイヤへ編入できる。
- 修正的変更にクローズ:
  既存の意味を無言で上書きせず、所定レイヤでのみ更新し、要約履歴と対応スナップショットを対で残す。

## Scope Boundary

- `docs/`
  規約、前提、不変条件、意味体系、運用ルール、source-of-truth
- `develop/`
  実開発の計画、release line 詳細、実装準備文書、開発履歴、変更文書スナップショット
- `src/`
  ダッシュボード実装コード
- `data/`
  保持データ定義、結果データ例、集計素材、可視化用サンプル

## Source-of-Truth Layout

| Layer | File | Purpose | Fixed Content | Changeable Content |
|---|---|---|---|---|
| Artifact | `docs/artifact/north_star.md` | 目的、非交渉条件、成功判定 | Human Goal、対象利用者、非機能の不変条件 | 優先順位づけの仮説 |
| Artifact | `docs/artifact/system_blueprint.md` | ダッシュボード構造定義 | 画面責務、拡張境界、設計原則 | 採用技術、構成詳細、拡張方式 |
| Process | `docs/process/research_operation.md` | BDD/TDD ベースの実装運用ルール | ストーリー起点、テスト起点、作業状態 | 現行テンプレート、判断例 |
| Process | `docs/process/windows_beginner_manual.md` | Windows 初心者向けの起動・テスト・体験操作マニュアル | 基本操作手順、起動コマンド、終了手順 | 現行 UI に合わせた確認ポイント |
| Process | `docs/process/change_protocol.md` | 変更要求の受理と意味確認 | 入出力フォーマット、競合判定、履歴項目 | 実案件ごとの判断例 |
| Observability | `docs/observability/current_state.md` | 現在地の一枚絵 | ステータス項目、更新責任 | 現在の release、進捗、未解決点 |
| DocsSummary | `docs/history/docs/summary/summary.md` | docs 全体の単一要約履歴 | エントリ形式、対応関係 | エントリ追加 |
| DocsSnapshot | `docs/history/docs/snapshot/README.md` | docs 全体のスナップショット | 保存単位、保存対象、命名規則 | 各時点の全体保存 |

## Update Rules

1. 目的や不変条件の変更は `north_star.md` を先に更新する。
2. 画面構造や拡張境界の変更は `system_blueprint.md` を先に更新する。
3. BDD/TDD と作業規律の変更は `research_operation.md` を先に更新する。
4. 変更要求、競合判定、履歴ルールは `change_protocol.md` のみを更新する。
5. 現在の進捗や進行中判断は `current_state.md` のみを更新する。
6. `docs/` 内の意味体系に関わる変更を行ったら、`docs/history/docs/summary/summary.md` に要約エントリを 1 件追加する。
7. 同じ変更時点の `docs/` 全体スナップショットを `docs/history/docs/snapshot/` に保存する。
8. `develop/` 側の計画や履歴の変更は `develop/` 配下の規約に従って管理する。

## Anti-Duplication Rules

- 同じ定義を複数ファイルに書かない。
- MVC、BDD、TDD の原則定義は `north_star.md` と `research_operation.md` に閉じる。
- docs 全体の要約履歴は `docs/history/docs/summary/summary.md` に集約する。
- docs 全体のスナップショットは `docs/history/docs/snapshot/` だけに置く。
- 実開発変更の履歴とスナップショットは `develop/` 配下だけに置く。

## Agent Scope

- このサブプロジェクトでは、`AGENTS.md` は `docs/` を入口にしつつ、`develop/` を実開発作業面として扱う。
- ダッシュボード実装、文書検索・編集、データ画面、コード参照・デバッグ画面の検討はこの配下だけで行う。
- メインプロジェクト本体の `docs/` や `develop/` に dashboard feature 定義を混在させない。
