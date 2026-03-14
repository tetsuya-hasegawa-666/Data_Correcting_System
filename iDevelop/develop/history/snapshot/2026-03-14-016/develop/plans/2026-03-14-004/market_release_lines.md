# Market Release Line Plan

## Purpose

この plan set は、`iDevelop` を dummy dashboard から live project 接続と pilot handoff まで進める execution-oriented release line である。

## Planning Rules

- 作業対象は `iDevelop/` だけに限定する
- MVC を崩さない
- must scope は `document` と `data`
- `code` は read-only optional scope として段階投入する
- 各 market release line の成果物に `docs/process/UX_check_work_flow.md` 更新を含める
- plan set / release line / micro release は、ユーザー指示がない限り連番を維持する
- ID / status / artifact name / source policy name は明示変更がない限り継続利用する

## Market Release Lines

| ID | Name | Delivered Value | Entrance Criteria | Exit Criteria | Linked Micro Releases |
|---|---|---|---|---|---|
| MRL-5 | Generic Project Contract Line | generic project にコピーできる project contract を定義する | dummy UX line 完了 | manifest / recursive read / ignore / path boundary / setup / `UX_check_work_flow.md` がそろう | mRL-5-1, mRL-5-2, mRL-5-3 |
| MRL-6 | Live Document/Data Read Line | live project から document/data を read-only で読める | MRL-5 完了 | filesystem repository / recursive scan / refresh UX / read-only 表示 / `npm test` / `npm run build` / `UX_check_work_flow.md` 更新 | mRL-6-1, mRL-6-2, mRL-6-3 |
| MRL-7 | Change Tracking Line | refresh 後の変化を判断できる | MRL-6 完了 | refresh policy / stale indicator / refresh evidence / `UX_check_work_flow.md` 更新 | mRL-7-1, mRL-7-2, mRL-7-3 |
| MRL-8 | Generic Code Entry Line | code/script を generic contract で read-only browse できる | MRL-7 完了 | recursive code/script read / safety boundary / project mapping / `UX_check_work_flow.md` 更新 | mRL-8-1, mRL-8-2 |
| MRL-9 | Pilot Operation Line | 本番仮運用に必要な setup / rollback / evidence / handoff をそろえる | MRL-8 完了 | setup checklist / pilot runbook / rollback note / evidence log / manual UX check / handoff note | mRL-9-1, mRL-9-2, mRL-9-3 |

## Current Recommendation

- completed line: `MRL-7`
- next first target: `MRL-8 / mRL-8-1`
- next failing test theme: code/script roots contract と recursive read rule
