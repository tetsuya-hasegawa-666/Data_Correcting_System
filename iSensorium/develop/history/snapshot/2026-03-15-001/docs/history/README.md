# Docs History Root

## Purpose

このディレクトリは `docs/` 内の source-of-truth 変更を追跡するための履歴親レイヤである。
`develop/` 側の履歴はここでは扱わず、`develop/history/` に分離する。

## Structural Rule

- `docs/history/docs/summary/summary.md` は docs 全体の短い要約履歴を置く。
- `docs/history/docs/snapshot/` は要約履歴に対応する `docs/` 全体スナップショットを置く。
- 実開発履歴は置かない。

## Policy

- 拡張にオープン:
  docs 側の新しい履歴観点や検証観点を追加できる。
- 修正にクローズ:
  既存履歴の意味を書き換えず、新しい履歴を追加して追跡する。

## Snapshot Boundary

- `docs/history/docs/snapshot/**` は履歴保管物であり、active docs ではない。
- source-of-truth の読込、探索、差分確認、要約対象の既定範囲から `docs/history/docs/snapshot/**` を除外する。
