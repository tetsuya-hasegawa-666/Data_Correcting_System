# 研究運用

## 目的

manager context collection system を、長時間止まらず分解・設計・実装準備できるようにする。

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
| DOING | 実作業中 |
| TESTING | 検証中 |
| DONE | 完了 |
| BLOCKED | 外部依存で停止 |
| RETHINK | line 再分解が必要 |
| CHANGED | change request で差し替え |

## 自律サイクル

1. active MRL / mRL を確認する
2. source-of-truth と current state の差分を抽出する
3. edge / host / intelligence / data contract のどこを進めるか決める
4. 最小 task に分解する
5. evidence を残す
6. current state を更新する

