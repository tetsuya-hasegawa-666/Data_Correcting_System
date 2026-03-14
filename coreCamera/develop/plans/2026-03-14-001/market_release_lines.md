# Market Release Lines

## MRL-0: Contract Capture

- 継承した contract と failure facts が文書化されている

## MRL-1: Shared-Camera Skeleton

- isolated な `Camera2 + Shared Camera` stack が初期化でき、制御された recording lifecycle に入れる

## MRL-2: Contract-Compatible Session Output

- replacement stack が現在の `iSensorium` と互換な session artifacts を出力する

## MRL-3: Continuity Validation

- `ARCore ON` 時の camera-path continuity が凍結 baseline より明確に良い

## MRL-4: Swap Readiness

- 後の `iSensorium` 統合に向けて adapter-ready である

## MRL-5: Integration Decision

- replacement を統合するか `ARCore` を断念するか決める

## MRL-6: Full Sensor Integration

- camera / ARCore に加えて `imu.csv`、`gnss.csv`、`ble_scan.jsonl` を replacement stack 内で実出力する

## MRL-7: Upstream Integration Preparation

- `shared-camera-session-adapter` を維持したまま、後の上流 trial に必要な integration package を固める

## Governance Constraint

- release-line planning、documentation update、UX validation は `iSensorium` と同じ粒度と精度で維持しなければならない
