# マイクリリースライン計画

## 目的

`MRL-7 guarded replacement runtime wiring` を、小さな差分と rollback 可能性を維持したまま閉じる。

## Micro Release Lines

| ID | 親 | 体験内容 | 検証方法 | 期待結果 | 失敗時の切分け | 次の分解対象 |
|---|---|---|---|---|---|---|
| mRL-7-1 | MRL-7 | `shared-camera-session-adapter` の裏へ actual replacement runtime を実装し、requested replacement route で `startSession` / `stopSession` / `findLatestSession` が通る | local code inspection、unit test、実機起動前の route resolution 確認 | new adapter が frozen route と別実装として動き、replacement route が fallback ではなく actual runtime を指す | runtime bootstrap failure / Camera2 + Shared Camera 初期化 failure / adapter binding mismatch | required artifact 出力と contract 維持 |
| mRL-7-2 | MRL-7 | replacement runtime で `session_manifest.json`、`video.mp4`、`imu.csv`、`gnss.csv`、`ble_scan.jsonl`、`arcore_pose.jsonl`、`video_frame_timestamps.csv`、`video_events.jsonl` を contract 維持で出力する | manifest / file contract inspection、parser regression、unit test | required artifact 群が replacement route でも同名・同ディレクトリ shape で出る | artifact omission / timestamp basis drift / parser-visible field drift | guarded activation と reversible fallback |
| mRL-7-3 | MRL-7 | requested route と active route が guarded condition 下で actual replacement runtime へ切り替わり、失敗時は frozen route に戻せる | route metadata 検証、fallback 条件確認、実行ログと manifest 確認 | `corecamera_shared_camera_trial` が actual runtime を指し、rollback 可能性が維持される | accidental cutover ambiguity / rollback 難化 / preview 再初期化 failure | `MRL-8` stabilization |

## 現在の順序

1. `mRL-7-1`
2. `mRL-7-2`
3. `mRL-7-3`

## 対象ガード

- 変更は `iSensorium/` 配下のみで行う。
- `coreCamera/` 側コードは参照のみとし、直接編集しない。
- default route は引き続き `frozen_camerax_arcore` を維持する。
- rollback anchor `rollback-isensorium-pre-upstream-trial-2026-03-15-001` を崩さない。
- long duration / thermal endurance は今回の plan set に含めない。
