# Current State

## Current Position

- project: `coreCamera`
- status: integration recommendation まで実装済みで、build と実機で検証済み
- active plan set: `develop/plans/2026-03-14-001/`
- purpose: 後に `iSensorium` へ swap-in するための `Camera2 + ARCore Shared Camera` replacement-camera stack を構築する
- market release line: `MRL-5`
- completed micro releases: `mRL-0-1 -> mRL-0-2 -> mRL-0-3 -> mRL-1-1 -> mRL-1-2 -> mRL-2-1 -> mRL-2-2 -> mRL-2-3 -> mRL-3-1 -> mRL-3-2 -> mRL-3-3 -> mRL-4-1 -> mRL-4-2 -> mRL-5-1`
- next micro release order: `hold`

## Inherited Facts

- source project freeze point: `iSensorium` mainline は `CameraX + ARCore` で凍結されている
- reason: `ARCore ON` で multi-second camera-path stall が再現された一方、`IMU` は安定していた
- evidence sessions:
  - `session-20260314-194350` (`ARCore OFF`)
  - `session-20260314-194438` (`ARCore ON`)

## Working Rule

- この project は、release-line discipline、docs discipline、UX validation discipline を `iSensorium` から継承する
- 実装は `coreCamera/app/` 配下に isolated のまま維持する
- 現在の adapter seam は `shared-camera-session-adapter`
- ローカルでは `testDebugUnitTest` と `assembleDebug` で検証済み
- `.md` は、精度のために別言語が必要な場合を除き、日本語優先
- `video.mp4`、`video_frame_timestamps.csv`、`arcore_pose.jsonl`、および additive な `session_manifest.json` は、isolated shared-camera path から出力される
- `session_manifest.json` は、各 captured session について continuity comparison、timestamp contract validation、`swapReadiness` または blocker も記録する
- `session_manifest.json` は、維持すべき operation binding と reversible cutover gate を固定する `integrationAdapterPlan` metadata も持つ
- `session_manifest.json` は、target-device evidence に基づく `integrationRecommendation` も記録する

## Continuation Note

- この文書の restart / next validation 記載は handoff 用であり、15 分前後で停止する指示ではない
- active な market release line がある間は、user block または 6 時間上限に達しない限り、同一 session で exit criteria 到達まで継続する
- active な market release line が無い場合にのみ、次 session 開始順の記載を優先する

## Open Issues

- Xperia 5 III 実機 session `session-20260315-043204` で `swapReadiness.status = READY` と `integrationRecommendation.status = RECOMMEND_GUARDED_UPSTREAM_TRIAL` を確認済み
- non-camera 側 stream (`imu.csv`, `gnss.csv`, `ble_scan.jsonl`) は後続 release line まで placeholder のままであり、まだ上流 integration の判断材料にしてはいけない

## Restart Checklist

1. `coreCamera/docs/index.md` を読む
2. `coreCamera/USER_PREPARATION.md` を読む
3. `coreCamera/SESSION_HANDOVER.md` を読む
4. `coreCamera/develop/index.md` を読む
5. `MRL-5` 状態から `iSensorium/` を触らず継続する

## Next Validation Point

- 現時点の recommendation は guarded upstream trial であり、full sensor integration、長時間試験、上流統合にはまだ進まない
