# Micro Release Line Plan

## Purpose

`2026-03-15-005` の market release lines を、BDD/TDD で実装可能な micro release に分解する。

## Micro Release Lines

### MRL-10 Interaction Contract Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-10-1 | consultation scenario を BDD で固定する | user story、touchpoint、bundle、response、approval state が artifact に定義される |
| mRL-10-2 | consultation contract を system blueprint と contract に反映する | module boundary、state boundary、safety boundary が矛盾なく更新される |
| mRL-10-3 | 最初の TDD task set を定義する | document consultation の failing test 順序が定義される |

### MRL-11 Document Consultation Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-11-1 | 文書選択 bundle の failing test を作る | 複数文書選択と選択状態表示の赤テストがある |
| mRL-11-2 | 文書相談 input と response panel を実装する | prompt input、response area、根拠文書表示が動く |
| mRL-11-3 | 文書 consultation UX を整える | 文書 workspace の UX check と履歴が更新される |

### MRL-12 Data Consultation Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-12-1 | データ bundle と観点指定の failing test を作る | dataset selection、question focus、response schema の赤テストがある |
| mRL-12-2 | データ consultation UI を実装する | dataset 選択、question input、summary / anomaly / next action 応答が出る |
| mRL-12-3 | data UX check を更新する | data consultation の UX check と current state が整う |

### MRL-13 Shared Conversation Shell Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-13-1 | shared session state の failing test を作る | active workspace をまたいで bundle と response を保持できる赤テストがある |
| mRL-13-2 | conversation shell を実装する | shared prompt、history、current bundle、response summary が見える |
| mRL-13-3 | shell evidence を整える | UX flow、state、history が共通 shell 前提へ更新される |

### MRL-14 Code Consultation Phase-Gate Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-14-1 | code consultation gate を定義する | risk、scope、no-run/no-attach 境界が明文化される |
| mRL-14-2 | read-only code selection を consultation shell へ接続する | code target を bundle に含められる |
| mRL-14-3 | phase gate 判定を閉じる | UX flow と state に code gate の結論が残る |

### MRL-15 Proposal-To-Action Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-15-1 | proposal action state の failing test を作る | keep / discard / task 化の state transition が赤テスト化される |
| mRL-15-2 | proposal action UI を実装する | 応答ごとに action 選択と結果表示ができる |
| mRL-15-3 | action evidence を残す | action history と UX flow が更新される |

### MRL-16 Safe Apply Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-16-1 | approval-first apply contract を定義する | apply request、preview、approve/cancel の state が定義される |
| mRL-16-2 | document/data の限定 apply を実装する | preview と approval を経た apply が通る |
| mRL-16-3 | rollback と evidence を整える | failure 時の rollback と evidence が更新される |

### MRL-17 Pilot Interaction Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-17-1 | end-to-end consultation UX check を整備する | 選ぶ -> 相談する -> 判断する -> 記録する手順が UX flow に反映される |
| mRL-17-2 | pilot evidence を集約する | consultation pilot evidence が observability に残る |
| mRL-17-3 | completed handoff を作る | current state、history、next plan point が completed 状態になる |
