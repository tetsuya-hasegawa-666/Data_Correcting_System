# Current State

## Current Position

- current plan set: `2026-03-14-004`
- current market release: `MRL-9`
- current micro release: `mRL-9-1`
- thread purpose: generic code entry line を閉じ、pilot operation line の最初の checklist slice へ進める

## Completed

- `2026-03-14-004 / MRL-5` の generic project contract line を完了
- `2026-03-14-004 / MRL-6` の live document/data read line を完了
- `2026-03-14-004 / MRL-7` の change tracking line を完了
- `2026-03-14-004 / MRL-8` の generic code entry line を完了
- `codeRoots` を manifest contract に接続し、live source から code / script browse target を生成できるようにした
- code workspace に source policy、種別、更新日時の read-only 表示を追加した
- `npm test` green
- `npm run build` green

## Active Risks

- pilot operation 向けの setup checklist / rollback note / evidence export は未実装
- refresh evidence は localStorage の最小ログで、外部共有向け出力は未実装
- live connection は read-only first のままで、書込系 integration は scope 外

## Pending Change Requests

- pilot setup checklist を明文化する
- rollback note と evidence export を追加する
- dry run と handoff pack を本番仮運用前提で閉じる

## Next Validation Point

- `mRL-9-1` で pilot setup checklist を fixed text として定義する

## Handoff Note

### Decisions Made

- code workspace も manifest の `codeRoots` から再帰読込する
- code / script browse は read-only のまま維持し、実行、attach、保存は許可しない
- live browse の refresh は document/data と同じ signature / evidence の流れに乗せる

### Open Issues

- setup / rollback / evidence export は未実装
- pilot runbook と dry run 手順は未実装

### Next Actions

1. `mRL-9-1` の pilot setup checklist を文書で固定する
2. `mRL-9-2` の dry run 手順と evidence 採取点を定義する
3. `mRL-9-3` で handoff / rollback / evidence pack を閉じる

### Risks / Assumptions

- live connection は引き続き read-only first で扱う
- code workspace は generic browse までを責務とし、操作系 integration は含めない
