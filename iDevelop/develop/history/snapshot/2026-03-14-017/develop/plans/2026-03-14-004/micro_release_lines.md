# Micro Release Line Plan

## Purpose

この文書は `2026-03-14-004` の market release line を、最小 failing test 単位まで分解して扱う。

## Definition Rule

- 各 micro release は 1 つの到達点に限定する
- 可能な限り failing test から始める
- must scope と optional scope を混ぜない
- 連番、ID、status、artifact name は plan / current state / history で同一に保つ

## Micro Release Lines

| ID | Parent | Developer Experience | Verification Method | Expected Result | Next Decomposition Target |
|---|---|---|---|---|---|
| mRL-5-1 | MRL-5 | project manifest schema を定義する | contract review | root path / roots / ignore / read-only boundary が固定される | manifest schema |
| mRL-5-2 | MRL-5 | recursive read rule を fixed text にする | BDD/TDD review | child / grandchild directory と missing root の扱いが固定される | recursive repository |
| mRL-5-3 | MRL-5 | generic setup と UX check を整える | `UX_check_work_flow.md` review | 他 project にコピーして使う setup が見える | live read line |
| mRL-6-1 | MRL-6 | document recursive read の failing test を作る | repository test red | document live read contract が test で固定される | document read impl |
| mRL-6-2 | MRL-6 | data recursive read の failing test を作る | repository test red | data live read contract が test で固定される | data read impl |
| mRL-6-3 | MRL-6 | dashboard に refresh UX と read-only 表示を通す | test / build / manual UX | live source の document/data を read-only で確認できる | change tracking |
| mRL-7-1 | MRL-7 | refresh policy と stale contract を定義する | BDD/TDD review | stale 判断条件と refresh 成功条件が固定される | stale indicator |
| mRL-7-2 | MRL-7 | stale indicator を view/controller に出す | controller/view test | UI で stale / refreshed が判別できる | refresh evidence |
| mRL-7-3 | MRL-7 | refresh evidence の最小ログを残す | test / manual UX | refresh した事実を evidence として残せる | code entry |
| mRL-8-1 | MRL-8 | code/script roots を project contract に接続する | contract review | code/script recursive read rule が固定される | code repository |
| mRL-8-2 | MRL-8 | read-only code/script browse を live source に広げる | test / build / manual UX | code workspace が generic project に接続される | pilot setup |
| mRL-9-1 | MRL-9 | pilot setup checklist を整える | doc review | setup / rollback / check items が固定される | pilot run |
| mRL-9-2 | MRL-9 | 本番仮運用 dry run を行う | manual UX + evidence | document/data/code の運用確認ができる | handoff pack |
| mRL-9-3 | MRL-9 | handoff / rollback / evidence を閉じる | current state + history update | 次セッションへ渡せる handoff が残る | next plan set |
