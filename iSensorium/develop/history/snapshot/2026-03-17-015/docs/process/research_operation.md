# 研究運用

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 目的

人の短周期プロンプト待ちで止まらず、Codex が長時間継続して研究、設計、分解、実装計画を進めるための運用ルールを定義する。

## 運用姿勢

- 拡張には開く:
  新しい仮説、検証観点、分解粒度を既存の release と task へ追加できる。
- 修正には閉じる:
  進行中の意味を静かに差し替えず、change protocol を通して再定義する。

## 分解連鎖

1. Human Goal
2. Market Release Line
3. Micro Release Line
4. Task
5. Evidence
6. Decision Or Change Request

## task 状態

| 状態 | 意味 |
|---|---|
| TODO | 未着手。開始条件待ちではない |
| DOING | 実装、調査、設計の実作業中 |
| TESTING | 実機または解析で検証中 |
| DONE | 成功条件を満たし、証跡が残った |
| BLOCKED | 外部制約で停止 |
| RETHINK | 仮説は進んだが release line 再分解が必要 |
| CHANGED | 変更要求により意味が差し替わった |

## 自律サイクル

1. 現在の Market / Micro Release を確認する。
2. 直近の成功条件と未充足条件を抽出する。
3. 次の最小体験単位へ再分解する。
4. 必要な実装、調査、設計、検証を task 化する。
5. 実行結果を証跡として残す。
6. 成功、失敗、仮説継続、release 見直しのいずれかを判定する。
7. `current_state.md` を更新する。

## 実装原則

- Android 実装では MVC を崩さない
- View は日本語表示と入力導線に集中させる
- Controller は mode 選択、recording 制御、permission 分岐、fallback 判定を担う
- Model は session contract、mode contract、manifest、repository、error state を担う
- 人が実行しても迷わないスクリプトと挙動説明を優先する
- エラーハンドリングは recorder、session、preview、export、permission の各系統で分けて設計する

## 停止回避ルール

- 不確実点は仮説として切り出し、停止理由にしない。
- 巨大 task は「実機体験可能性」で再分解する。
- 失敗した場合も、次の切り分け行動を必ず残す。
- 変更候補は破棄せず保留キューに置く。

## 実行窓の契約

- 15 分前後の manual check は、継続作業を止めるための時間制限ではなく、観測結果を得るための最小検証窓とみなす。
- 継続作業の既定上限は 6 時間であり、15 分で自動停止する前提は置かない。
- 実行停止は次に限定する。
  - active Micro Release の成功条件または失敗条件が確定した。
  - 実際の blocker により、仮説前進や別 task への切替でも前進できない。
  - 外部依存が未充足で、`docs/process/UX_check_work_flow.md` の `利用者準備ノート` へ必要項目を追記しないと次へ進めない。
  - active dated plan set を完了し、次の dated plan set が未定義である。
- 歴史的な `reached`, `completed`, `freeze` 表記は、現在地確認なしに停止理由として使ってはならない。
- active line が完了したら、次を選ぶ順序は `next micro release`、`next market release`、`new dated plan set`、`change request handling` の順とする。

## 外部依存の記録ルール

- Codex だけで解消できない user action、外部 device access、手動準備は `docs/process/UX_check_work_flow.md` の `利用者準備ノート` に記録する
- 利用者準備ノートには、実際に必要になった事項だけを書く

## 証跡契約

各 Micro Release には最低限以下の証跡を残す。

- 体験内容
- 実行条件
- 観測結果
- 成否判断
- 次アクション
- 関連する Market Release
- 完了根拠が `Codex retest` か `user validation` か

## current_state 更新契約

`current_state.md` は以下の項目を持つ。

- current market release
- current micro release
- completed evidence
- active risks
- pending change requests
- next validation point
