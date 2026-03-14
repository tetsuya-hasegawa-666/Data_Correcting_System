# Current State

## Current Position

- current market release: MRL-3
- current micro release: mRL-3-2
- thread purpose: optional scope の phase gate を判定し、`MRL-4` に入る直前で停止する

## Completed

- `iDevelop/` project directory active
- local docs/develop governance initialized
- dashboard initial scope defined
- naming and companion boundary aligned with `iSensorium/`
- `document-workspace` の first slice を一覧・検索・プレビューに固定
- `shared-core` bootstrap と `document-workspace` MVC 実装を追加
- Vitest ベースの最小 TDD 基盤を追加し、controller/view の red-green を確認
- `data-workspace` の first slice を dataset 一覧・status 集計・軽量 chart に固定
- sample dataset contract を JSON seed と MVC に実装
- must scope の controller/view テストと build を green で確認
- `code-workspace` は optional scope として defer する判定を確定
- future optional slice の安全境界を read-only / path 制約 / no process attach に固定

## Active Risks

- 文書画面の edit/save は未実装
- コード参照 / デバッグ画面は未実装のままで、今後も read-only 入口から段階導入が必要
- seed document は静的 JSON のため、実ファイル同期は次の slice で判断が必要
- dataset seed も静的 JSON のため、実データ接続や更新操作は次の slice で判断が必要

## Pending Change Requests

- none

## Next Validation Point

- `MRL-4` の `mRL-4-1` から `mRL-4-3` として、handoff 用に最初の次着手対象、TDD 順序、停止条件を固定する
