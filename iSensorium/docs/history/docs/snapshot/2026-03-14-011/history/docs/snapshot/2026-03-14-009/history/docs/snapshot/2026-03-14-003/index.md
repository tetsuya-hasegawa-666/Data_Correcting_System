# Documentation Index

このプロジェクトの文書は、最小限の source-of-truth を固定し、内容の追加や変更は既存文書の所定セクションを更新して反映する。
新しい ad hoc 文書は原則作らない。
また、`docs/` 全体はこのプロジェクト内で有効な `AGENTS.md` 相当の運用規約集合として扱う。

## Governance Principle

この文書体系は、拡張的変更にオープンであり、修正的変更にクローズであることを基本原則とする。

- 拡張的変更にオープン:
  新しい価値、観点、運用要求、履歴レイヤの追加は受け入れる。
- 修正的変更にクローズ:
  既存定義の意味を曖昧に上書きせず、所定レイヤでのみ更新し、履歴とスナップショットを対で残す。

## Source-of-Truth Layout

| Layer | File | Purpose | Fixed Content | Changeable Content |
|---|---|---|---|---|
| Artifact | `docs/artifact/north_star.md` | 目的、非交渉条件、成功判定 | Human Goal、対象端末、非機能の不変条件 | 優先順位づけの仮説 |
| Artifact | `docs/artifact/system_blueprint.md` | 実装対象の構造定義 | 文書の章立て責務、構成境界、成果物の結線 | 実装案、比較結果、採用理由 |
| Artifact | `docs/artifact/story_release_map.md` | User Story Map と release line の意味体系 | 階層構造、表記規約、意味連鎖 | 各 story、line、change point |
| Process | `docs/process/research_operation.md` | Human + AI 継続研究の実行ルール | 研究サイクル、task state、証跡の残し方 | 現行の運用テンプレート |
| Process | `docs/process/change_protocol.md` | 変更要求の受理と意味確認 | 入出力フォーマット、競合判定、履歴項目 | 実案件ごとの判断例 |
| Observability | `docs/observability/current_state.md` | 現在地の一枚絵 | ステータス項目、更新責任 | 現在の release、進捗、未解決点 |
| History | `docs/history/README.md` | 文書体系全体の方向履歴ルール | 記録単位、命名規則、要約形式 | 履歴の追加 |
| Snapshot | `docs/snapshots/README.md` | 文書体系全体の検証用スナップショット管理 | 保存単位、保存対象、命名規則 | 各時点の全体保存 |
| DevHistory | `docs/development_history/README.md` | 実開発変更の目的付き履歴 | 記録項目、命名規則、要約形式 | 履歴の追加 |
| DevSnapshot | `docs/development_snapshots/README.md` | 実開発変更の変更文書スナップショット管理 | 保存単位、保存対象、命名規則 | 各変更時点の部分保存 |
| Archive | `docs/archive/legacy_docs/` | 廃止文書の退避 | 保管場所のみ | 廃止済み版の履歴 |

## Update Rules

1. 目的や不変条件の変更は `north_star.md` を先に更新する。
2. 実装対象の追加や分割は `system_blueprint.md` を先に更新する。
3. release line、story、Mermaid は `story_release_map.md` に集約する。
4. 会話ルール、変更要求、競合判定は `change_protocol.md` のみを更新する。
5. 現在の進捗や進行中判断は `current_state.md` のみを更新する。
6. 文書体系全体の方向性が変わる変更を行ったら、`docs/history/` に方向履歴を 1 件追加する。
7. 同じ変更時点の `docs/` 全体スナップショットを `docs/snapshots/` に保存する。
8. 実開発で振る舞い、目的、背景理由、変更要約に関わる変更を行ったら、`docs/development_history/` に履歴を 1 件追加する。
9. 同じ開発変更時点の「変更した文書のみ」のスナップショットを `docs/development_snapshots/` に保存する。
10. 当面は文書体系変更も実開発変更も、履歴とスナップショットを常に対で運用する。
11. 文書の置換時は旧版を `docs/archive/legacy_docs/` に退避し、`index.md` の参照先を更新する。

## Anti-Duplication Rules

- 同じ定義を複数ファイルに書かない。
- Mermaid の元定義は `story_release_map.md` だけに置く。
- task state の定義は `research_operation.md` だけに置く。
- 変更履歴の正式記録は `change_protocol.md` だけに置く。
- 文書体系全体の変更方向履歴は `docs/history/` だけに置く。
- 文書体系全体の検証用スナップショットは `docs/snapshots/` だけに置く。
- 実開発変更の履歴は `docs/development_history/` だけに置く。
- 実開発変更の検証用スナップショットは `docs/development_snapshots/` だけに置く。
- `current_state.md` には要約だけを書き、定義本文は他ファイルへリンクする。

## Agent Scope

- このプロジェクトでは、ルート `AGENTS.md` は `docs/` 全体を運用規約の実体として参照する。
- 以後の Codex は、文書更新時に `docs/index.md` を入口として扱う。
- 個別ルールを追加する場合も、`docs/` 配下の既存 source-of-truth に編入する。
