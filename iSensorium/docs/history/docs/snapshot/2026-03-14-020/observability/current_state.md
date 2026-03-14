# Current State

## Current Position

- current market release: `MRL-5` reached
- current micro release: `2026-03-14-006` plan set completed
- thread purpose: `2026-03-14-006` を唯一の開始基準として recording spine から運用履歴 discipline まで到達する

## Completed

- `MRL-0`: 実機で recording session を開始し、1 sensor log を保存し、session directory を確認できる
- `MRL-1`: video + IMU を同一 session に保存し、共通 timestamp 基準で突合できる
- `MRL-2`: GNSS / BLE / ARCore pose を同一 session に載せ、partial failure 方針でも保存継続できる
- `MRL-3`: Python parser と validator で 1 session を読み、join key と metadata sufficiency を確認できる
- `MRL-4`: `session-20260314-115256` で連続記録、`session-20260314-115526` で offline local recovery、`session-20260314-115608` で permission denied 下の partial session を確認した
- `MRL-5`: `scripts/create_history_snapshot.ps1` を追加し、`docs/process/change_protocol.md` に snapshot operation rule を固定し、`2026-03-14-013` history snapshot を non-recursive copy で再生成した
- `session-20260314-160134` で UX 不具合修正後の再検証を行い、stop 後も app process が継続し、`Refresh` で最新 session の file 一覧が表示されることを確認した

## Active Risks

- CameraX frame timestamp と mp4 container timestamp の対応は長時間 run で再確認が要る
- parser は現状 single-session validation 中心で、multi-session batch までは未対応
- 連続記録の thermal / battery 傾向は 2 分級かつ AC powered 条件のため、屋外バッテリー単独条件では再検証が必要
- ARCore は GL thread stop race を修正したが、長時間連続実行での native stability は追加観察が必要

## Pending Change Requests

- none

## Next Validation Point

- 次の market release line は active plan set に未定義。新しい plan set を切る場合は、今回導入した snapshot operation を再利用しつつ、変更要求と summary / snapshot の整合を先に確認する
## 2026-03-14-017 Update Note

- `Refresh` now rescans the saved session directory and reloads the latest session from storage instead of only redrawing the in-memory object.
- beginner default is now stable mode: `video + IMU`; GNSS / BLE / ARCore moved behind an explicit beta switch so manual UX evaluation can focus on continuity first.
- next validation is a user-run manual pass confirming `Start Session -> Stop Session -> Refresh` updates the screen and that recording feels continuous in stable mode.
## 2026-03-14-018 Update Note

- beginner route is now `video + IMU + GNSS` by default, with `BLE` and `ARCore` enabled as low-rate confirmation streams by default.
- all five streams now expose manual sampling interval controls in the app UI: video timestamp log, IMU, GNSS, BLE, and ARCore.
- current validation completed: debug build succeeded and debug APK was reinstalled to Xperia 5 III for hands-on evaluation.
## 2026-03-14-019 Update Note

- preview-first UX restored: the camera preview remains full-screen while idle, and recording mode now hides the config panel and shows a stop-only overlay.
- ARCore rendering changed from continuous mode to interval-driven `requestRender`, matching the configured ARCore sampling interval to reduce preview stalls during recording.
- `Refresh` now shows visible completion feedback even when the newest session is unchanged, so manual testers can tell the action actually fired.
## 2026-03-14-020 Freeze Note

- mainline recording architecture is frozen at `CameraX + ARCore` pending replacement study.
- paired verification sessions:
  - `session-20260314-194350` (`ARCore OFF`)
  - `session-20260314-194438` (`ARCore ON`)
- measured result:
  - `ARCore OFF`: `video_frame_timestamps.csv` max gap `139.6 ms`
  - `ARCore ON`: `video_frame_timestamps.csv` max gap `2634 ms`
  - `IMU` stayed stable in both runs with max gap about `30-47 ms`
- working conclusion: the blocking fault is in the camera path, not the IMU path.
- next implementation thread moves to sibling project `coreCamera/` for isolated `Camera2 + Shared Camera` development.
