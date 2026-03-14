# Docs History Snapshot

## Purpose

このディレクトリは、docs 変更の価値検証と効果検証のために、その時点の `docs/` 全体を保存する専用レイヤである。

## Operation Rule

- docs に意味のある変更を加えたら、`docs/history/docs/summary/summary.md` の対応エントリと対で 1 件保存する。
- 当面は保存量の増大を許容し、運用徹底を優先する。
- 保存対象は source-of-truth と運用規約として有効な `docs/` 全体とする。
- ただし `docs/history/docs/snapshot/**` は保存対象から除外する。
- スナップショットは検証用であり、source-of-truth ではない。

## Active-Use Boundary

- snapshot は active docs ではない。
- broad search、再帰読込、現行判断の既定対象からは `docs/history/docs/snapshot/**` を除外する。
- 過去 snapshot を読む必要がある場合も、まず `manifest.md` と対応 entry を確認し、必要な entry だけを開く。

## Naming

- ディレクトリ名: `YYYY-MM-DD-XXX`

## Required Contents

- `manifest.md`
- `docs/` 全体のコピー
