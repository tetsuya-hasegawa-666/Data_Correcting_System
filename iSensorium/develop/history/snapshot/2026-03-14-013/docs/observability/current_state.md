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

## Active Risks

- CameraX frame timestamp と mp4 container timestamp の対応は長時間 run で再確認が要る
- parser は現状 single-session validation 中心で、multi-session batch までは未対応
- 連続記録の thermal / battery 傾向は 2 分級かつ AC powered 条件のため、屋外バッテリー単独条件では再検証が必要

## Pending Change Requests

- none

## Next Validation Point

- 次の market release line は active plan set に未定義。新しい plan set を切る場合は、今回導入した snapshot operation を再利用しつつ、変更要求と summary / snapshot の整合を先に確認する
