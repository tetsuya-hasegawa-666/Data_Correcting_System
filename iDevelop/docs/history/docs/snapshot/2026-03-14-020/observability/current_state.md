# Current State

## Current Position

- current plan set: `2026-03-14-004`
- current market release: `MRL-8`
- current micro release: `mRL-8-1`
- thread purpose: change tracking line を閉じ、generic code entry line の最初の contract slice へ進める

## Completed

- `2026-03-14-004 / MRL-5` の generic project contract line を完了
- `2026-03-14-004 / MRL-6` の live document/data read line を完了
- `2026-03-14-004 / MRL-7` の change tracking line を完了
- live source 用 status strip を追加し、`fresh` / `refreshed` / `stale` を表示できるようにした
- `再読み込み` の refresh evidence を localStorage に記録し、shell 上で確認できるようにした
- `npm test` green
- `npm run build` green
- `npm run dashboard` 起動中の `/api/dashboard/live-state` が `200` を返すことを確認

## Active Risks

- refresh evidence は localStorage の最小ログで、外部共有用の証跡 export は未実装
- stale 判定は loadedAt 基準の時間閾値で、source 側の push 通知は未実装
- code/script の live read は未着手で、optional scope の本体は `MRL-8` に残る

## Pending Change Requests

- code/script roots の generic contract を live source に接続する
- code workspace の recursive read と read-only browse を追加する
- pilot setup / rollback / evidence log を本番仮運用前提で整理する

## Next Validation Point

- `mRL-8-1` で code/script roots の contract と recursive read rule を固定する

## Handoff Note

### Decisions Made

- stale 判定は `loadedAt` と時間閾値で行い、shell に `fresh` / `refreshed` / `stale` を出す
- refresh evidence は localStorage に 5 件まで保持し、画面上で直近履歴を確認できるようにした
- refresh は引き続き read-only first で扱い、document/data の live source 変更だけを追う

### Open Issues

- evidence export / file log は未実装
- code/script live read の contract は未実装

### Next Actions

1. `mRL-8-1` の code/script roots contract を文書で固定する
2. `mRL-8-2` の read-only code/script browse を live source へ接続する
3. `MRL-9` に向けて pilot setup / rollback / evidence log を整理する

### Risks / Assumptions

- live connection は引き続き read-only first で扱う
- stale 判定は push 監視ではなく pull refresh を前提にする
- code workspace は `MRL-8` までは must scope に含めない
