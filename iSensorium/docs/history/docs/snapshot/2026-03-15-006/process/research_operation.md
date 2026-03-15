# Research Operation

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## Purpose

人の短周期プロンプト待ちで止まらず、Codex が長時間継続して研究、設計、分解、実装計画を進めるための運用ルールを定義する。

## Operating Stance

- 拡張には開く:
  新しい仮説、検証観点、分解粒度を既存の release と task へ追加できる。
- 修正には閉じる:
  進行中の意味を静かに差し替えず、change protocol を通して再定義する。

## Decomposition Chain

1. Human Goal
2. Market Release Line
3. Micro Release Line
4. Task
5. Evidence
6. Decision Or Change Request

## Task State

| State | Meaning |
|---|---|
| TODO | 未着手。開始条件待ちではない |
| DOING | 実装、調査、設計の実作業中 |
| TESTING | 実機または解析で検証中 |
| DONE | 成功条件を満たし、証跡が残った |
| BLOCKED | 外部制約で停止 |
| RETHINK | 仮説は進んだが release line 再分解が必要 |
| CHANGED | 変更要求により意味が差し替わった |

## Autonomous Cycle

1. 現在の Market / Micro Release を確認する。
2. 直近の成功条件と未充足条件を抽出する。
3. 次の最小体験単位へ再分解する。
4. 必要な実装、調査、設計、検証を task 化する。
5. 実行結果を証跡として残す。
6. 成功、失敗、仮説継続、release 見直しのいずれかを判定する。
7. `current_state.md` を更新する。

## Stop-Avoidance Rules

- 不確実点は仮説として切り出し、停止理由にしない。
- 巨大 task は「実機体験可能性」で再分解する。
- 失敗した場合も、次の切り分け行動を必ず残す。
- 変更候補は破棄せず保留キューに置く。

## Execution Window Contract

- 15 分前後の manual check は、継続作業を止めるための時間制限ではなく、観測結果を得るための最小検証窓とみなす。
- 継続作業の既定上限は 6 時間であり、15 分で自動停止する前提は置かない。
- 実行停止は次に限定する。
  - active Micro Release の成功条件または失敗条件が確定した。
  - 実際の blocker により、仮説前進や別 task への切替でも前進できない。
  - 外部依存が未充足で、`USER_PREPARATION.md` へ必要項目を追記しないと次へ進めない。
  - active dated plan set を完了し、次の dated plan set が未定義である。
- 歴史的な `reached`, `completed`, `freeze` 表記は、現在地確認なしに停止理由として使ってはならない。
- active line が完了したら、次を選ぶ順序は `next micro release`、`next market release`、`new dated plan set`、`change request handling` の順とする。

## External Dependency Logging Rule

- Codex だけで解消できない user action、外部 device access、手動準備は `USER_PREPARATION.md` に記録する
- `docs/process/UX_check_work_flow.md` には、その準備ノートを参照した上で評価手順だけを残す

## Evidence Contract

各 Micro Release には最低限以下の証跡を残す。

- 体験内容
- 実行条件
- 観測結果
- 成否判断
- 次アクション
- 関連する Market Release

## Current-State Update Contract

`current_state.md` は以下の項目を持つ。

- current market release
- current micro release
- completed evidence
- active risks
- pending change requests
- next validation point
