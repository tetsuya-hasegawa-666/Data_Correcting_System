# Current State

## Current Position

- current market release: MRL-2
- current micro release: mRL-2-3
- thread purpose: must scope の `document-workspace` と `data-workspace` を成立させ、`MRL-3` に入る直前まで進める

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

## Active Risks

- 文書画面の edit/save は未実装
- コード参照 / デバッグ画面は optional scope のため phase gate 未着手
- seed document は静的 JSON のため、実ファイル同期は次の slice で判断が必要
- dataset seed も静的 JSON のため、実データ接続や更新操作は次の slice で判断が必要

## Pending Change Requests

- none

## Next Validation Point

- `MRL-3` の `mRL-3-1` と `mRL-3-2` として、code/debug workspace を今回の後続フェーズへ入れるか phase gate 判定する
