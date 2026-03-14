# Develop History Snapshot

## Purpose

このディレクトリは、実開発変更の検証用として、変更した文書だけを保存する専用スナップショットレイヤである。

## Policy

- 拡張的変更にオープン:
  新しい変更種別や対象文書を追加できる。
- 修正的変更にクローズ:
  保存対象を変更した文書に限定し、全体コピーへ拡散させない。

## Naming

- ディレクトリ名: `YYYY-MM-DD-XXX`

## Required Contents

- `manifest.md`
- 変更した文書のコピー
