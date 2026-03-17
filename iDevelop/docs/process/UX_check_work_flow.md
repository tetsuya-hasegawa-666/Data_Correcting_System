# UX Check Work Flow

## Purpose

`iDevelop` の archive explorer、preview-centered retrieval、one-click download、operator-facing error handling を確認する。

## Check Items

1. archive explorer に top directory ごとの compact group が見える
2. archive を 1 件選ぶと preview に session contract と files が出る
3. download button が 1 回の操作で実行できる
4. source file 欠落時に warning が見える
5. archive 0 件時に empty / warning state が見える
6. 文言が日本語として自然である

## Codex Retest

- `npm test`
- `npm run build`

## Completion Rule

- 既定: `Codex retest` 通過
- 例外: ユーザーが実利用確認済みと明示した場合は `user validation` を採用可能
