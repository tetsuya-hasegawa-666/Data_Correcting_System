# Current State

## Current Position

- current plan set: `2026-03-14-004`
- current market release: MRL-1
- current micro release: mRL-1-1
- thread purpose: 実体接続から本番仮運用へ進む新 release line を定義し、次の実装入口を固定する

## Completed

- dummy data ベースの dashboard で user manual UX check が通った
- `document-workspace` に `保存` と `キャンセル`、外側クリックキャンセルを実装した
- `document/data/code` の UI 表示文言を日本語へ寄せた
- `document/data/code` の seed/dummy data を体験用に日本語中心へ更新した
- `UX_check_work_flow.md` を現行 UI に合わせて更新した
- `npm test` が green
- `npm run build` が green
- 次フェーズ用の plan set `2026-03-14-004` を active に切り替えた

## Active Risks

- recursive directory 読込は未実装で、現在は seed data + browser storage の体験段階
- 実体 project ごとの path 差異を吸収する generic contract は未定義
- 変化し続ける相手への refresh / stale policy は未定義

## Pending Change Requests

- 他 project へコピーして使える汎用読込設計の明文化
- document/data/script を再帰的に走査する source contract の定義
- 実体接続から本番仮運用までの setup / rollback / evidence の確立

## Next Validation Point

- `develop/plans/2026-03-14-004/market_release_lines.md` と `micro_release_lines.md` に沿って `mRL-1-1` の project manifest contract を固める

## Handoff Note

### Decisions Made

- dummy dashboard の UX 検証は完了扱いとし、次は実体接続の plan に進む
- 次 plan set は generic contract を先に定義し、その後 live read と pilot operation へ進む
- code workspace は引き続き read-only のまま実体接続する

### Open Issues

- recursive loader と汎用 project contract は未着手
- filesystem repository と refresh policy は未着手

### Next Actions

1. `mRL-1-1` の project manifest schema を定義する
2. `mRL-1-2` の recursive read requirement を BDD/TDD 前提で整理する
3. `UX_check_work_flow.md` に generic setup 章を追加する

### Risks / Assumptions

- 現在の保存先は browser localStorage のまま据え置く
- optional scope は引き続き read-only を守る
- live source の最初の接続は read-first で進める
