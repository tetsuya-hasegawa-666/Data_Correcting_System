# Current State

## Current Position

- project: `coreCamera`
- status: full sensor integration と upstream trial package まで実装済みで、build と実機で検証済み
- active plan set: `develop/plans/2026-03-14-001/`
- purpose: 後に `iSensorium` へ swap-in するための `Camera2 + ARCore Shared Camera` replacement-camera stack を構築する
- market release line: `MRL-7`
- completed micro releases: `mRL-0-1 -> mRL-0-2 -> mRL-0-3 -> mRL-1-1 -> mRL-1-2 -> mRL-2-1 -> mRL-2-2 -> mRL-2-3 -> mRL-3-1 -> mRL-3-2 -> mRL-3-3 -> mRL-4-1 -> mRL-4-2 -> mRL-5-1 -> mRL-6-1 -> mRL-6-2 -> mRL-6-3 -> mRL-7-1`
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
- `session_manifest.json` は、guarded upstream trial 条件を `upstreamTrialPackage` として記録する

## Continuation Note

- この文書の restart / next validation 記載は handoff 用であり、15 分前後で停止する指示ではない
- active な market release line がある間は、user block または 6 時間上限に達しない限り、同一 session で exit criteria 到達まで継続する
- active な market release line が無い場合にのみ、次 session 開始順の記載を優先する

## Open Issues

- Xperia 5 III 実機 session `session-20260315-043204` で `swapReadiness.status = READY` と `integrationRecommendation.status = RECOMMEND_GUARDED_UPSTREAM_TRIAL` を確認済み
- Xperia 5 III 実機 session `session-20260315-044922` で `imu.csv`、`gnss.csv`、`ble_scan.jsonl` の実出力と `upstreamTrialPackage.status = READY` を確認済み

## Restart Checklist

1. `coreCamera/docs/index.md` を読む
2. `coreCamera/docs/process/UX_check_work_flow.md` を読む
3. `coreCamera/SESSION_HANDOVER.md` を読む
4. `coreCamera/develop/index.md` を読む
5. `MRL-7` 状態から `iSensorium/` を触らず継続する

## Next Validation Point

- guarded upstream trial 用 package は `coreCamera/` 側で準備完了
- 長時間試験は、主に発熱や熱制限を含む長時間連続動作の耐久確認として後段へ送る
- 実際の上流 trial をさらに進めるには、workspace rule 上 `iSensorium/` 側の変更許可が新たに必要
## Rollback Anchor

- `iSensorium/` を guarded upstream trial 前の実装状態へ戻す基準点として、Git tag `rollback-isensorium-pre-upstream-trial-2026-03-15-001` を固定した
- anchor commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`
- implementation-only size は約 `4.54 MiB`、生成物込みでは約 `82.33 MiB` のため、rollback は archive ではなく tag を source-of-truth とする
- 操作手順は `coreCamera/docs/process/UX_check_work_flow.md` と `iSensorium/docs/process/UX_check_work_flow.md` の先頭ハイライトを参照する
