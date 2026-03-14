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

| ID | Name | Delivered Value | Status |
|---|---|---|---|
| MRL-5 | Generic Project Contract Line | generic project にコピーできる project contract を定義する | completed |
| MRL-6 | Live Document/Data Read Line | live project から document/data を read-only で読める | completed |
| MRL-7 | Change Tracking Line | refresh 後の変化を判断できる | completed |
| MRL-8 | Generic Code Entry Line | code/script を generic contract で read-only browse できる | completed |
| MRL-9 | Pilot Operation Line | 本番仮運用に必要な setup / rollback / evidence / handoff をそろえる | completed |

## Completion Note

- plan set `2026-03-14-004` は `MRL-9` まで完了した
- 次の作業は新しい plan set を作って開始する
