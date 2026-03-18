# 研究運用

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 目的

Excel Online Shadow Assistant prototype を、人の短周期応答待ちで止めずに、Codex が docs、plan、実装、検証へ継続分解できる運用ルールを定義する。

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
3. Range Assist、Paste Assist、Graph Assist、Intent Assist のどこを進めるか決める。
4. 最小実証単位へ task 化する。
5. evidence を残す。
6. 完了、継続、変更、保留のいずれかを判定する。
7. `current_state.md` を更新する。

## 実装原則

- local server と UI を dependency-free に近い形で保つ。
- 破壊的自動実行ではなく preview と候補提示を優先する。
- Excel Online の名前ボックスや貼り付け操作を前提とした、人手介在の workflow をまず成立させる。
- prototype scope で一通り触れる機能を揃え、その後に自動化率を上げる。

## 証跡契約

- ロジックテスト
- CLI サブコマンドの実行結果
- local server health と index 応答
- UX 文書と active release line の整合
