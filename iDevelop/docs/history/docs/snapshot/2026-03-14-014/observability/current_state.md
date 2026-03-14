# Current State

## Current Position

- current market release: MRL-6
- current micro release: mRL-6-2
- thread purpose: MRL-5 の UX 是正を完了し、integrated readiness の最終確認へ進める

## Completed

- `document-workspace` に `保存` と `キャンセル` を配置した
- document editor の外側クリックでキャンセル扱いになる挙動を追加した
- `shared-core` の tab navigation を見直し、`ドキュメント` `データ` `コード` を切り替えられる状態にした
- `document/data/code` の UI 表示文言を日本語へ寄せた
- `document/data/code` の seed/dummy data を体験用に日本語中心へ更新した
- `UX_check_work_flow.md` を現行 UI に合わせて更新した
- `npm test` が green
- `npm run build` が green

## Active Risks

- manual UI exploratory check はまだユーザー実施待ち
- 文書・データ・コードの汎用読込要件と再利用可能な repository contract は次の execution line で明文化が必要
- recursive directory 読込は未実装で、現在は seed data + browser storage の体験段階

## Pending Change Requests

- 他 project へコピーして使える汎用読込設計の明文化
- document/data/script を再帰的に走査する source contract の定義

## Next Validation Point

- `npm run dashboard` を起動し、`docs/process/UX_check_work_flow.md` に沿って `ドキュメント` `データ` `コード` を手動確認する

## Handoff Note

### Decisions Made

- MRL-5 の read-only code entry は維持しつつ、体験評価を妨げる UX 不整合を先に解消した
- UI 表示文言はバックエンド契約より先に日本語で統一する
- cancel UX は明示ボタンと外側クリックの両方を必須とする

### Open Issues

- recursive loader と汎用 project contract は未着手
- manual UI check の実測 evidence は未記録

### Next Actions

1. `npm run dashboard` を起動する
2. `docs/process/UX_check_work_flow.md` の手順で 3 workspace を確認する
3. 確認結果を `current_state.md` と history へ追記し、`mRL-6-3` を閉じる

### Risks / Assumptions

- 現在の保存先は browser localStorage のまま据え置く
- optional scope は引き続き read-only を守る
- source-of-truth の汎用読込は次の plan set で扱う
