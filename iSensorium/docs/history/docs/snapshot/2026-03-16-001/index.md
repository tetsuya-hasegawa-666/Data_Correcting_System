# 文書インデックス

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

このプロジェクトでは、`docs/` は運用規約と source-of-truth を扱う。
`develop/` は実開発の計画、設計具体化、開発履歴、変更対象文書を扱う。

新しい ad hoc 文書は原則作らない。
追加は既存レイヤに編入し、修正は履歴とスナップショットを対で残す。

## 運用原則

この文書体系は、拡張的変更にオープンであり、修正的変更にクローズであることを基本原則とする。

- 拡張的変更にオープン:
  新しい価値、観点、運用要求、履歴観点は既存レイヤへ追加できる。
- 修正的変更にクローズ:
  既存定義の意味を曖昧に上書きせず、所定レイヤでのみ更新し、要約履歴と対応スナップショットを対で残す。

## 対象境界

- `docs/`
  規約、前提、不変条件、意味体系、運用ルール、source-of-truth
- `develop/`
  実開発の計画、release line 詳細、実装準備文書、開発履歴、変更文書スナップショット
- `iDevelop/`
  メインプロジェクトとは完全分離した Codex 向けダッシュボード用サブプロジェクト。ダッシュボードの文書、計画、実装、保持データ定義、結果整理、履歴はこの配下だけで扱う

## source-of-truth 構成

| レイヤ | ファイル | 目的 | 固定内容 | 可変内容 |
|---|---|---|---|---|
| 成果物 | `docs/artifact/north_star.md` | 目的、非交渉条件、成功判定 | Human Goal、対象端末、非機能の不変条件 | 優先順位づけの仮説 |
| 成果物 | `docs/artifact/system_blueprint.md` | 実装対象の構造定義 | 文書の章立て責務、構成境界、成果物の結線 | 実装案、比較結果、採用理由 |
| 成果物 | `docs/artifact/story_release_map.md` | User Story Map と release line の意味体系 | 階層構造、表記規約、意味連鎖 | 各 story、line、change point |
| プロセス | `docs/process/research_operation.md` | Human + AI 継続研究の実行ルール | 研究サイクル、task state、証跡の残し方 | 現行の運用テンプレート |
| プロセス | `docs/process/change_protocol.md` | 変更要求の受理と意味確認 | 入出力フォーマット、競合判定、履歴項目 | 実案件ごとの判断例 |
| 観測 | `docs/observability/current_state.md` | 現在地の一枚絵 | ステータス項目、更新責任 | 現在の release、進捗、未解決点 |
| 履歴ルート | `docs/history/README.md` | docs 履歴階層の全体規約 | 履歴レイヤの責務分離 | 履歴運用の追加指針 |
| docs 要約履歴 | `docs/history/docs/summary/summary.md` | docs 全体の単一要約履歴 | エントリ形式、対応関係 | エントリ追加 |
| docs スナップショット | `docs/history/docs/snapshot/README.md` | docs 全体のスナップショット | 保存単位、保存対象、命名規則 | 各時点の全体保存 |

## 更新ルール

1. 目的や不変条件の変更は `north_star.md` を先に更新する。
2. 実装対象の追加や分割は `system_blueprint.md` を先に更新する。
3. release line、story、Mermaid は `story_release_map.md` に集約する。
4. 利用者準備、外部 device access、手動前提は `docs/process/UX_check_work_flow.md` 冒頭の `利用者準備ノート` を先に更新する。
5. 会話ルール、変更要求、競合判定は `change_protocol.md` のみを更新する。
6. 現在の進捗や進行中判断は `current_state.md` のみを更新する。
7. `docs/` 内の意味体系に関わる変更を行ったら、`docs/history/docs/summary/summary.md` に要約エントリを 1 件追加する。
8. 同じ変更時点の `docs/` 全体スナップショットを `docs/history/docs/snapshot/` に保存する。
9. `develop/` 側の計画や履歴の変更は `develop/` 配下の規約に従って管理する。
10. 当面は docs 変更も develop 変更も、要約履歴と対応スナップショットを常に対で運用する。
11. `iDevelop/` の仕様、計画、実装、データ運用の変更は、ルート直下ではなく `iDevelop/` 配下のローカル規約で管理する。

## 継続ルール

- 15 分前後の手動確認、短時間 harness、UX 観測窓は停止条件ではなく、証拠採取の最小単位として扱う。
- Codex は、active な Market Release Line または Micro Release Line の出口条件を満たすまで継続する。
- 1 回の自律継続作業は、原則として最大 6 時間まで継続してよい。
- 停止してよい条件は次に限定する。
  - 実際の blocker があり、ローカルな仮説前進でも進めない。
  - ユーザー操作、外部認証、端末接続、データ提供が本当に必要である。
  - active release line の出口条件を満たし、かつ次の dated plan set または次の active micro release が未定義である。
- 歴史的に `reached` だった plan set や release line を見つけても、それだけを理由に会話全体を終了してはならない。
- active work を判断するときは、最初に `develop/index.md` と `docs/observability/current_state.md` を読み、歴史的完了と現在の実行対象を分離して解釈する。

## 探索とスナップショット境界

- broad search、再帰読込、要約対象の既定範囲から `docs/history/docs/snapshot/**` を除外する。
- `docs/history/docs/snapshot/**` は検証用保管物であり、source-of-truth でも active context でもない。
- `docs/` snapshot は `docs/history/docs/snapshot/**` 自身を再帰コピーしてはならない。
- snapshot を点検するときは manifest と対象 entry だけを見る。snapshot 全体を active docs と同じ優先度で読まない。

## 重複防止ルール

- 同じ定義を複数ファイルに書かない。
- Mermaid の元定義は `story_release_map.md` だけに置く。
- 利用者準備、外部 device access、手動前提は `docs/process/UX_check_work_flow.md` 冒頭の `利用者準備ノート` に集約する。
- task state の定義は `research_operation.md` だけに置く。
- docs 全体の要約履歴は `docs/history/docs/summary/summary.md` に集約する。
- docs 全体のスナップショットは `docs/history/docs/snapshot/` だけに置く。
- 実開発変更の履歴とスナップショットは `develop/` 配下だけに置く。
- release line 計画実体は `develop/plans/YYYY-MM-DD-XXX/` の dated set で管理する。
- `current_state.md` には要約だけを書き、定義本文は他ファイルへリンクする。
- `iDevelop/` の feature 定義や設計方針を、ルート `docs/` や `develop/` に重複記載しない。

## エージェント適用範囲

- このプロジェクトでは、ルート `AGENTS.md` は `docs/` を入口にしつつ、`develop/` を実開発作業面として扱う。
- 以後の Codex は、規約変更時に `docs/index.md` を入口として扱う。
- 実開発文書作成時は `develop/index.md` を入口として扱う。
- `iDevelop/` 配下で作業する場合は、そのローカル `AGENTS.md` とローカル `docs/index.md` / `develop/index.md` を入口とし、ルート側は境界管理だけを担う。
