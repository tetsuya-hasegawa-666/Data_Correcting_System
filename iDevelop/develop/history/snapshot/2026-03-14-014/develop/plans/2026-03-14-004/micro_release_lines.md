# Micro Release Line Plan

## Purpose

この文書は `2026-03-14-004` の market release line を、実装開始できる最小粒度へ分解する。

## Definition Rule

- 各 micro release は 1 つの狭い判断か実装断面に絞る
- 可能な限り failing test から始める
- must scope と optional scope を同じ micro release に混ぜない
- ID、名称、状態名、成果物名、データ名は、既存 release line / current state / history と同じ表記を使う

## Micro Release Lines

| ID | Parent | Developer Experience | Verification Method | Expected Result | Failure Split | Next Decomposition Target |
|---|---|---|---|---|---|---|
| mRL-5-1 | MRL-5 | 他 project に必要な最低限の project manifest を定義できる | contract doc review | root path、document/data/code roots、ignore、read-only boundary が定義される | contract ambiguity | manifest schema |
| mRL-5-2 | MRL-5 | recursive read 要件を文書化できる | BDD/TDD review | 子孫 directory、増減する項目、missing path の扱いが定義される | traversal ambiguity | recursive repository |
| mRL-5-3 | MRL-5 | setup 手順と UX check が generic project 向けに更新される | `UX_check_work_flow.md` review | 他 project へコピーしたときの setup 手順が成立する | onboarding gap | live read line |
| mRL-6-1 | MRL-6 | document repository を filesystem read へ差し替える failing test を書ける | repository test red | document recursive read contract が赤テストで固定される | path handling gap | document read impl |
| mRL-6-2 | MRL-6 | data repository を filesystem read へ差し替える failing test を書ける | repository test red | data recursive read contract が赤テストで固定される | data mapping gap | data read impl |
| mRL-6-3 | MRL-6 | dashboard 上で refresh して live read 結果を見られる | test, build, manual UX | 実体 document/data を read-only で確認できる | refresh regression | change tracking |
| mRL-7-1 | MRL-7 | 外部更新を再読込で取り込む contract を定義できる | BDD/TDD review | stale 条件と refresh result が定義される | stale ambiguity | refresh policy |
| mRL-7-2 | MRL-7 | stale indicator を view に出せる | view/controller test | UI で更新有無を判断できる | hidden change | diff evidence |
| mRL-7-3 | MRL-7 | 差分 evidence を最小ログとして残せる | test, manual UX | 再読込結果の最小 evidence が残る | noisy log | code entry |
| mRL-8-1 | MRL-8 | code/script roots を project contract に追加できる | contract review | code/script の recursive read rule が定義される | scope creep | code repository |
| mRL-8-2 | MRL-8 | read-only code/script browse を live source で出せる | test, build, manual UX | code workspace が実体 project に接続される | safety gap | pilot setup |
| mRL-9-1 | MRL-9 | pilot setup checklist を作れる | doc review | セットアップ、確認、停止手順が定義される | setup drift | pilot run |
| mRL-9-2 | MRL-9 | 実 project で本番仮運用の dry run を回せる | manual UX + evidence | 実体接続で document/data/code の確認が成立する | operation gap | handoff pack |
| mRL-9-3 | MRL-9 | handoff と rollback note を閉じられる | current state + history update | 次セッションで継続できる仮運用 handoff が完成する | missing context | next plan set |
