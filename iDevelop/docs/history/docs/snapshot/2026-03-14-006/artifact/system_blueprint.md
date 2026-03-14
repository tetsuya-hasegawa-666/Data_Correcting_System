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

## Data Workspace First Slice

### Target

- `mRL-2-2` と `mRL-2-3` は `data-workspace` の must scope slice として実装する。
- 実装対象は「seed dataset 一覧」「status 集計」「軽量 bar chart」に限定する。
- chart は専用描画ライブラリを導入せず、軽量な DOM/CSS 表現で開始する。

### Sample Data Contract

| field | type | meaning |
|---|---|---|
| `id` | string | dataset の一意識別子 |
| `name` | string | dashboard 上の表示名 |
| `category` | string | dataset の系統 |
| `recordCount` | number | 内包レコード数 |
| `status` | string | `draft` や `ready` などの状態 |
| `updatedAt` | ISO-8601 string | 更新時刻 |

### BDD Story

- story summary:
  Codex と人間の共同開発者は、保持データと結果データの状態を同一画面で俯瞰し、dataset 一覧と状態別集計を軽量に確認できる。

```mermaid
flowchart LR
    A["開発者が data workspace を開く"] --> B["controller が seed dataset を取得する"]
    B --> C["updatedAt 降順の一覧を作る"]
    C --> D["status ごとの dataset 数と record 数を集計する"]
    D --> E["view が metric card と table を描画する"]
    E --> F["view が status 別の bar chart を描画する"]
```

### Behavior Leaves

- `DATA-B1`: data 画面を開くと、dataset 一覧が `updatedAt` 降順で表示される。
- `DATA-B2`: controller は dataset 全体の件数、record 総数、status 別集計を返す。
- `DATA-B3`: view は metric card、dataset table、status chart bar を同時に描画する。

### Acceptance Criteria

| behavior_id | condition | expected result |
|---|---|---|
| `DATA-B1` | seed dataset を読み込む | dataset 一覧が `updatedAt` の新しい順に表示される |
| `DATA-B2` | `draft` と `ready` が混在する | `totalDatasets`、`totalRecords`、`byStatus` が算出される |
| `DATA-B3` | 集計結果が 1 件以上ある | metric card、table row、chart bar が DOM に描画される |

### First TDD Tasks

| task_id | behavior_id | test_target | criterion | status | evidence |
|---|---|---|---|---|---|
| `TDD-DATA-1` | `DATA-B1` | `DataWorkspaceController` | `updatedAt` 降順の dataset 一覧を返す | VERIFIED | Vitest green |
| `TDD-DATA-2` | `DATA-B2` | `DataWorkspaceController` | status 別の dataset 数と record 数を集計する | VERIFIED | Vitest green |
| `TDD-DATA-3` | `DATA-B3` | `DataWorkspaceView` | total metric、row、chart bar を描画する | VERIFIED | Vitest green |

## Recommended Future Expansion

- モジュール単位の plugin registry
- データ画面のカスタム chart adapter
- コード画面向けの debug session provider

## Optional Scope Phase Gate

### Decision

- `MRL-3` の判定結果として、`code-workspace` は今回の市場リリースラインには含めない。
- `code-workspace` と debug 導線は次フェーズへ defer し、`MRL-4` では handoff 条件だけを残す。

### Gate Reason

- must scope の document/data は green/build まで到達したが、optional scope は利用価値より安全境界の未固定リスクが大きい。
- 現時点では path 制約、read-only 契約、debug provider の非採用条件が UI/Model/View 契約に落ちていない。
- optional scope を今ここで入れると、MVC 境界より先に外部コード参照や実行制御を設計することになり、過剰に広い slice になる。

### Safety Boundary For Future Entry

- path は `iDevelop/` 配下または明示許可済み read-only target に限定する。
- 初期 code workspace は file browse / text preview / log read に限定し、編集や実行は含めない。
- process attach、任意コマンド実行、認証情報読取、自動 polling は初期 optional scope から除外する。
- debug workspace を入れる場合も、最初は evidence 表示と session metadata 表示を優先し、制御操作は後続 slice に分離する。

### Entry Criteria For A Future Optional Slice

- read-only path policy が source-of-truth と current state に明記されている。
- code workspace の BDD story が 1 つに絞られ、file browse と debug control が混在していない。
- optional scope を加えても must scope の回帰テストが維持できる。

## Initial Implementation Note

- 実装は `shared-core` の bootstrap と `document-workspace` の最小 MVC から開始する。
- must scope は `document-workspace` と `data-workspace` の両方で最小 slice を成立済みである。
- optional scope は `MRL-3` の phase gate で defer を決め、次の market release line では handoff と次着手条件の固定だけを行う。
