# Micro Release Lines

次の順で進める:

`mRL-0-1 -> mRL-0-2 -> mRL-0-3 -> mRL-1-1 -> mRL-1-2`

## MRL-0

- `mRL-0-1`: 継承した `iSensorium` in/out contract を凍結する
- `mRL-0-2`: 再現可能な `CameraX + ARCore` failure facts を凍結する
- `mRL-0-3`: swap adapter boundary を定義する

## MRL-1

- `mRL-1-1`: isolated な `Camera2 + Shared Camera` session を bootstrap する
- `mRL-1-2`: `iSensorium` に触れずに start/stop lifecycle を証明する

## MRL-2

- `mRL-2-1`: `video.mp4` と `video_frame_timestamps.csv` を出力する
- `mRL-2-2`: `arcore_pose.jsonl` を出力する
- `mRL-2-3`: 互換な `session_manifest.json` を出力する

## MRL-3

- `mRL-3-1`: 凍結 baseline に対して `ARCore ON/OFF` continuity を比較する
- `mRL-3-2`: timestamp contract continuity を検証する
- `mRL-3-3`: swap-readiness または blocker を記録する

## MRL-4

- `mRL-4-1`: 後の integration adapter plan を準備する
- `mRL-4-2`: replacement cutover step を定義する

## MRL-5

- `mRL-5-1`: integration recommendation

## Do-Not-Start Rule

- full multi-sensor optimization、長時間 outdoor run、直接の上流 integration から始めない
- 制御可能な shared-camera bootstrap と contract compatibility の証明から始める
