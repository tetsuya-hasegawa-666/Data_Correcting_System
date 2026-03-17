# 研究運用

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 目的

lightweight multi-agent collaboration experiment を、人の短周期応答待ちで止めずに、Codex が docs、plan、seed data、実装準備へ継続分解できる運用ルールを定義する。

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
| TODO | 未着手 |
| DOING | 実装、調査、設計を進行中 |
| TESTING | 実行検証中 |
| DONE | 成功条件と証跡が揃った |
| BLOCKED | 外部依存で停止 |
| RETHINK | 仮説は進んだが line 再分解が必要 |
| CHANGED | change request により意味が差し替わった |

## 自律サイクル

1. active MRL / mRL を確認する。
2. source-of-truth と current state の差分を抽出する。
3. role、provider、orchestration、evaluation のどこを進めるか決める。
4. 最小実証単位へ task 化する。
5. evidence を残す。
6. 完了、継続、変更、保留のいずれかを判定する。
7. `current_state.md` を更新する。

## 実装原則

- role 定義と provider 差し替え点を混在させない。
- mock 実行は常に残し、本接続の回帰基準にする。
- CLI は最小引数で動く状態を保つ。
- round 数、役割数、出力 format は段階的に増やす。

## 停止回避ルール

- 不確実点は仮説として切り出し、停止理由にしない。
- 巨大 task は「1 brief で再現できる単位」に再分解する。
- 実 blocker が出たときだけ、`利用者準備ノート` に user-side action を追加する。

## 証跡契約

各 mRL では最低限次を残す。

- 体験内容または設計対象
- 実行条件
- 観測結果
- 成否判断
- 次アクション
- 関連する MRL
- completion evidence が `Codex retest` か `user validation` か
