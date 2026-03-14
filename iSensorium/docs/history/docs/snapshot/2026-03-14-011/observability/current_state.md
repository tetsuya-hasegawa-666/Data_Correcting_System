# Current State

## Current Position

- current market release: `MRL-2` reached on device
- current micro release: `MRL-3` not started, next is `mRL-3-1`
- thread purpose: `2026-03-14-006` を唯一の開始基準として、拡張センサを同一 session に統合し `MRL-3` 直前まで進める

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
- GNSS を同一 session に追加し、`session-20260314-110936` / `session-20260314-111055` で `gnss.csv` を保存した
- BLE scan を同一 session に追加し、`session-20260314-111055` で `ble_scan.jsonl` を保存した
- video + IMU + GNSS + BLE の複合 session を partial-failure なしで保存した
- GL thread 上へ ARCore 更新を移し、`session-20260314-111930` で `arcore_pose.jsonl` を保存した
- `session-20260314-111930` で video + IMU + GNSS + BLE + ARCore の複合 session を成立させ、`MRL-2` を完了した

## Active Risks

- CameraX frame timestamp と mp4 container の厳密対応は実機ログで追加確認が必要
- 現在の短時間安定確認は 6 秒級から 10 秒級であり、1 分級・数分級の観測は次段で必要
- `session_manifest.json` の最終 sample count 更新は finalize タイミング依存なので、後段 parser では実ファイル行数も併用確認したほうが安全
- snapshot 運用は当面肥大化を許容するため、将来アーカイブルールの追加が必要
- `MRL-3` では schema と join key の読み出し contract を明文化する必要がある

## Pending Change Requests

- none

## Next Validation Point

- `mRL-3-1` として Python で `session-20260314-111930` を読み込み、metadata と各 stream を再利用可能か確認する
