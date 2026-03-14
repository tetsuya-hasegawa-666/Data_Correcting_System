# Rollback Note

## Purpose

pilot run 中に問題が起きたときの切り戻し判断を固定する。

## Rollback Triggers

- manifest path が誤っていて別 project を読んでいる
- read-only であるべき画面に編集導線が出る
- `再読み込み` で error banner が継続し、live source を再取得できない
- `npm test` または `npm run build` が失敗する

## Rollback Actions

1. `Ctrl + C` で dashboard を停止する
2. `config/project-manifest.json` を最後に成功した project 設定へ戻す
3. `npm test` と `npm run build` を再実行する
4. pilot failure を [pilot_evidence_log.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\observability\pilot_evidence_log.md) に記録する
5. `current_state.md` に active risk を残して次セッションへ handoff する

## Non-Rollback Cases

- refresh evidence が `unchanged` だっただけ
- stale 表示に切り替わっただけ
- seed fallback が想定どおりに働いただけ
