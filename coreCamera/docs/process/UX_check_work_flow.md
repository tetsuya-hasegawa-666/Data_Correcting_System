# UX Check Work Flow

> [!IMPORTANT]
> **Rollback Notice: upstream trial 前に `iSensorium/` を戻せる状態を先に固定済み**
> 理由: `coreCamera` で `MRL-7` まで到達し、次段では `iSensorium/` への guarded upstream trial があり得るためです。`iSensorium/` の implementation-only snapshot は、生成物を除外した軽量 anchor として `rollback-isensorium-pre-upstream-trial-2026-03-15-001` に固定しました。実装相当は約 `4.54 MiB`、生成物込みだと約 `82.33 MiB` なので、rollback 基準は tag を source-of-truth とします。
>
> **Rollback 指示方法**
>
> ```powershell
> cd C:\Users\tetsuya\playground\Data_Correcting_System\iSensorium
> git fetch origin --tags
> git switch <戻したいブランチ名>
> git reset --hard rollback-isensorium-pre-upstream-trial-2026-03-15-001
> git clean -fd
> ```
>
> **remote 側も戻す必要がある場合**
>
> ```powershell
> git push --force-with-lease origin <戻したいブランチ名>
> ```
>
> anchor commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`

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
