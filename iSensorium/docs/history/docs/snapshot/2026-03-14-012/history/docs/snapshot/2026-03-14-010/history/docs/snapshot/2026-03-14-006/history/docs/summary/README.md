# Docs History Summary Rules

## Purpose

`summary.md` を docs 側の単一要約履歴として扱う。
個別ファイル分割ではなく、1 文書内に時系列で追記する。

## Format

- 1 変更につき 1 エントリを追加する。
- 各エントリは `## YYYY-MM-DD-XXX <short-name>` で始める。
- 対応スナップショットは `docs/history/docs/snapshot/YYYY-MM-DD-XXX/` に置く。

## Policy

- 拡張にオープン:
  新しい観点は各エントリに項目追加できる。
- 修正にクローズ:
  過去エントリ本文は原則書き換えず、新しいエントリで補足する。
