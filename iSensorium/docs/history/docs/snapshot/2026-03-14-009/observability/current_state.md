# Current State

## Current Position

- current market release: `MRL-1` reached on device
- current micro release: `mRL-1-3` reached with short-session harness, next is `mRL-2-1`
- thread purpose: `2026-03-14-006` を唯一の開始基準として recording spine を実装し、実機証跡付きで `MRL-0 -> MRL-1` を通す

## Completed

- `2026-03-14-006` plan set を現行実装基準として固定した
- Android / Kotlin の debug build 可能なアプリ骨格を追加した
- recording session 開始 UI と session directory 自動生成を追加した
- 動画 + IMU を同一 session へ保存する最小 recorder spine を追加した
- video event / frame timestamp / IMU timestamp を同一 session に保存する基準を追加した
- `assembleDebug` 成功で静的 build 検証を完了した
- Xperia 5 III (`SO-53B`) 実機へ debug APK を install した
- adb 操作で `mRL-0-1` から `mRL-1-2` を実機で成立させた
- 6 秒級 session を 3 回連続完了し、`mRL-1-3` の短時間安定確認を追加した

## Active Risks

- CameraX frame timestamp と mp4 container の厳密対応は実機ログで追加確認が必要
- 現在の短時間安定確認は 6 秒級であり、1 分級・数分級の観測は次段で必要
- snapshot 運用は当面肥大化を許容するため、将来アーカイブルールの追加が必要
- `MRL-2` 以降は実測結果により再分解が必要になる可能性が高い

## Pending Change Requests

- none

## Next Validation Point

- `mRL-2-1` として GNSS を同一 session へ追加し、欠落時でも session が壊れないことを確認する
