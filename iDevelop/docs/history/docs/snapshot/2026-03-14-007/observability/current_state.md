# Current State

## Current Position

- current market release: MRL-4
- current micro release: mRL-4-3
- thread purpose: handoff 条件を固定し、この plan set を完了状態で閉じる

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
- 次セッションの first target を文書画面の edit/save slice に固定
- red-green-refactor の最初の順序と停止条件を handoff note に整理

## Active Risks

- 文書画面の edit/save は未実装
- コード参照 / デバッグ画面は未実装のままで、今後も read-only 入口から段階導入が必要
- seed document は静的 JSON のため、実ファイル同期は次の slice で判断が必要
- dataset seed も静的 JSON のため、実データ接続や更新操作は次の slice で判断が必要

## Pending Change Requests

- none

## Next Validation Point

- active plan set `2026-03-14-002` は handoff 完了。次セッションでは document edit/save slice の failing test から再開する。

## Handoff Note

### Decisions Made

- next first target: `document-workspace` の edit/save slice
- optional scope: `code-workspace` は defer 維持
- data/document seed は引き続き static JSON とし、外部同期は次段階で判断する

### Open Issues

- 文書編集結果をどの保存先へ書くかは未確定
- seed JSON を source-of-truth 実ファイルと同期させる戦略は未確定
- optional scope を再開する時点の browse 対象 path は未確定

### Next Actions

1. `DocumentWorkspaceController` の edit intent を failing test で定義する
2. View に編集フォームと save action の最小 UI を追加する
3. 保存先 contract を `iDevelop/` 配下に閉じた形で決める

### Risks / Assumptions

- 保存機構を急いで入れると source-of-truth と seed の二重管理を招く
- optional scope は read-only を崩さない前提で再開する
- must scope の回帰テスト green を維持できない変更は次セッションでも採用しない
