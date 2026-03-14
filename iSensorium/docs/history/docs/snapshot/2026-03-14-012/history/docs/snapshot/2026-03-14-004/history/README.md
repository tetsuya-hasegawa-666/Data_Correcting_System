# History Root

## Purpose

このディレクトリは履歴管理の親レイヤである。
履歴は必ず次の二系統に分離する。

- `docs/history/docs/`
  文書体系全体の履歴
- `docs/history/develop/`
  実開発変更の履歴

## Structural Rule

- `summary/` は短い要約履歴を置く。
- `snapshot/` は要約履歴に対応する保存物を置く。
- 文書体系履歴と実開発履歴を混在させない。

## Policy

- 拡張にオープン:
  新しい履歴観点や検証観点は、`docs` または `develop` のどちらか適切な系統へ追加できる。
- 修正にクローズ:
  既存履歴の意味を書き換えず、新しい履歴を追加して追跡する。
