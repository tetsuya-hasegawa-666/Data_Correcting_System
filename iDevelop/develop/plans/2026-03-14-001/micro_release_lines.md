# Micro Release Line Plan

## Purpose

この文書は、Codex 向けダッシュボードを、開発者が短いサイクルで検証できる Micro Release Line へ分解する。

## Definition Rule

- 各 Micro Release は体験可能であること。
- 各 Micro Release は BDD の受け入れ条件と接続できること。
- 各 Micro Release は TDD の最小実装単位へ落とせること。

## Micro Release Lines

| ID | Parent | Developer Experience | Verification Method | Expected Result | Failure Split | Next Decomposition Target |
|---|---|---|---|---|---|---|
| mRL-0-1 | MRL-0 | dashboard を起動して文書画面入口を見つけられる | ローカル起動して navigation を確認する | document workspace へ遷移できる | 起動失敗 / route 不足 | app shell |
| mRL-0-2 | MRL-0 | data 画面入口を見つけられる | navigation を確認する | data workspace へ遷移できる | route 不足 / state 不足 | data shell |
| mRL-0-3 | MRL-0 | 各 workspace が独立モジュールとして登録されていると確認できる | module registry を確認する | 拡張前提の骨格が見える | core 直結 / 分離不足 | plugin contract |
| mRL-1-1 | MRL-1 | 文書一覧を検索条件つきで表示できる | 文書サンプルを読んでフィルタする | 対象文書が絞り込まれる | index 不足 / query 不足 | search model |
| mRL-1-2 | MRL-1 | 文書詳細を編集できる | 文書を開いて編集保存する | 保存結果が再読込で反映される | editor failure / save failure | document editor |
| mRL-1-3 | MRL-1 | 文書変更履歴や結果整理へ導線が見える | UI 上の関連導線を確認する | 次アクション判断ができる | linkage 不足 | doc workflow integration |
| mRL-2-1 | MRL-2 | 保持データと結果データを一覧できる | サンプルデータを読み込む | データ種別ごとに表示される | schema 不足 | dataset model |
| mRL-2-2 | MRL-2 | 集計結果を数値表示できる | 集計関数を実行する | summary 指標が表示される | aggregation failure | metric service |
| mRL-2-3 | MRL-2 | 集計結果を図表表示できる | chart を描画する | 開発者が変化傾向を読める | chart binding failure | chart adapter |
| mRL-3-1 | MRL-3 | 遠隔コード参照でファイルを閲覧できる | 対象コードを読み込む | read-only で参照できる | permission failure / path failure | code viewer |
| mRL-3-2 | MRL-3 | basic debug 情報を確認できる | ログまたは実行状態を表示する | 現況確認ができる | signal 不足 / security risk | debug provider |
| mRL-4-1 | MRL-4 | 新しい workspace を既存コア修正なしで追加できる | モジュール追加を試す | extension point 経由で登録される | contract 不足 | extension registry |
| mRL-4-2 | MRL-4 | BDD/TDD 付きで機能追加を回せる | story, test, implementation を確認する | 変更規律が維持される | story 欠落 / test 欠落 | workflow automation |

## Current Recommendation

1. まず `mRL-0-1` から `mRL-0-3` を成立させる。
2. 次に `mRL-1-1` と `mRL-2-1` を並行で進め、文書とデータの入口を固める。
3. `mRL-4-1` は早めに確認し、拡張余地を先に作る。
