# System Blueprint

## Frozen Fact From iSensorium

- `ARCore OFF`: camera timestamp max gap は約 `139.6 ms`
- `ARCore ON`: camera timestamp max gap は約 `2634 ms`
- `IMU` は両 run で安定していた
- したがって blocking defect は camera path 側にある

## Target Architecture

- `Camera2`
- `ARCore Session.Feature.SHARED_CAMERA`
- 現在の `iSensorium` session in/out contract を維持する adapter boundary
- `coreCamera/app/` 配下の isolated Android app
- controller の entrypoint: `SharedCameraSessionController`
- swap seam: `SharedCameraSessionAdapter`

## Preserved Interface Shape

- recording を開始する
- recording を停止する
- session directory を発見する
- manifest を出力する
- 現在の `iSensorium` naming set に従って各 stream file を出力する

## Implemented Validation Path

- `MainActivity` は isolated な `TextureView` preview と start/stop control を持つ
- `SharedCameraSessionController` は `Session.Feature.SHARED_CAMERA` を初期化し、ARCore callback を巻いた back camera を開き、ARCore と recording surfaces を含む制御可能な `CameraCaptureSession` を作る
- `CpuImageVideoRecorder` は shared-camera capture graph に `ImageReader` surface を追加して実際の `video.mp4` を出力し、`video_frame_timestamps.csv` は `TotalCaptureResult` から追記する
- `ArCorePoseSampler` は offscreen GL context を維持し、outer adapter boundary を変えずに `Session.update()` から実際の `arcore_pose.jsonl` sample を出力する
- `SessionContinuityAnalyzer` は凍結済み `ARCore ON/OFF` baselines に対して camera-gap continuity を評価し、monotonic timestamp continuity を検証し、`swapReadiness` または blocker を直接 `session_manifest.json` に記録する
- `IntegrationRecommendationPlanner` は target-device evidence と recorder finalization 状態から guarded upstream trial 可否を決め、`integrationRecommendation` を manifest に記録する
- `SharedCameraSessionController` は intentional stop と runtime failure を分離し、停止時 disconnect を error として上書きしない
- start/stop lifecycle、continuity-analysis logic、integration recommendation は unit test と debug assembly により build 時に検証され、target hardware evidence は Xperia 5 III 実機 session `session-20260315-043204` で確認済み

## Replacement Boundary

- 実装開始は `coreCamera/` のみ
- output contract は次と互換を保つ:
  - `video.mp4`
  - `imu.csv`
  - `gnss.csv`
  - `ble_scan.jsonl`
  - `arcore_pose.jsonl`
  - `video_frame_timestamps.csv`
  - `video_events.jsonl`
  - `session_manifest.json`

## Integration Rule

- continuity validation が完了するまで、`iSensorium/` 内で直接置換しない
- swap-in は全面的な上流 rewrite ではなく adapter seam 経由で可能でなければならない
- isolated 開発では内部 abstraction を自由に定義してよいが、outer contract は互換を維持する

## Implemented MRL-4 Swap Plan

- `IntegrationCutoverPlanner` は、後で `startSession` / `stopSession` / `findLatestSession` を `SharedCameraSessionAdapter` に結び付ける binding を凍結する
- 各 session manifest は、seam id、adapter plan version、cutover steps、blocker-aware gate state を含む `integrationAdapterPlan` metadata を持つ
- project-level の cutover source-of-truth は `docs/artifact/adapter_integration_plan.md` に置く

## Implemented MRL-5 Integration Decision

- target hardware: Xperia 5 III (`SO-53B`)
- confirmed evidence session: `session-20260315-043204`
- decision output: `integrationRecommendation.status = RECOMMEND_GUARDED_UPSTREAM_TRIAL`
- guardrail: `shared-camera-session-adapter` を維持し、full sensor integration、長時間試験、上流統合にはまだ進まない
