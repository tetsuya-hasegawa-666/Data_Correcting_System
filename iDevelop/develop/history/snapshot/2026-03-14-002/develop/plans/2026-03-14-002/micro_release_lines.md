# Micro Release Line Plan

## Purpose

この文書は、`iDevelop` の pre-implementation plan を、次セッション開始前に確認可能な最小単位へ分解する。

## Definition Rule

- 各 Micro Release は実装完了ではなく、着手条件の確認可能単位とする。
- 各 Micro Release は次セッションで「何を最初に作るか」を決める材料になること。
- BDD/TDD の入口を失わないよう、must scope と optional scope を混在させないこと。

## Micro Release Lines

| ID | Parent | Developer Experience | Verification Method | Expected Result | Failure Split | Next Decomposition Target |
|---|---|---|---|---|---|---|
| mRL-0-1 | MRL-0 | project 名、directory 名、companion 関係を迷わず読める | README, AGENTS, docs index を確認する | `iDevelop` と `iSensorium` の境界が一致する | naming drift / path mismatch | boundary docs |
| mRL-0-2 | MRL-0 | active な source-of-truth と develop 入口を特定できる | docs index, develop index, current state を確認する | 次セッションの参照開始点が固定される | stale pointer / duplicate rule | session entry |
| mRL-0-3 | MRL-0 | active plan set が current state と整合すると確認できる | current state と `2026-03-14-002` plan set を照合する | 次セッションの起点 plan が一意に決まる | old plan confusion | kickoff checklist |
| mRL-1-1 | MRL-1 | shared-core と各 workspace の責務を見失わない | blueprint を確認する | 実装対象モジュールの切り方が決まる | module overlap / missing core | module contract |
| mRL-1-2 | MRL-1 | OCP を保つ拡張方針を確認できる | north star と blueprint を確認する | 追加点とコア固定点が明確になる | extension leak / core mutation risk | extension registry plan |
| mRL-1-3 | MRL-1 | 技術選定で先に決める問いを一覧できる | 初回実装セッションの検討論点を確認する | stack 選定の論点漏れを防げる | unresolved stack / tooling ambiguity | stack decision record |
| mRL-2-1 | MRL-2 | 文書画面の最初の BDD ストーリーを選べる | 文書画面 must scope を確認する | search/edit の初回実装対象が決まる | story too broad / acceptance unclear | document story set |
| mRL-2-2 | MRL-2 | データ画面の最初の BDD ストーリーを選べる | データ画面 must scope を確認する | browse/aggregate/chart の初回実装対象が決まる | data contract gap / chart ambiguity | data story set |
| mRL-2-3 | MRL-2 | サンプルデータと結果出力の最小契約を想定できる | data directory と plan を確認する | 集計・可視化のテスト材料が定まる | sample absence / output ambiguity | seed data contract |
| mRL-3-1 | MRL-3 | コード画面を今回の初回実装から外すか入れるか判断できる | optional scope 条件を確認する | must scope を先行させる判断ができる | scope creep / under-spec | optional phase gate |
| mRL-3-2 | MRL-3 | 遠隔コード参照・デバッグの安全境界を確認できる | path, permission, read-only 方針を確認する | optional scope に入る条件が明確になる | security risk / boundary leak | code workspace decision |
| mRL-4-1 | MRL-4 | 次セッションの最初の実装対象を 1 つに絞れる | current recommendation を確認する | shared-core と must scope の開始順が決まる | kickoff too broad | first implementation slice |
| mRL-4-2 | MRL-4 | 最初の TDD 順序を確認できる | BDD/TDD ルールと plan を確認する | red-green-refactor の入り口が決まる | testless start / overbuild | first failing test |
| mRL-4-3 | MRL-4 | セッション停止条件と保留事項を確認できる | current state と risks を確認する | どこまで作って止めるかが見える | endless session / unclear done | handoff note |

## Current Recommendation

1. まず `mRL-0-1` から `mRL-0-3` を確認し、active plan set を `2026-03-14-002` に固定する。
2. 次に `mRL-1-1` と `mRL-1-2`、続いて `mRL-2-1` と `mRL-2-2` を実装開始前の確認順に置く。
3. `mRL-3-1` と `mRL-3-2` は optional scope の phase gate とし、最後に `mRL-4-1` から `mRL-4-3` で次セッションの kickoff 条件を閉じる。
