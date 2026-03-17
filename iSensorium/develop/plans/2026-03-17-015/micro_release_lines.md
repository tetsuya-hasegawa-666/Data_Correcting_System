# 2026-03-17-015 micro release lines

## 目的

このファイルを `iSensorium` の mRL 正本とする。初版 `mRL-0-1` から最新完了分までを累積記載し、MRL ごとの分解と完了状態を一括レビューできる状態を維持する。

## 運用ルール

- 新しい mRL を追加したら、このファイルへ必ず追記する。
- 過去 dated plan set の `micro_release_lines.md` は履歴として残すが、主参照はこのファイルとする。
- 各 mRL は `parent` `status` `initial plan set` `latest touch` `result` を最低限持つ。

## MRL-0

### mRL-0-1 session bootstrap confirmation

- parent: `MRL-0`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: recording session を開始し、session id が起動直後に得られる状態を確立した。

### mRL-0-2 single sensor log capture

- parent: `MRL-0`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: 動画または 1 センサーを 1 ログとして保存できる最小 recording を確立した。

### mRL-0-3 session directory contract

- parent: `MRL-0`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: session directory の命名、ファイル配置、最小 manifest の契約を固定した。

## MRL-1

### mRL-1-1 video and imu co-recording

- parent: `MRL-1`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: video と IMU を同一 session で記録できるようにした。

### mRL-1-2 timestamp basis alignment

- parent: `MRL-1`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: monotonic time と frame time の対応を固定し、後段 join の基準を作った。

### mRL-1-3 short stability harness

- parent: `MRL-1`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: 数分単位の recording を回し、spine の短時間安定性を確認できるようにした。

### mRL-1-4 recording spine close

- parent: `MRL-1`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: timestamp と video basis を含む recording spine を完了状態へ閉じた。

## MRL-2

### mRL-2-1 gnss integration

- parent: `MRL-2`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: GNSS を session に統合し、利用不能時の fallback 観点を分離した。

### mRL-2-2 ble integration

- parent: `MRL-2`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: BLE scan を recording session に統合し、scan policy の下地を作った。

### mRL-2-3 arcore integration

- parent: `MRL-2`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: ARCore pose を recording session に統合し、tracking state を残せるようにした。

### mRL-2-4 sensor prioritization basis

- parent: `MRL-2`
- status: `completed`
- initial plan set: `2026-03-15-004`
- latest touch: `2026-03-17-015`
- result: 複数センサー同時利用時の resource contention と prioritization の観点を整理した。

## MRL-3

### mRL-3-1 parser contract

- parent: `MRL-3`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: Python parser で 1 session を読める contract を確立した。

### mRL-3-2 join key design

- parent: `MRL-3`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: センサーと動画の join key を定義し、分析利用の整合を作った。

### mRL-3-3 export metadata basis

- parent: `MRL-3`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: 3DGS などの後段利用を見据えた metadata basis を整理した。

## MRL-4

### mRL-4-1 battery and load check

- parent: `MRL-4`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: battery と load 観点を運用観点として整理した。

### mRL-4-2 offline local persistence

- parent: `MRL-4`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: offline でも local 保存で session を維持する観点を固定した。

### mRL-4-3 partial failure tolerance

- parent: `MRL-4`
- status: `completed`
- initial plan set: `2026-03-14-002`
- latest touch: `2026-03-17-015`
- result: 一部 failure 時に partial session を扱う考え方を定義した。

## MRL-5

### mRL-5-1 docs develop alignment

- parent: `MRL-5`
- status: `completed`
- initial plan set: `2026-03-14-006`
- latest touch: `2026-03-17-015`
- result: docs と develop の更新規律を明文化した。

### mRL-5-2 snapshot history discipline

- parent: `MRL-5`
- status: `completed`
- initial plan set: `2026-03-14-006`
- latest touch: `2026-03-17-015`
- result: snapshot と history の運用規律を固定した。

### mRL-5-3 autonomous cycle basis

- parent: `MRL-5`
- status: `completed`
- initial plan set: `2026-03-14-006`
- latest touch: `2026-03-17-015`
- result: 次の作業を自律継続できる develop 運用基盤を整えた。

## MRL-6

### mRL-6-1 guarded seam introduction

- parent: `MRL-6`
- status: `completed`
- initial plan set: `2026-03-15-004`
- latest touch: `2026-03-17-015`
- result: `shared-camera-session-adapter` seam を public call surface へ導入した。

### mRL-6-2 additive guarded metadata

- parent: `MRL-6`
- status: `completed`
- initial plan set: `2026-03-15-004`
- latest touch: `2026-03-17-015`
- result: frozen session contract を壊さない additive metadata を導入した。

### mRL-6-3 reversible cutover gate

- parent: `MRL-6`
- status: `completed`
- initial plan set: `2026-03-15-004`
- latest touch: `2026-03-17-015`
- result: guarded な reversible cutover gate を定義した。

## MRL-7

### mRL-7-1 actual replacement runtime wiring

- parent: `MRL-7`
- status: `completed`
- initial plan set: `2026-03-15-009`
- latest touch: `2026-03-17-015`
- result: actual replacement runtime を guarded route として配線した。

### mRL-7-2 required artifact contract

- parent: `MRL-7`
- status: `completed`
- initial plan set: `2026-03-15-009`
- latest touch: `2026-03-17-015`
- result: replacement route でも required artifact 8 点と manifest shape を維持した。

### mRL-7-3 guarded activation and fallback

- parent: `MRL-7`
- status: `completed`
- initial plan set: `2026-03-15-009`
- latest touch: `2026-03-17-015`
- result: requested route と active route を分離し、fallback を frozen route に保った。

## MRL-8

### mRL-8-1 lifecycle stabilization

- parent: `MRL-8`
- status: `completed`
- initial plan set: `2026-03-15-011`
- latest touch: `2026-03-17-015`
- result: start / stop / failure / shutdown の lifecycle 安定化を行った。

### mRL-8-2 refresh and status visibility

- parent: `MRL-8`
- status: `completed`
- initial plan set: `2026-03-15-011`
- latest touch: `2026-03-17-015`
- result: `Refresh` と latest session 表示で guarded route 情報を見やすくした。

### mRL-8-3 rollback drill close

- parent: `MRL-8`
- status: `completed`
- initial plan set: `2026-03-15-011`
- latest touch: `2026-03-17-015`
- result: rollback drill、parser regression、build を通して stabilization を閉じた。

## MRL-9

### mRL-9-1 ux check workflow update

- parent: `MRL-9`
- status: `completed`
- initial plan set: `2026-03-15-011`
- latest touch: `2026-03-17-015`
- result: `UX_check_work_flow.md` に guarded replacement route の確認導線を追加した。

### mRL-9-2 user ux ready state alignment

- parent: `MRL-9`
- status: `completed`
- initial plan set: `2026-03-15-011`
- latest touch: `2026-03-17-015`
- result: current state、release map、develop を user UX check ready 状態へ揃えた。

### mRL-9-3 release handoff close

- parent: `MRL-9`
- status: `completed`
- initial plan set: `2026-03-15-011`
- latest touch: `2026-03-17-015`
- result: UX check 実行と release handoff のための判断材料を整えた。

## MRL-10

### mRL-10-1 recorder side preview tap

- parent: `MRL-10`
- status: `completed`
- initial plan set: `2026-03-15-014`
- latest touch: `2026-03-17-015`
- result: recorder から latest-only preview bus を取り出せるようにした。

### mRL-10-2 guarded ui preview renderer

- parent: `MRL-10`
- status: `completed`
- initial plan set: `2026-03-15-014`
- latest touch: `2026-03-17-015`
- result: guarded replacement route recording 中に `640x480` / `5fps` の preview を UI 表示できるようにした。

### mRL-10-3 device validation and documentation close

- parent: `MRL-10`
- status: `completed`
- initial plan set: `2026-03-15-014`
- latest touch: `2026-03-17-015`
- result: Xperia 5 III で preview MVP を検証し、docs / develop / history を完了状態へ更新した。

## MRL-11

### mRL-11-1 standard and pocket mode definition

- parent: `MRL-11`
- status: `completed`
- initial plan set: `2026-03-17-015`
- latest touch: `2026-03-17-015`
- result: `RecordingMode` に `standard_handheld` と `pocket_recording` を定義した。

### mRL-11-2 mode metadata and export contract

- parent: `MRL-11`
- status: `completed`
- initial plan set: `2026-03-17-015`
- latest touch: `2026-03-17-015`
- result: `session_manifest.json` に `recordingMode` `recordingModeLabel` `modeBehavior` を追加した。

### mRL-11-3 documentation and state alignment

- parent: `MRL-11`
- status: `completed`
- initial plan set: `2026-03-17-015`
- latest touch: `2026-03-17-015`
- result: `current_state` `develop/index` `history summary` を mode-aware recording 状態へ更新した。

## MRL-12

### mRL-12-1 japanese UI scope definition

- parent: `MRL-12`
- status: `completed`
- initial plan set: `2026-03-17-015`
- latest touch: `2026-03-17-015`
- result: Android UI の主要操作導線を日本語化した。

### mRL-12-2 mode selection ui and controller split

- parent: `MRL-12`
- status: `completed`
- initial plan set: `2026-03-17-015`
- latest touch: `2026-03-17-015`
- result: mode selection UI を追加し、`MainScreenController` へ mode 解決と issue 生成を分離した。

### mRL-12-3 mvc boundary and retest policy close

- parent: `MRL-12`
- status: `completed`
- initial plan set: `2026-03-17-015`
- latest touch: `2026-03-17-015`
- result: `MainActivity` と `MainScreenController` の MVC 境界を整理し、completion evidence ルールを明文化した。

## MRL-13

### mRL-13-1 recorder and session error handling

- parent: `MRL-13`
- status: `completed`
- initial plan set: `2026-03-17-015`
- latest touch: `2026-03-17-015`
- result: preview / session start / refresh / finalize のエラーを UI issue として扱えるようにした。

### mRL-13-2 pocket mode fallback and warning flow

- parent: `MRL-13`
- status: `completed`
- initial plan set: `2026-03-17-015`
- latest touch: `2026-03-17-015`
- result: pocket mode で低頻度設定へ自動調整し、日本語 warning / guidance を表示するようにした。

### mRL-13-3 completion evidence rule close

- parent: `MRL-13`
- status: `completed`
- initial plan set: `2026-03-17-015`
- latest touch: `2026-03-17-015`
- result: `./gradlew.bat testDebugUnitTest` `./gradlew.bat assembleDebug` `python -m unittest python.test_session_parser` と実機再確認を完了した。
