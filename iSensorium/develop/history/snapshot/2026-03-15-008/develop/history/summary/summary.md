# develop 履歴要約

## 2026-03-15-008 docs-develop-japanese-rule-sweep

- 目標動作: `docs/` と `develop/` の live markdown を現行の日本語化ルールと履歴書式ルールへ揃える
- 変更意図: release map、develop index、docs history summary、develop history summary に残る英語見出しと英語ラベルを除去する
- 背景理由: 全文書確認の結果、history summary と release line 周辺に英語表記が残っており、workspace 共通ルールへの適合が不完全だった
- 変更要約: `docs/artifact/story_release_map.md`、`develop/index.md`、`docs/history/docs/summary/summary.md`、`develop/history/summary/summary.md` を日本語基準へ整理し、paired history を更新した
- 影響文書: `docs/artifact/story_release_map.md`, `develop/index.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- 期待効果: 次回以降の broad read でも、`iSensorium` の live 文書と history 文書を同じ表記規約で解釈できる

## 2026-03-15-007 日本語化ルール是正と利用者準備の再集約

- 目標動作: `iSensorium` の live markdown と snapshot manifest 生成を workspace 共通の日本語化ルールと利用者準備配置ルールへ戻す
- 変更意図: 英語見出しを日本語へ補正し、`USER_PREPARATION.md` を廃止して `docs/process/UX_check_work_flow.md` 冒頭へ利用者準備を再集約する
- 背景理由: 直前の修正では日本語化ルールを外し、さらに root `DOCUMENTATION_RULE.md` と異なる利用者準備配置を採っていた
- 変更要約: `README.md`、`docs/index.md`、`docs/process/change_protocol.md`、`docs/process/research_operation.md`、`docs/process/UX_check_work_flow.md`、`docs/history/docs/summary/summary.md`、`develop/history/summary/summary.md`、`scripts/create_history_snapshot.ps1` を更新し、`USER_PREPARATION.md` を廃止した
- 影響文書: `README.md`, `docs/index.md`, `docs/process/change_protocol.md`, `docs/process/research_operation.md`, `docs/process/UX_check_work_flow.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`, `scripts/create_history_snapshot.ps1`
- 期待効果: 次の docs / develop 更新と snapshot 作成が、root ルールどおり日本語ベースかつ `UX_check_work_flow.md` 集約で継続できる

## 2026-03-15-006 利用者準備ノート適合案

- 目標動作: `iSensorium` の live markdown を当時の user preparation rule 解釈へ合わせる
- 変更意図: `USER_PREPARATION.md` を復活し、`README.md` と `docs/process/*` を準備ノート参照前提へ組み替える
- 背景理由: 直近の `iSensorium` 文書は `UX_check_work_flow.md` に利用者準備を内包していたが、その時点では workspace 共通ルールを `USER_PREPARATION.md` source-of-truth と解釈した
- 変更要約: `USER_PREPARATION.md` を追加し、`docs/index.md`、`docs/process/change_protocol.md`、`docs/process/research_operation.md`、`docs/process/UX_check_work_flow.md`、`README.md` を user preparation 分離前提へ更新した
- 影響文書: `USER_PREPARATION.md`, `README.md`, `docs/index.md`, `docs/process/change_protocol.md`, `docs/process/research_operation.md`, `docs/process/UX_check_work_flow.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- 期待効果: 利用者準備の更新先が一時的に一意になり、UX 評価手順との分離を試せる

## 2026-03-15-005 guarded upstream trial line 完了

- 目標動作: real replacement runtime wiring を始める前に、`MRL-6` を準備完了 line として正式に閉じる
- 変更意図: route resolution に explicit gate status を追加し、additive manifest fields に対する parser compatibility を検証し、dated plan set を preparation-complete として記録する
- 背景理由: 正式な close-out がないと、準備 line と実 runtime integration line が曖昧につながり、rollback の明瞭さが弱くなるため
- 変更要約: `CORECAMERA_RUNTIME_ENABLED` を追加し、route metadata を `cutoverGateStatus` で拡張し、Python parser regression coverage を追加し、docs/develop の状態を `MRL-6` complete として更新した
- 影響文書: `app/build.gradle.kts`, `app/src/main/java/com/isensorium/app/GuardedUpstreamTrial.kt`, `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/test/java/com/isensorium/app/GuardedUpstreamTrialContractTest.kt`, `python/test_session_parser.py`, `docs/artifact/system_blueprint.md`, `docs/artifact/story_release_map.md`, `docs/observability/current_state.md`, `docs/history/docs/summary/summary.md`, `develop/index.md`, `develop/history/summary/summary.md`
- 期待効果: 次の dated plan set は、検証済み seam の裏へ replacement runtime を取り込む作業だけに集中できる

## 2026-03-15-004 guarded upstream trial seam 準備

- 目標動作: 外側の session contract や rollback の明瞭さを失わずに、`iSensorium` で guarded upstream trial 準備を始める
- 変更意図: local adapter seam を追加し、`session_manifest.json` に guarded route metadata を出し、reversible な upstream work 用の新しい `MRL-6` plan set を有効化する
- 背景理由: `coreCamera` ではすでに `upstreamTrialPackage.status = READY` が確認できている一方、`iSensorium` 側では real runtime swap 前に small-diff な seam がまだ必要だった
- 変更要約: `GuardedUpstreamTrial.kt` を追加し、`RecordingCoordinator` を frozen-route adapter seam 経由にし、requested-vs-active route 情報を UI/manifest に出し、`develop/plans/2026-03-15-004/` を作成した
- 影響文書: `app/build.gradle.kts`, `app/src/main/java/com/isensorium/app/GuardedUpstreamTrial.kt`, `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `app/src/test/java/com/isensorium/app/GuardedUpstreamTrialContractTest.kt`, `docs/artifact/system_blueprint.md`, `docs/artifact/story_release_map.md`, `docs/observability/current_state.md`, `docs/history/docs/summary/summary.md`, `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-15-004/market_release_lines.md`, `develop/plans/2026-03-15-004/micro_release_lines.md`
- 期待効果: 次の replacement wiring step は、frozen camera path への直接再編集ではなく、固定 seam と reversible toggle の裏で進められる

## 2026-03-15-003 workspace 文書ルール集約

- 目標動作: `iSensorium` 文書が workspace 共通の日本語ルールを必ず参照できる
- 変更意図: root `DOCUMENTATION_RULE.md` を基準にし、`docs/index.md` と `docs/process/*.md` へ参照導線を追加する
- 背景理由: project ごとに文書言語ルールを重複させると、同じ workspace 内で表記ゆれや参照漏れが起きやすい
- 変更要約: `iSensorium/docs/index.md`、`iSensorium/docs/process/change_protocol.md`、`iSensorium/docs/process/research_operation.md`、`iSensorium/docs/process/UX_check_work_flow.md` を root 文書ルール参照前提へ更新した
- 影響文書: `DOCUMENTATION_RULE.md`, `AGENTS.md`, `iSensorium/docs/index.md`, `iSensorium/docs/process/change_protocol.md`, `iSensorium/docs/process/research_operation.md`, `iSensorium/docs/process/UX_check_work_flow.md`
- 期待効果: 次回以降の `iSensorium` 文書更新で、workspace 共通ルールと project 固有ルールの責務を分離できる

## 2026-03-15-002 rollback anchor notice 追加

- 目標動作: `iSensorium/` 編集開始前に rollback anchor と実行手順を即座に参照できる
- 変更意図: UX check 冒頭にハイライト付き rollback notice を追加し、develop 側からも current state 経由で anchor を辿れるようにする
- 背景理由: `coreCamera` の upstream trial 準備が `MRL-7` まで進み、次セッションでは `iSensorium/` 変更許可の条件として rollback 可能性の明文化が必要になった
- 変更要約: `iSensorium/docs/process/UX_check_work_flow.md` と `iSensorium/docs/observability/current_state.md` に tag `rollback-isensorium-pre-upstream-trial-2026-03-15-001`、anchor commit、サイズ判断、rollback 手順参照先を反映した
- 影響文書: `iSensorium/docs/process/UX_check_work_flow.md`, `iSensorium/docs/observability/current_state.md`, `iSensorium/docs/history/docs/summary/summary.md`, `iSensorium/develop/history/summary/summary.md`
- 期待効果: upstream trial 前に rollback 起点が chat 依存にならず、branch を問わず同じ手順で復帰できる

## 2026-03-15-001 継続停止誤読の修正

- 目標動作: 15 分の観測窓を stop 条件と誤読せず、履歴完了 marker を現在停止許可と取り違えない
- 変更意図: active develop/docs entry point を書き換え、`15 min` は evidence only、`6h` は通常上限、`2026-03-14-006` は historical baseline と明示する
- 背景理由: current source-of-truth は snapshot 再帰と `MRL-5 reached` 表記の両方で誤読余地を残していた
- 変更要約: `docs/index.md`、`docs/process/change_protocol.md`、`docs/process/research_operation.md`、`docs/history` snapshot rule、`docs/observability/current_state.md`、`develop/index.md` を更新して継続ルールを補強した
- 影響文書: `AGENTS.md`, `README.md`, `iSensorium/AGENTS.md`, `iSensorium/docs/index.md`, `iSensorium/docs/process/change_protocol.md`, `iSensorium/docs/process/research_operation.md`, `iSensorium/docs/history/README.md`, `iSensorium/docs/history/docs/snapshot/README.md`, `iSensorium/docs/history/docs/summary/summary.md`, `iSensorium/docs/observability/current_state.md`, `iSensorium/develop/index.md`, `iSensorium/develop/history/summary/summary.md`, `iSensorium/scripts/create_history_snapshot.ps1`
- 期待効果: future session が true blocker または明示的 plan exit まで継続し、context load でも snapshot を既定再帰しない

## 2026-03-14-020 CameraX mainline freeze と coreCamera 分離

- 目標動作: root-cause 確認後の restart-ready 状態を保ちつつ、置換 camera work を isolated thread へ移す
- 変更意図: `iSensorium` 内の `CameraX + ARCore` 経路を freeze し、検証済み failure evidence を保持したまま次実装を sibling project `coreCamera/` へ移す
- 背景理由: 比較計測により fault が `ARCore ON` 時の camera path にあると判明し、現 mainline への継続 patch 投資が不適切になった
- 変更要約: current state に freeze note を追加し、`Camera2 + Shared Camera` 向けの分離実験 project を前提化した
- 影響文書: `AGENTS.md`, `iSensorium/docs/observability/current_state.md`, `iSensorium/docs/history/docs/summary/summary.md`, `iSensorium/develop/history/summary/summary.md`
- 期待効果: 次セッションが安定した判断点から再開し、置換 architecture work を即開始できる

## 2026-03-14-019 preview 優先 recording overlay

- 目標動作: preview を常に見せ、recording 中は stop-only overlay へ収束させ、`Refresh` 反応を目視可能にする
- 変更意図: idle controls を bottom card に縮め、recording overlay を追加し、ARCore を interval-driven `requestRender` へ移す
- 背景理由: 技術的には recording 中でも preview が止まって見える状態は、field testing では UX failure になる
- 変更要約: `activity_main.xml`、`MainActivity.kt`、`RecordingCoordinator.kt` を更新し、preview continuity と operator feedback を優先した
- 影響文書: `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `app/src/main/res/layout/activity_main.xml`, `app/src/main/res/values/strings.xml`, `docs/observability/current_state.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- 期待効果: manual tester が recording 継続可否を live preview から判断しやすくなる

## 2026-03-14-018 5 stream 手動 sampling 制御

- 目標動作: user が `video + IMU + GNSS + BLE + ARCore` を runtime で調整し、BLE / ARCore を低頻度確認モードで維持できる
- 変更意図: stream interval UI を追加し、GNSS を base set に残しつつ、全 logger を共有 recording config で絞る
- 背景理由: 安定性は compile-time profile ではなく現地負荷に合わせて調整すべきだった
- 変更要約: `MainActivity.kt`、`RecordingCoordinator.kt`、`activity_main.xml`、`strings.xml` に per-stream interval 入力と BLE / ARCore enable flag を追加した
- 影響文書: `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `app/src/main/res/layout/activity_main.xml`, `app/src/main/res/values/strings.xml`, `docs/observability/current_state.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- 期待効果: `video + IMU + GNSS` 継続を守りつつ、BLE / ARCore の負荷を user が現地で調整できる

## 2026-03-14-017 beginner 安定経路と refresh 再読込

- 目標動作: beginner manual test で latest-session refresh と安定 default route を可視化する
- 変更意図: `Refresh` で latest session を storage から再読込し、stable default mode と extended beta mode を分ける
- 背景理由: 当時の MRL-2 実装は all-sensor integration を優先し、Windows 初心者向け UX 評価の default としては不適切だった
- 変更要約: `MainActivity.kt`、`RecordingCoordinator.kt`、`activity_main.xml`、`strings.xml` を更新し、stable mode を default、advanced sensors を explicit opt-in にした
- 影響文書: `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `app/src/main/res/layout/activity_main.xml`, `app/src/main/res/values/strings.xml`, `docs/observability/current_state.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- 期待効果: non-developer が `Start Session -> Stop Session -> Refresh` を理解しやすくなり、advanced sensors は後段検証へ残せる

## 2026-03-14-016 UX 安定化修正

- 目標動作: 初回 UX フローを最後まで落ちずに完走できる
- 変更意図: recording 中の重い書き込みと status 更新を減らし、ARCore stop race を GL thread 側へ寄せて stop 後クラッシュを防ぐ
- 背景理由: ユーザー実地評価で 2-3 秒ごとの引っかかりと stop 後クラッシュが報告された
- 変更要約: `RecordingCoordinator.kt` の flush / reopen と status 更新を抑制し、ARCore close / pause / resume を GL thread queue へ寄せた
- 影響文書: `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `docs/observability/current_state.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- 期待効果: recording 体感を改善し、stop 後も session file 一覧まで辿れる

## 2026-03-14-015 Windows 初心者向け評価手順

- 目標動作: ユーザーが自分で実機体験を評価できる
- 変更意図: Windows 初心者向けに install、record、session file 確認までを 1 本の manual へまとめる
- 背景理由: 実装者前提の knowledge が多く、体験評価の入口が不足していた
- 変更要約: 現在名 `docs/process/UX_check_work_flow.md` を評価導線として整備し、`README.md` から直接辿れるようにした
- 影響文書: `docs/process/UX_check_work_flow.md`, `README.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- 期待効果: ユーザーが chat なしでも app を試し、session 結果を見て評価できる

## 2026-03-14-014 MRL-5 history discipline

- 目標動作: `mRL-5-1`, `mRL-5-2`, `mRL-5-3` を完了する
- 変更意図: line 変更の docs/develop 反映、snapshot discipline、次 action 定義を script と state 更新で固定する
- 背景理由: `MRL-4` までは product/value 側の証跡が揃った一方、docs snapshot が履歴再帰コピーで壊れる運用欠陥があり `MRL-5` の出口条件を満たしていなかった
- 変更要約: `scripts/create_history_snapshot.ps1` を追加し、`docs/process/change_protocol.md` に snapshot operation rule を追記し、`docs/observability/current_state.md` と `develop/index.md` を `MRL-5 reached` へ更新した
- 影響文書: `scripts/create_history_snapshot.ps1`, `docs/process/change_protocol.md`, `docs/observability/current_state.md`, `develop/index.md`, `docs/history/docs/summary/summary.md`, `develop/history/summary/summary.md`
- 期待効果: active plan set 完了時の history 運用が破綻せず、次の plan set 開始時も同じ change discipline を再利用できる

## 2026-03-14-013 operational MRL-4 validation

- 目標動作: `mRL-4-1`, `mRL-4-2`, `mRL-4-3` を完了する
- 変更意図: continuous recording、offline、permission denied の 3 条件で session recovery を確認する
- 背景理由: `MRL-4` は運用条件下での回復性確認が出口条件だった
- 変更要約: `session-20260314-115256`、`session-20260314-115526`、`session-20260314-115608` で必要条件を確認した
- 影響文書: `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `docs/observability/current_state.md`, `develop/history/summary/summary.md`
- 期待効果: `MRL-5` に必要な change tracking だけを残せる

## 2026-03-14-012 Python session parser

- 目標動作: `mRL-3-1`, `mRL-3-2`, `mRL-3-3` を完了する
- 変更意図: Python で session parse / validate を行う
- 背景理由: 後段利用には parser contract が必要だった
- 変更要約: `session_parser.py` と `validate_session.py` を追加し、実 session の report を生成した
- 影響文書: `python/session_parser.py`, `python/validate_session.py`, `python/README.md`, `tmp/session-20260314-111930/validation_report.json`, `docs/artifact/system_blueprint.md`, `docs/observability/current_state.md`, `develop/history/summary/summary.md`
- 期待効果: `MRL-3` 完了として operational validation へ進める

## 2026-03-14-011 ARCore GL thread fix

- 目標動作: `mRL-2-3` と `mRL-2-4` を完了する
- 変更意図: ARCore `session.update()` を GL thread へ移す
- 背景理由: blocker は GL context の喪失だった
- 変更要約: `GLSurfaceView` を導入し、ARCore pose を full session に保存できるようにした
- 影響文書: `app/src/main/res/layout/activity_main.xml`, `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `docs/observability/current_state.md`, `develop/history/summary/summary.md`
- 期待効果: `MRL-2` 完了として parser work へ進める

## 2026-03-14-010 ARCore integration blocker

- 目標動作: `mRL-2-3` の blocker を切り出す
- 変更意図: ARCore logger の失敗条件を再現して記録する
- 背景理由: `MissingGlContextException` の原因を特定する必要があった
- 変更要約: CameraX 単独経路では ARCore が GL context を持てないことを確認した
- 影響文書: `app/build.gradle.kts`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `docs/observability/current_state.md`
- 期待効果: 次の修正方針を GL thread 統合に絞れる

## 2026-03-14-009 GNSS / BLE 拡張

- 目標動作: `MRL-2` の GNSS / BLE を進める
- 変更意図: GNSS と BLE scan を同一 session に保存する
- 背景理由: recording spine に追加 sensor を載せる必要があった
- 変更要約: `gnss.csv` と `ble_scan.jsonl` を session contract へ追加した
- 影響文書: `app/build.gradle.kts`, `app/src/main/AndroidManifest.xml`, `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`
- 期待効果: `mRL-2-1` と `mRL-2-2` の device evidence が揃う

## 2026-03-14-008 device validation と short harness

- 目標動作: `MRL-1` の実機確認を反復可能にする
- 変更意図: Xperia 5 III で install / run を回し、短時間 harness を用意する
- 背景理由: build 成功だけでは release line を進められない
- 変更要約: adb install と短時間 session 3 連続確認、`run_short_session_harness.ps1` を追加した
- 影響文書: `develop/history/summary/summary.md`, `scripts/run_short_session_harness.ps1`, `USER_PREPARATION.md`
- 期待効果: `mRL-1-3` の確認と次段への移行が容易になる

## 2026-03-14-007 recording spine bootstrap

- 目標動作: `MRL-0` から `MRL-1` へ進める
- 変更意図: recording session、session directory、video / IMU / timestamp を Android アプリへ実装する
- 背景理由: 最低限の recording spine がまだ無かった
- 変更要約: CameraX recorder、IMU logger、session manager、timestamp 保存を実装した
- 影響文書: `app/build.gradle.kts`, `app/src/main/AndroidManifest.xml`, `app/src/main/java/com/isensorium/app/MainActivity.kt`, `app/src/main/java/com/isensorium/app/RecordingCoordinator.kt`, `app/src/main/res/layout/activity_main.xml`, `app/src/main/res/values/strings.xml`, `USER_PREPARATION.md`, `develop/index.md`
- 期待効果: 実機で `mRL-0-1` から `mRL-1-2` まで進められる

## 2026-03-14-006 release line 妥当性見直し

- 目標動作: `iSensorium` の main release line を現実的な順序へ修正する
- 変更意図: `MRL-0 -> MRL-1` を recording spine の最初の到達点として定義し直す
- 背景理由: 旧 plan は初手から範囲が広過ぎた
- 変更要約: plan set `2026-03-14-006` を追加し、GNSS / BLE / ARCore / parser / operational を後段 line へ並べ替えた
- 影響文書: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-006/market_release_lines.md`, `develop/plans/2026-03-14-006/micro_release_lines.md`
- 期待効果: 自律実装の順序が明確になる

## 2026-03-14-005 iDevelop 名称整列

- 目標動作: companion project 名称を揃える
- 変更意図: `iDevelop/` 名へ統一する
- 背景理由: bootstrap 時の名称揺れが残っていた
- 変更要約: develop 側記述の companion project 名を揃えた
- 影響文書: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- 期待効果: project 境界の記述がぶれなくなる

## 2026-03-14-004 iDevelop bootstrap 境界

- 目標動作: companion project を分離する
- 変更意図: `iDevelop/` を sibling project として扱う
- 背景理由: `iSensorium` 本体の plan と混線し始めた
- 変更要約: companion project の扱いを develop 側へ反映した
- 影響文書: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- 期待効果: `iSensorium` 作業だけに集中できる

## 2026-03-14-003 plan set と summary id 整列

- 目標動作: plan set と history entry id を揃える
- 変更意図: dated folder と summary entry を対応付ける
- 背景理由: plan と履歴の追跡がずれていた
- 変更要約: `YYYY-MM-DD-XXX` を plan / snapshot / summary の共通 id にした
- 影響文書: `develop/index.md`, `develop/history/summary/summary.md`, `develop/history/snapshot/README.md`
- 期待効果: 1 つの id で計画と履歴を追える

## 2026-03-14-002 初期 release line 計画

- 目標動作: release line plan の初期版を作る
- 変更意図: market / micro release line を develop 配下へ配置する
- 背景理由: docs の方針を実装計画に落とす器が必要だった
- 変更要約: develop index と plan set の初期版を追加した
- 影響文書: `develop/index.md`, `develop/plans/2026-03-14-002/market_release_lines.md`, `develop/plans/2026-03-14-002/micro_release_lines.md`
- 期待効果: 以後の作業を release line 単位で進められる

## 2026-03-14-001 develop history 基盤

- 目標動作: develop 側 history 運用の基盤を作る
- 変更意図: summary と snapshot の保管場所と記法を固定する
- 背景理由: 実装履歴を再利用可能な形で残す必要があった
- 変更要約: develop history 用の README と summary / snapshot の置き場を整えた
- 影響文書: `docs/index.md`, `docs/process/change_protocol.md`, `docs/process/research_operation.md`, `develop/history/summary/README.md`, `develop/history/snapshot/README.md`
- 期待効果: 以後の develop 更新が同じ entry discipline で残せる
