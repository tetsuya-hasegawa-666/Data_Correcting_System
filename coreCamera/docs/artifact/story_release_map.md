# Story Release Map

## Story

stable な video recording と共存でき、かつ既存の `iSensorium` session contract を維持できる場合にのみ `ARCore` を残す replacement camera subsystem を構築する。

## Release Mapping

- `MRL-0`: 現在の contract と failure evidence を継承して凍結する
- `MRL-1`: `Camera2 + Shared Camera` を bootstrap する
- `MRL-2`: contract-compatible な session artifacts を出力する
- `MRL-3`: 凍結 baseline に対して continuity を検証する
- `MRL-4`: adapter-ready な swap plan と reversible な cutover step を準備する
- `MRL-5`: target-device evidence に基づいて guarded upstream trial を推奨するか、replacement を保留するか決定する
- `MRL-6`: `imu.csv`、`gnss.csv`、`ble_scan.jsonl` を replacement stack 内で実出力する
- `MRL-7`: guarded upstream trial に必要な package 条件を adapter seam 上で固定する
