# UX Check Work Flow

## Purpose

この文書は、implementation 開始後に replacement-camera stack をどのように検証するかを定義する。

## Evaluation Focus

- recording を確実に start/stop できること
- capture 中も preview continuity が許容範囲にあること
- `ARCore ON` によって multi-second camera stall が再導入されないこと
- output artifacts が `iSensorium` と contract-compatible であり続けること

## First UX Route For Later Sessions

1. isolated prototype を build して install する
2. `ARCore OFF` で短い recording を 1 回開始する
3. `ARCore ON` で短い recording を 1 回開始する
4. preview continuity と保存された session artifacts を比較する
5. continuity metrics を凍結 baseline と比較する

## Expected Evidence

- session directory path
- file list
- continuity metrics
- 明示的な判断: 凍結 baseline より良いかどうか
