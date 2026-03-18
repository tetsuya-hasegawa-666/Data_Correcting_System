# UX確認ワークフロー

## 利用者準備ノート

- この欄には Codex だけでは代行できない user action だけを書く
- 現在の外部準備:
  - なし

## 目的

manager が Android で断片メモを残し、PC 側で project 文脈付き record と KPI 候補まで確認できるかを検証する。
現行の検証対象は Xperia 5 III と Windows host `Tezy-GT37` の組み合わせとする。

## 最小確認手順

1. Xperia 5 III で一問一葉 UI を開く
2. テキストまたは音声で 1 件メモする
3. 必要なら写真を追加する
4. PC 近接状態へ入る
5. `Tezy-GT37` 側で YAML record が project 文脈付きで整理されたことを確認する
6. AI の次問と KPI 候補が表示されることを確認する

## 観察点

- 入力開始まで迷わないか
- 同期状態が透過的か
- project 文脈が保たれているか
- 次問が自然か
- KPI 候補に根拠があるか
- Android 側で `saved` と `synced` の差が直感的に分かるか
- PC 側で `inbox -> processing -> analyzed` の状態遷移が追いやすいか
