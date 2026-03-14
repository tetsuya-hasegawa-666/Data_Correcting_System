# Develop History Summary

## 2026-03-14-001 development-history-framework

- target_behavior: develop 側 history 運用の基盤を作る
- intended_change: summary と snapshot の保管場所と記法を固定する
- background_reason: 実装履歴を再利用可能な形で残す必要があった
- change_summary: develop history 用の README と summary/snapshot の置き場を整えた
- affected_documents: `docs/index.md`, `docs/process/change_protocol.md`, `docs/process/research_operation.md`, `develop/history/summary/README.md`, `develop/history/snapshot/README.md`
- expected_effect: 以後の develop 更新が同じ entry discipline で残せる

## 2026-03-14-002 initial-release-line-plans

- target_behavior: release line plan の初期版を作る
- intended_change: market/micro release line を develop 配下へ配置する
- background_reason: docs の方針を実装計画に落とす器が必要だった
- change_summary: develop index と plan set の初期版を追加した
- affected_documents: `develop/index.md`, `develop/plans/2026-03-14-002/market_release_lines.md`, `develop/plans/2026-03-14-002/micro_release_lines.md`
- expected_effect: 以後の作業を release line 単位で進められる

## 2026-03-14-003 plan-set-and-summary-alignment

- target_behavior: plan set と history entry id を揃える
- intended_change: dated folder と summary entry を対応付ける
- background_reason: plan と履歴の追跡がずれていた
- change_summary: `YYYY-MM-DD-XXX` を plan/snapshot/summary の共通 id にした
- affected_documents: `develop/index.md`, `develop/history/summary/summary.md`, `develop/history/snapshot/README.md`
- expected_effect: 1 つの id で計画と履歴を追える

## 2026-03-14-004 idevelop-bootstrap-boundary

- target_behavior: companion project を分離する
- intended_change: `iDevelop/` を sibling project として扱う
- background_reason: `iSensorium` 本体の plan と混線し始めた
- change_summary: companion project の扱いを develop 側へ反映した
- affected_documents: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: `iSensorium` 作業だけに集中できる

## 2026-03-14-005 idevelop-rename-alignment

- target_behavior: companion project 名称を揃える
- intended_change: `iDevelop/` 名へ統一する
- background_reason: bootstrap 時の名称揺れが残っていた
- change_summary: develop 側記述の companion project 名を揃えた
- affected_documents: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: project 境界の記述がぶれなくなる

## 2026-03-14-006 release-line-validity-revision

- target_behavior: `iSensorium` の main release line を現実的な順序へ修正する
- intended_change: `MRL-0 -> MRL-1` を recording spine の最初の到達点として定義し直す
- background_reason: 旧 plan は初手から範囲が広過ぎた
- change_summary: plan set `2026-03-14-006` を追加し、GNSS/BLE/ARCore/parser/operational を後段 line へ並べ替えた
- affected_documents: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-006/market_release_lines.md`, `develop/plans/2026-03-14-006/micro_release_lines.md`
- expected_effect: 自律実装の順序が明確になった

## 2026-03-14-007 recording-spine-bootstrap

- target_behavior: `MRL-0` から `MRL-1` へ進める
- intended_change: recording session、session directory、video/IMU/timestamp を Android アプリへ実装する
- background_reason: 最低限の recording spine がまだ無かった
- change_summary: CameraX recorder、IMU logger、session manager、timestamp 保存を実装した
- affected_documents: `app/build.gradle.kts`, `app/src/main/AndroidManifest.xml`, `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `app/src/main/res/layout/activity_main.xml`, `app/src/main/res/values/strings.xml`, `USER_PREPARATION.md`, `develop/index.md`
- expected_effect: 実機で `mRL-0-1` から `mRL-1-2` まで進められる

## 2026-03-14-008 device-validation-and-short-harness

- target_behavior: `MRL-1` の実機確認を反復可能にする
- intended_change: Xperia 5 III で install/run を回し、短時間 harness を用意する
- background_reason: build 成功だけでは release line を進められない
- change_summary: adb install と短時間 session 3 連続確認、`run_short_session_harness.ps1` を追加した
- affected_documents: `develop/history/summary/summary.md`, `scripts/run_short_session_harness.ps1`, `USER_PREPARATION.md`
- expected_effect: `mRL-1-3` の確認と次段への移行が容易になる

## 2026-03-14-009 gnss-ble-expansion

- target_behavior: `MRL-2` の GNSS/BLE を進める
- intended_change: GNSS と BLE scan を同一 session に保存する
- background_reason: recording spine に追加 sensor を載せる必要があった
- change_summary: `gnss.csv` と `ble_scan.jsonl` を session contract へ追加した
- affected_documents: `app/build.gradle.kts`, `app/src/main/AndroidManifest.xml`, `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`
- expected_effect: `mRL-2-1` と `mRL-2-2` の device evidence が揃う

## 2026-03-14-010 arcore-integration-blocker

- target_behavior: `mRL-2-3` の blocker を切り出す
- intended_change: ARCore logger の失敗条件を再現して記録する
- background_reason: `MissingGlContextException` の原因を特定する必要があった
- change_summary: CameraX 単独経路では ARCore が GL context を持てないことを確認した
- affected_documents: `app/build.gradle.kts`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `docs/observability/current_state.md`
- expected_effect: 次の修正方針を GL thread 統合に絞れる

## 2026-03-14-011 arcore-gl-thread-fix

- target_behavior: `mRL-2-3` と `mRL-2-4` を完了する
- intended_change: ARCore `session.update()` を GL thread へ移す
- background_reason: blocker は GL context の喪失だった
- change_summary: `GLSurfaceView` を入れ、ARCore pose を full session に保存できるようにした
- affected_documents: `app/src/main/res/layout/activity_main.xml`, `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `docs/observability/current_state.md`, `develop/history/summary/summary.md`
- expected_effect: `MRL-2` 完了として parser work へ進める

## 2026-03-14-012 python-session-parser

- target_behavior: `mRL-3-1`, `mRL-3-2`, `mRL-3-3` を完了する
- intended_change: Python で session parse / validate を行う
- background_reason: 後段利用には parser contract が必要だった
- change_summary: `session_parser.py` と `validate_session.py` を追加し、実 session の report を生成した
- affected_documents: `python/session_parser.py`, `python/validate_session.py`, `python/README.md`, `tmp/session-20260314-111930/validation_report.json`, `docs/artifact/system_blueprint.md`, `docs/observability/current_state.md`, `develop/history/summary/summary.md`
- expected_effect: `MRL-3` 完了として operational validation へ進める

## 2026-03-14-013 operational-mrl4-validation

- target_behavior: `mRL-4-1`, `mRL-4-2`, `mRL-4-3` を完了する
- intended_change: continuous recording、offline、permission denied の 3 条件で session recovery を確認する
- background_reason: `MRL-4` は運用条件での回復性確認が出口条件だった
- change_summary: `session-20260314-115256`、`session-20260314-115526`、`session-20260314-115608` で必要条件を確認した
- affected_documents: `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `docs/observability/current_state.md`, `develop/history/summary/summary.md`
- expected_effect: `MRL-5` に必要な change tracking だけが残る

## 2026-03-14-014 mrl5-history-discipline

- target_behavior: `mRL-5-1`, `mRL-5-2`, `mRL-5-3` を完了する
- intended_change: line 変更の docs/develop 反映、snapshot discipline、次 action 定義を script と state 更新で固定する
- background_reason: `MRL-4` までは product/value 側の証跡が揃った一方、docs snapshot が履歴再帰コピーで壊れる運用欠陥があり `MRL-5` の出口条件を満たしていなかった
- change_summary: `scripts/create_history_snapshot.ps1` を追加し、`docs/process/change_protocol.md` に snapshot operation rule を追記し、`docs/observability/current_state.md` と `develop/index.md` を `MRL-5` reached へ更新し、`2026-03-14-013` snapshot を修復した
- affected_documents: `scripts/create_history_snapshot.ps1`, `docs/process/change_protocol.md`, `docs/observability/current_state.md`, `develop/index.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- expected_effect: active plan set 完了時の history 運用が破綻せず、次の plan set 開始時に同じ change discipline を再利用できる

## 2026-03-14-015 windows-beginner-evaluation-manual

- target_behavior: ユーザーが自分で実機体験を評価できる
- intended_change: Windows 初心者向けに install、record、session file 確認までを 1 本のマニュアルへまとめる
- background_reason: 現状は実装者前提の knowledge が多く、体験評価の入口が不足していた
- change_summary: 現在名 `docs/process/UX_check_work_flow.md` を評価導線として扱い、`README.md` から直接辿れるようにした
- affected_documents: `docs/process/UX_check_work_flow.md`, `README.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- expected_effect: ユーザーが chat なしでも app を試し、session 結果を見て評価できる
## 2026-03-14-016 ux-stability-fix

- target_behavior: 初回 UX フローを最後まで落ちずに完走できる
- intended_change: recording 中の重い書き込みと status 更新を減らし、ARCore stop race を GL thread 側へ寄せて stop 後クラッシュを防ぐ
- background_reason: ユーザー実地評価で 2-3 秒ごとの引っかかりと stop 後クラッシュが報告された
- change_summary: `RecordingCoordinator.kt` で high-frequency flush / reopen を削減し、video status UI を 1 秒間隔へ抑制し、ARCore close/pause/resume を GL thread queue へ移して `session-20260314-160134` で stop 後 refresh 成功まで確認した
- affected_documents: `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `docs/observability/current_state.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- expected_effect: recording 体感が改善し、stop 後に app が落ちず session file 一覧まで辿れる
## 2026-03-14-017 stable-beginner-path-and-refresh-rescan

- target_behavior: beginner manual test should show a visible latest-session refresh and a stable default recording route
- intended_change: make `Refresh` reload the latest session from storage and split recording into stable default mode (`video + IMU`) and optional extended beta mode (`GNSS / BLE / ARCore`)
- background_reason: current MRL-2 implementation favors all-sensor integration, but that is the wrong default for Windows-beginner UX evaluation
- change_summary: updated `MainActivity.kt`, `RecordingCoordinator.kt`, `activity_main.xml`, and `strings.xml` so stable mode is the default and advanced sensors require explicit opt-in
- affected_documents: `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `app/src/main/res/layout/activity_main.xml`, `app/src/main/res/values/strings.xml`, `docs/observability/current_state.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- expected_effect: `Start Session -> Stop Session -> Refresh` becomes understandable for non-developers, while advanced sensors remain available for later MRL-quality verification
## 2026-03-14-018 manual-sampling-controls-for-five-streams

- target_behavior: user can tune `video + IMU + GNSS + BLE + ARCore` at runtime and still keep BLE / ARCore in low-rate confirmation mode
- intended_change: add UI controls for stream intervals, keep GNSS in the base set, and throttle video timestamp / IMU / GNSS / BLE / ARCore logging through one shared recording config
- background_reason: stability should be tuned in the field, not forced through one compile-time recording profile
- change_summary: `MainActivity.kt`, `RecordingCoordinator.kt`, `activity_main.xml`, and `strings.xml` now support per-stream interval input and separate BLE / ARCore enable flags
- affected_documents: `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `app/src/main/res/layout/activity_main.xml`, `app/src/main/res/values/strings.xml`, `docs/observability/current_state.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- expected_effect: user can experiment with lower BLE / ARCore rates while preserving `video + IMU + GNSS` continuity on-device
## 2026-03-14-019 preview-first-recording-overlay

- target_behavior: preview stays visible, recording mode collapses to a stop-only overlay, and `Refresh` produces an obvious user-visible response
- intended_change: shrink the idle controls into a bottom card, add a recording overlay, and move ARCore from continuous rendering to interval-driven `requestRender`
- background_reason: the system can be technically recording while the preview appears stalled, but that is still a UX failure for field testing
- change_summary: updated `activity_main.xml`, `MainActivity.kt`, and `RecordingCoordinator.kt` to prioritize preview continuity and clearer operator feedback
- affected_documents: `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `app/src/main/res/layout/activity_main.xml`, `app/src/main/res/values/strings.xml`, `docs/observability/current_state.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- expected_effect: manual testers can judge capture quality from the live preview instead of guessing whether recording is still running
## 2026-03-14-020 camerax-mainline-freeze-and-corecamera-thread

- target_behavior: preserve restart-ready state after root-cause verification and move replacement camera work into an isolated thread
- intended_change: freeze the current `CameraX + ARCore` path inside `iSensorium`, record the verified failure evidence, and redirect next implementation work to sibling project `coreCamera/`
- background_reason: measured comparison sessions proved the fault sits in the camera path under `ARCore ON`, so continued patching of the current mainline is the wrong investment
- change_summary: updated current state with a freeze note and prepared a separate project for `Camera2 + Shared Camera` work without changing release-line governance
- affected_documents: `AGENTS.md`, `iSensorium/docs/observability/current_state.md`, `iSensorium/docs/history/docs/summary/summary.md`, `iSensorium/develop/history/summary/summary.md`
- expected_effect: the next session can restart from a stable decision point and begin replacement architecture work immediately

## 2026-03-15-001 continuation-stop-conflict-fix

- target_behavior: avoid premature stop around 15-minute observation windows and avoid treating historical completion as current stop permission
- intended_change: rewrite active develop/docs entry points so `15 min` is evidence only, `6h` is the default upper bound, and `2026-03-14-006` is read as a historical baseline instead of an active completed target
- background_reason: current source-of-truth still allowed two misreads: recursive snapshot trees slowed broad scans, and `MRL-5 reached` looked like immediate completion for new sessions
- change_summary: updated `docs/index.md`, `docs/process/change_protocol.md`, `docs/process/research_operation.md`, `docs/history` snapshot rules, `docs/observability/current_state.md`, `develop/index.md`, and local/workspace agent entry docs to close the continuation gap
- affected_documents: `AGENTS.md`, `README.md`, `iSensorium/AGENTS.md`, `iSensorium/docs/index.md`, `iSensorium/docs/process/change_protocol.md`, `iSensorium/docs/process/research_operation.md`, `iSensorium/docs/history/README.md`, `iSensorium/docs/history/docs/snapshot/README.md`, `iSensorium/docs/history/docs/summary/summary.md`, `iSensorium/docs/observability/current_state.md`, `iSensorium/develop/index.md`, `iSensorium/develop/history/summary/summary.md`, `iSensorium/scripts/create_history_snapshot.ps1`
- expected_effect: future sessions keep working until a true blocker or explicit plan exit, and default context loading will no longer recurse into snapshot storage
