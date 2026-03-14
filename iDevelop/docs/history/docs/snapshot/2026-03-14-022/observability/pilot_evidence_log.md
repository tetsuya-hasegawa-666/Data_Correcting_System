# Pilot Evidence Log

## Purpose

`MRL-9` の pilot run で確認した証跡を 1 か所に残す。

## Current Evidence

### 2026-03-14 pilot-prep

- `npm test`: pass
- `npm run build`: pass
- `/api/dashboard/live-state`: `200`
- live code browse count: `22 codeTargets`
- refresh tracking: `fresh / refreshed / stale` の shell 表示と UI evidence を実装済み
- manual UX note: document/data/code の dummy 体験は user 確認済み

## Logging Rule

- pilot run ごとに date label を切って追記する
- failure は rollback trigger と一緒に記録する
- setup checklist を満たさない run は successful pilot とみなさない
