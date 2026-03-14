# Documentation Snapshots

## Purpose

このディレクトリは、文書体系変更の価値検証と効果検証のために、その時点の `docs/` 全体を保存する専用レイヤである。

## Operation Rule

- 文書体系に意味のある変更を加えたら、`docs/history/` の方向履歴と対で 1 件保存する。
- 当面は保存量の増大を許容し、運用徹底を優先する。
- 保存対象は `docs/` 全体とする。
- スナップショットは検証用であり、source-of-truth ではない。

## File Naming

- ディレクトリ名: `YYYY-MM-DD-XXX`
- `XXX` は対応する方向履歴と同じ連番を使う

## Required Contents

各スナップショットディレクトリには最低限以下を含める。

- `docs/` 全体のコピー
- `manifest.md`

## Manifest Template

```md
# Snapshot Manifest

- date:
- paired_history:
- reason:
- scope: docs/
- note:
```
