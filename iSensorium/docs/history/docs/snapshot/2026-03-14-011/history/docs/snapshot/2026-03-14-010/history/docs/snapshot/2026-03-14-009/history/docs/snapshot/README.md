# Docs History Snapshot

## Purpose

このディレクトリは、docs 変更の価値検証と効果検証のために、その時点の `docs/` 全体を保存する専用レイヤである。

## Operation Rule

- docs に意味のある変更を加えたら、`docs/history/docs/summary/summary.md` の対応エントリと対で 1 件保存する。
- 当面は保存量の増大を許容し、運用徹底を優先する。
- 保存対象は `docs/` 全体とする。
- スナップショットは検証用であり、source-of-truth ではない。

## Naming

- ディレクトリ名: `YYYY-MM-DD-XXX`

## Required Contents

- `manifest.md`
- `docs/` 全体のコピー
