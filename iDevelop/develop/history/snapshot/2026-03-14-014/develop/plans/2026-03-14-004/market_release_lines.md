# Market Release Line Plan

## Purpose

この plan set は、`iDevelop` を dummy dashboard から、実体 project に接続しながら本番仮運用へ進める execution-oriented release line とする。

## Planning Rules

- 対象は `iDevelop/` だけで扱う
- MVC を崩さない
- must scope は document/data から始め、code は read-only を維持したまま段階的に広げる
- BDD と TDD を前提にする
- 各 market release line の成果物に `docs/process/UX_check_work_flow.md` 更新を含める
- 実体接続は read-first と safety-first を守る
- plan set / release line の採番は、ユーザーが別指定しない限り連番を使う
- 既存の記載データ、ID、名称、状態名、成果物名は、明示変更がない限り継続利用する

## Market Release Lines

| ID | Name | Delivered Value | Entrance Criteria | Exit Criteria | Linked Micro Releases | Change Drivers |
|---|---|---|---|---|---|---|
| MRL-5 | Generic Project Contract Line | 他 project へコピーして使える project contract を定義する | dummy dashboard の UX check が通っている | project manifest、recursive read rule、ignore rule、path boundary、setup 手順、`UX_check_work_flow.md` の setup 章が定義済み | mRL-5-1, mRL-5-2, mRL-5-3 | 汎用性、再利用性 |
| MRL-6 | Live Document/Data Read Line | 実体 project から document/data を再帰読込できる | MRL-5 完了 | filesystem repository、recursive scan、refresh UX、read-only 実接続、`npm test` / `npm run build` / exploratory check が通る | mRL-6-1, mRL-6-2, mRL-6-3 | 実体接続、探索性 |
| MRL-7 | Change Tracking Line | 変化し続ける相手への追従方式を持つ | MRL-6 完了 | refresh policy、stale indicator、再読込結果表示、差分の最小 evidence、`UX_check_work_flow.md` 更新が完了 | mRL-7-1, mRL-7-2, mRL-7-3 | 変化追従、運用耐性 |
| MRL-8 | Generic Code Entry Line | code/script も同じ contract で read-only 接続できる | MRL-7 完了 | recursive code/script read、read-only safety boundary、project mapping、`UX_check_work_flow.md` の code 実接続手順が完了 | mRL-8-1, mRL-8-2 | optional scope の現実接続 |
| MRL-9 | Pilot Operation Line | 実 project で本番仮運用できる最小手順を持つ | MRL-8 完了 | setup checklist、pilot runbook、rollback note、evidence log、manual UX check、handoff note がそろう | mRL-9-1, mRL-9-2, mRL-9-3 | 仮運用、引継ぎ |

## Current Recommendation

- 次の first target は `MRL-5 / mRL-5-1`
- 最初に固定するのは project manifest と recursive read requirement
- 実装開始は contract と repository test の failing test から入る
