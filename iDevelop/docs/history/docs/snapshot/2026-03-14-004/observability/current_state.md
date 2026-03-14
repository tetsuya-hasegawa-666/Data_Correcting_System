# Current State

## Current Position

- current market release: MRL-4
- current micro release: mRL-4-2
- thread purpose: `document-workspace` の最初の must scope 実装 slice を確定し、TDD で着手する

## Completed

- `iDevelop/` project directory active
- local docs/develop governance initialized
- dashboard initial scope defined
- naming and companion boundary aligned with `iSensorium/`
- `document-workspace` の first slice を一覧・検索・プレビューに固定
- `shared-core` bootstrap と `document-workspace` MVC 実装を追加
- Vitest ベースの最小 TDD 基盤を追加し、controller/view の red-green を確認

## Active Risks

- data workspace は未着手で、sample data contract と集計観点が未固定
- 文書画面の edit/save は未実装
- コード参照 / デバッグ画面は optional scope のため今回も未着手
- seed document は静的 JSON のため、実ファイル同期は次の slice で判断が必要

## Pending Change Requests

- none

## Next Validation Point

- `data-workspace` の最初の BDD ストーリーを `mRL-2-2` として固定し、sample data contract を `mRL-2-3` で具体化する
