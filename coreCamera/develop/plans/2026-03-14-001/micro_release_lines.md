# Micro Release Lines

Proceed in this order:

`mRL-0-1 -> mRL-0-2 -> mRL-0-3 -> mRL-1-1 -> mRL-1-2`

## MRL-0

- `mRL-0-1`: freeze inherited `iSensorium` in/out contract
- `mRL-0-2`: freeze reproducible `CameraX + ARCore` failure facts
- `mRL-0-3`: define swap adapter boundary

## MRL-1

- `mRL-1-1`: bootstrap isolated `Camera2 + Shared Camera` session
- `mRL-1-2`: prove start/stop lifecycle without touching `iSensorium`

## MRL-2

- `mRL-2-1`: emit `video.mp4` and `video_frame_timestamps.csv`
- `mRL-2-2`: emit `arcore_pose.jsonl`
- `mRL-2-3`: emit compatible `session_manifest.json`

## MRL-3

- `mRL-3-1`: compare `ARCore ON/OFF` continuity against frozen baseline
- `mRL-3-2`: verify timestamp contract continuity
- `mRL-3-3`: record swap-readiness or blocker

## MRL-4

- `mRL-4-1`: prepare later integration adapter plan
- `mRL-4-2`: define replacement cutover steps

## MRL-5

- `mRL-5-1`: integration recommendation

## Do-Not-Start Rule

- do not start with full multi-sensor optimization, long outdoor runs, or direct upstream integration
- start with controllable shared-camera bootstrap and proof of contract compatibility
