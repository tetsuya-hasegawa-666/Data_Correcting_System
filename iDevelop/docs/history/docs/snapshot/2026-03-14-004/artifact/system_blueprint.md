# System Blueprint For Codex Dashboard

## Purpose

この文書は、Codex 向けダッシュボードをどう構造化するかの骨格を定義する。
画面機能の拡張余地を維持しつつ、修正影響をコアへ閉じ込めるための責務境界を固定する。

## Required Chapters For The First Implementation Session

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
16. 実装開始セッションの入口条件

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

## First Implementation Slice

### Target

- 最初の target micro release は `mRL-2-1` を実装入口へ変換した `document-workspace` の must scope slice とする。
- 実装対象は「文書一覧」「キーワード検索」「選択中文書のプレビュー」の 3 点に限定する。
- `code-workspace` は phase gate 判定の結果として今回の開始 slice から外す。

### BDD Story

- story summary:
  Codex と人間の共同開発者は、`iDevelop` の source-of-truth 文書を一覧し、キーワードで絞り込み、選択中の文書内容を同一画面で確認できる。

```mermaid
flowchart LR
    A["開発者が document workspace を開く"] --> B["controller が document 一覧を取得する"]
    B --> C["view が一覧と初期プレビューを描画する"]
    C --> D["開発者が検索語を入力する"]
    D --> E["controller が title/path/body/tag を横断検索する"]
    E --> F["view が一致件数と選択中プレビューを更新する"]
```

### Behavior Leaves

- `DOC-B1`: 文書画面を開くと、文書一覧が title 昇順で表示される。
- `DOC-B2`: 検索語を入力すると、title/path/body/tag のいずれかに一致する文書だけが残る。
- `DOC-B3`: 一致結果の先頭文書が選択中となり、タイトル・path・本文プレビューが表示される。

### Acceptance Criteria

| behavior_id | condition | expected result |
|---|---|---|
| `DOC-B1` | query が空の状態で画面を開く | すべての seed document が title 昇順で表示される |
| `DOC-B2` | `bdd` のような小文字 query を入力する | `BDD` を含む文書が大文字小文字を区別せずに抽出される |
| `DOC-B3` | 検索結果が 1 件以上ある | 先頭一致文書の title/path/body が preview panel に表示される |

### First TDD Tasks

| task_id | behavior_id | test_target | criterion | status | evidence |
|---|---|---|---|---|---|
| `TDD-DOC-1` | `DOC-B1` | `DocumentWorkspaceController` | query 空時に title 昇順一覧と先頭選択を返す | VERIFIED | Vitest green |
| `TDD-DOC-2` | `DOC-B2` | `DocumentWorkspaceController` | title/path/body/tag 横断で case-insensitive 検索を返す | VERIFIED | Vitest green |
| `TDD-DOC-3` | `DOC-B3` | `DocumentWorkspaceView` | query、件数、選択中文書 preview を描画する | VERIFIED | Vitest green |

## Recommended Future Expansion

- モジュール単位の plugin registry
- データ画面のカスタム chart adapter
- コード画面向けの debug session provider

## Initial Implementation Note

- 実装は `shared-core` の bootstrap と `document-workspace` の最小 MVC から開始する。
- data workspace は次の must scope slice として、sample data contract と集計表示を別ストーリーで追加する。
