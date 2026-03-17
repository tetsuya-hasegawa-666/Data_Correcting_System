# current state

## 現在の状態

- active plan set: `2026-03-17-016 manager context collection system foundation`
- latest completed plan set: `2026-03-17-015 capture mode, japanese UX, and resilient recording`
- active market release: `MRL-14 manager context collection foundation line`
- active micro release: `mRL-14-3 connectivity contract and local sync scaffold`
- latest completed market release: `MRL-13 robust recording and error handling line`
- latest completed micro release: `mRL-13-3 completion evidence rule close`
- current blocker: `none`

## このターンで反映したこと

- manager context collection system への project pivot を source-of-truth へ反映
- system architecture、YAML schema、sequence、UX flow を `system_blueprint.md` に追加
- `data/seed/manager_context/` に config、project context、entry sample、question sample、KPI candidate sample を追加
- `2026-03-17-016` を新しい active dated plan set として起票
- Xperia 5 III 実機で `com.isensorium.app` version `0.1.0` を再確認し、現行端末の実装が依然として `MRL-13` までの capture recording app であることを確認
- 実機で `session-20260317-203458` を guarded replacement route で開始・停止し、`session_manifest.json` を含む required artifact 8 点の保存を確認

## completed evidence

- evidence type: `source-of-truth update + Codex retest`
- detail:
  - docs artifact / process / observability の再定義
  - develop plan set と release line の起票
  - seed YAML の追加
  - 実機 package: `com.isensorium.app` version `0.1.0`
  - 実機 session: `session-20260317-203458`
  - 実機 artifact: `session_manifest.json`, `video.mp4`, `imu.csv`, `gnss.csv`, `ble_scan.jsonl`, `arcore_pose.jsonl`, `video_frame_timestamps.csv`, `video_events.jsonl`

## active risks

- MAC アドレスだけでは認証根拠として弱く、補助鍵管理の追加設計が必要
- Android 端末内 Whisper の電力制約が未確定
- host 側 review surface を `iSensorium` 内で持つか `iDevelop` へ分離するかは後続判断
- 実機の Android アプリはまだ quick memo / manager context UX を持たず、現在の runtime reality は legacy capture line に留まっている

## pending change requests

- なし

## next validation point

- `MRL-14` の残タスクとして、known device contract と Syncthing folder contract を code / config skeleton へ落とし込む
- `MRL-15` 着手前に、近接認証と peer key の二層設計を明確化する
- `MRL-16` 着手時に、現行 capture UI を quick memo UI へ置き換える前提で Android 実装を開始する
