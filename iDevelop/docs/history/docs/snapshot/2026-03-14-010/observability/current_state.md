# Current State

## Current Position

- current market release: MRL-6
- current micro release: mRL-6-2
- thread purpose: execution-oriented plan の主要ラインを実装へ反映し、integrated readiness を確認する

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
- active plan set を `develop/plans/2026-03-14-003/` へ切り替え
- 実現フェーズ向けの market/micro release line を新設
- entry command を `npm run dashboard` に固定
- 各 release line の exit で UI exploratory check を行う方針を追加
- `document-workspace` に edit/save UI と save flow を追加
- document source policy を seed bootstrap + localStorage save として実装
- `data-workspace` に dataset update と recent result summary を追加
- `shared-core` に workspace tab navigation と error banner を追加
- `code-workspace` に read-only target list を追加
- `npm run dashboard` の起動を確認

## Active Risks

- 文書画面の edit/save は未実装
- コード参照 / デバッグ画面は未実装のままで、今後も read-only 入口から段階導入が必要
- seed document は静的 JSON のため、実ファイル同期は次の slice で判断が必要
- dataset seed も静的 JSON のため、実データ接続や更新操作は次の slice で判断が必要
- UI exploratory check は基準化したが、画面内の操作ヘルプ自体はまだ未実装
- final exploratory check を人間が UI 操作で確認した証跡はまだ未記録

## Pending Change Requests

- none

## Next Validation Point

- `npm run dashboard` で dashboard を開き、document/data/code tab の操作確認を記録すれば `mRL-6-3` を閉じられる。

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
