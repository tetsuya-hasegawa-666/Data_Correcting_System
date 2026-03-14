# Project Contract

## Purpose

この project は、downstream assumptions を変えずに現在の `iSensorium` camera 実装を置き換えるために存在する。

## Required Inputs

- start/stop recording lifecycle
- isolated lifecycle control 用の `TextureView` preview surface
- `Camera2` camera frames
- ARCore shared camera session
- 後で `iSensorium` に合わせる optional sensor streams

## Required Outputs

- session 指向の file tree
- `iSensorium` と互換な file name
- monotonic alignment に基づく timestamp contract
- file-name compatibility を壊さない範囲で、追加の validation/readiness fields を含む parser-compatible manifest
- target-device evidence に基づく integration recommendation
- `shared-camera-session-adapter` という名前の adapter seam

## Frozen Compatibility Boundary

- outer session operations として `startSession`、`stopSession`、`findLatestSession` を維持する
- session file-name set を維持する:
  - `session_manifest.json`
  - `video.mp4`
  - `imu.csv`
  - `gnss.csv`
  - `ble_scan.jsonl`
  - `arcore_pose.jsonl`
  - `video_frame_timestamps.csv`
  - `video_events.jsonl`
- timestamp alignment は `elapsedRealtimeNanos` と per-session monotonic origin を基底に維持する
- file がまだ埋まっていなくても、name と manifest semantics が凍結されたままである限り、`MRL-1` では placeholder 作成を許容する

## Explicit Non-Goals In The Isolated Phase

- `iSensorium/app/` を編集すること
- `iSensorium` 内の end-user UX を再設計すること
- 既存の release-line governance を変えること
- `MRL-5` 前に 2 本目の adapter seam を導入すること
