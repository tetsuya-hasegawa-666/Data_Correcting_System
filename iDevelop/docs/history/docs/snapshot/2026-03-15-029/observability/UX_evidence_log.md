# UX Evidence Log

## Purpose

`iDevelop` 全体の UX check で確認した証跡を 1 か所に記録する。

## Current Evidence

### 2026-03-15 consultation-workspace-pilot

- `npm test`: pass (`29` tests)
- `npm run build`: pass
- document consultation: bundle selection、focus input、response panel、apply approve を確認
- data consultation: dataset selection、focus input、response panel を確認
- shared shell: prompt、bundle、summary、history、proposal action を確認
- code phase gate: `phase-gated-read-only` 表示と apply preview non-display を確認

### 2026-03-14 integrated-ux-prep

- `npm test`: pass
- `npm run build`: pass
- `/api/dashboard/live-state`: `200`
- live code browse count: `22 codeTargets`
- refresh tracking: `fresh / refreshed / stale` の shell 表示と UI evidence を確認済み
- manual UX note: document/data/code の dummy 体験は user 確認済み

## Logging Rule

- UX check ごとに date label を付けて追記する
- failure は rollback trigger と一緒に記録する
- 実施コマンド、表示結果、判断メモを最低 1 行ずつ残す
