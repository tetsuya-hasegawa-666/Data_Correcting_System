# Adapter Integration Plan

## Purpose

isolated な `coreCamera` replacement を、downstream session assumptions を変えずに、凍結済み `shared-camera-session-adapter` seam を通じて後に `iSensorium` へ差し替える方法を定義する。

## Preserved Operation Mapping

- `startSession` -> `SharedCameraSessionAdapter.startSession`
- `stopSession` -> `SharedCameraSessionAdapter.stopSession`
- `findLatestSession` -> `SharedCameraSessionAdapter.findLatestSession`

## Adapter Rules

- 後の上流 integration が始まる前に outer operation set を広げない
- session artifact names、directory shape、monotonic timestamp basis を凍結したまま保つ
- `MRL-5` integration recommendation が受理されるまで cutover を reversible に保つ
- `MRL-7` upstream trial package が `READY` を返すまで、上流 wiring を開始しない
- readiness や cutover metadata のための追加 manifest field は許容するが、凍結済み parser-visible field を削除したり rename したりしない

## Cutover Steps

1. 維持対象の outer session operations を `shared-camera-session-adapter` のみに bind する
2. 最新 session manifest の `swapReadiness.status = READY` を swap の gate にする
3. 凍結済み `CameraX + ARCore` path を即時復元できるよう、replacement を reversible toggle の背後で段階配置する
4. 上流 wiring が変わっても、downstream parser と validation flow は凍結済み artifact contract のまま保つ

## Current Blocker Handling

- 最新 replacement session がまだ blocker を記録している場合、`MRL-4` は planning-ready だが integration-ready ではない
- 実機 session `session-20260315-043204` により、target-device evidence 不足 blocker は解消された

## Current Recommendation

- current decision: `RECOMMEND_GUARDED_UPSTREAM_TRIAL`
- rationale:
  - shared-camera continuity は凍結済み `ARCore ON` baseline を上回る
  - frame continuity は凍結済み `ARCore OFF` band 内に収まる
  - timestamp contract は monotonic のまま維持される
- guardrail: `shared-camera-session-adapter` を保ち、上流 trial は reversible cutover 前提でのみ検討する

## Current Upstream Trial Package

- current status: `READY`
- evidence session: `session-20260315-044922`
- included conditions:
  - required artifacts は current session contract と同一
  - required runtime permissions は `CAMERA`、`ACCESS_FINE_LOCATION`、`BLUETOOTH_SCAN`、`BLUETOOTH_CONNECT`
  - rollback rule は frozen `CameraX + ARCore` path を adapter seam の背後で即時復元できること
