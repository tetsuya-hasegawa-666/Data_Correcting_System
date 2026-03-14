# System Blueprint For Codex Dashboard

## Purpose

この文書は、Codex 向けダッシュボードをどう構造化するかの骨格を定義する。
画面機能の拡張余地を維持しつつ、修正影響をコアへ閉じ込めるための責務境界を固定する。

## Required Chapters For Implementation Thread

1. 利用者と利用場面
2. 画面構成
3. MVC 境界
4. 拡張ポイント設計
5. 文書検索・編集機能
6. データ閲覧・集計機能
7. 図表表示機能
8. 遠隔コード参照機能
9. 遠隔デバッグ機能
10. データモデル
11. プラグインまたはモジュール戦略
12. BDD ストーリー
13. TDD 実装順序
14. 検証計画
15. release line

## Content Allocation

| Topic | Primary Home | Why |
|---|---|---|
| 目的、不変条件、設計原則 | `docs/artifact/north_star.md` | 長期に意味を固定するため |
| 画面構成、責務境界、拡張戦略 | `docs/artifact/system_blueprint.md` | コア構造を一箇所に集約するため |
| BDD/TDD の運用ルール | `docs/process/research_operation.md` | 実装規律を固定するため |
| 変更要求、履歴、競合処理 | `docs/process/change_protocol.md` | 更新ルールを一箇所に閉じるため |
| 現在の進捗と次アクション | `docs/observability/current_state.md` | ライブ状態だけを薄く持つため |

## Structure Constraints

- View は表示責務に閉じ、文書操作や集計ロジックを直接持たない。
- Controller はユースケースの調停に集中し、永続化や表示詳細を抱え込まない。
- Model は文書、データ、実行結果、拡張モジュールの意味モデルを保持する。
- 画面追加は拡張ポイント経由を優先し、既存画面の分岐追加を常態化させない。
- BDD シナリオ未定義の機能を先に実装しない。
- failing test を持たない feature 実装を標準手順にしない。

## Initial Module Direction

- `document-workspace`
  文書検索、一覧、編集、保存
- `data-workspace`
  保持データと結果データの一覧、集計、チャート表示
- `code-workspace`
  遠隔コード参照、ログ確認、optional なデバッグ導線
- `shared-core`
  ルーティング、設定、拡張登録、共通 UI 契約

## Recommended Future Expansion

- モジュール単位の plugin registry
- データ画面のカスタム chart adapter
- コード画面向けの debug session provider
