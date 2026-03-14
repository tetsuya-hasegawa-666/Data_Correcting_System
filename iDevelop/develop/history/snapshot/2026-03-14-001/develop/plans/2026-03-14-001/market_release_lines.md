# Market Release Line Plan

## Purpose

この文書は、Codex 向けダッシュボードの外部価値を Market Release Line として具体化する。

## Planning Rules

- Market Release Line は利用者が受け取る価値単位で定義する。
- 各 line は複数の Micro Release Line を持つ。
- 文書画面とデータ画面は must scope、コード画面は optional scope として扱う。

## Market Release Lines

| ID | Name | Delivered Value | Entrance Criteria | Exit Criteria | Linked Micro Releases | Change Drivers |
|---|---|---|---|---|---|---|
| MRL-0 | 作業面成立ライン | Codex 用 dashboard の最小作業面が起動し、文書とデータの入口が見える | ローカル規約と初期構成が存在する | 文書画面とデータ画面の骨格ルートが確認できる | mRL-0-1, mRL-0-2, mRL-0-3 | 技術選定、画面構成 |
| MRL-1 | 文書運用成立ライン | 文書検索、一覧、編集、保存が一連で扱える | 文書モデルと検索条件が定義済み | 開発者が dashboard から文書操作を完結できる | mRL-1-1, mRL-1-2, mRL-1-3 | 文書形式、編集体験 |
| MRL-2 | データ可視化成立ライン | 保持データと結果データを閲覧、集計、図表表示できる | データモデルと集計要件が定義済み | 開発者が dashboard 上で結果整理できる | mRL-2-1, mRL-2-2, mRL-2-3 | 集計観点、チャート選定 |
| MRL-3 | 遠隔コード支援成立ライン | optional なコード参照とデバッグ導線が成立する | read-only 参照機構が定義済み | コード参照と basic debug 情報確認ができる | mRL-3-1, mRL-3-2 | 安全性、権限境界 |
| MRL-4 | カスタマイズ継続成立ライン | 拡張ポイント経由で画面や機能を増やせる | shared-core と module 境界が定義済み | 既存コアを書き換えずに機能追加できる | mRL-4-1, mRL-4-2 | plugin 設計、保守性 |

## Current Recommendation

- 最初の到達目標は `MRL-0`。
- 次に `MRL-1` と `MRL-2` を優先し、文書とデータの 2 画面を成立させる。
- `MRL-3` は optional scope として、土台が固まってから着手する。
