# Current State

## Current Position

- current plan set: `2026-03-14-004`
- current market release: MRL-6
- current micro release: mRL-6-1
- thread purpose: MRL-5 を完了扱いにし、filesystem read line の最初の実装入口へ進む

## Completed

- dummy data ベースの dashboard で user manual UX check が通った
- `document-workspace` に `保存` と `キャンセル`、外側クリックキャンセルを実装した
- `document/data/code` の UI 表示文言を日本語へ寄せた
- `document/data/code` の seed/dummy data を体験用に日本語中心へ更新した
- `UX_check_work_flow.md` を現行 UI に合わせて更新した
- `npm test` が green
- `npm run build` が green
- 次フェーズ用の plan set `2026-03-14-004` を active に切り替えた
- `2026-03-14-004 / MRL-5` の generic project contract line を完了した
- generic project contract、recursive read rule、generic setup を source-of-truth に追加した

## Active Risks

- recursive directory 読込は未実装で、現在は seed data + browser storage の体験段階
- 変化し続ける相手への refresh / stale policy は未定義
- filesystem repository の path handling はこれから contract 化する必要がある

## Pending Change Requests

- 他 project へコピーして使える汎用読込設計の明文化
- document/data/script を再帰的に走査する source contract の実装
- 実体接続から本番仮運用までの setup / rollback / evidence の確立

## Next Validation Point

- `develop/plans/2026-03-14-004/market_release_lines.md` と `micro_release_lines.md` に沿って `mRL-6-1` の document filesystem repository contract を固める

## Handoff Note

### Decisions Made

- dummy dashboard の UX 検証は完了扱いとし、次は実体接続の plan に進む
- generic contract は source-of-truth に固定済みとし、次は live read 実装へ進む
- code workspace は引き続き read-only のまま実体接続する

### Open Issues

- filesystem repository と refresh policy は未着手
- stale indicator と diff evidence の仕様は未着手

### Next Actions

1. `mRL-6-1` の document filesystem repository contract を failing test 前提で整理する
2. `mRL-6-2` の data filesystem repository contract を同じ naming でそろえる
3. refresh UX を `mRL-6-3` の検証出口として定義する

### Risks / Assumptions

- 現在の保存先は browser localStorage のまま据え置く
- optional scope は引き続き read-only を守る
- live source の最初の接続は read-first で進める
