# Docs History Summary

## 2026-03-14-001 agentized-doc-system

- scope: documentation system
- trigger: agent 主導で docs を source-of-truth として扱う枠組みを導入した
- resulting_direction: docs/develop の責務分離と source-of-truth 運用を明文化した
- expected_benefit: 以後の実装と履歴更新の基準を固定できる

## 2026-03-14-002 paired-history-snapshot

- scope: documentation system
- trigger: summary と snapshot を対で残す必要が明確になった
- resulting_direction: docs history に paired summary / snapshot ルールを導入した
- expected_benefit: 変更根拠とスナップショットを同じ entry id で辿れる

## 2026-03-14-003 open-extension-closed-correction

- scope: documentation system
- trigger: docs 更新の open/closed 境界を補正する必要が出た
- resulting_direction: source-of-truth だけを中心に更新する運用へ補正した
- expected_benefit: 記述の重複と矛盾を減らせる

## 2026-03-14-004 history-tree-simplification

- scope: documentation system
- trigger: 履歴ツリーが分散し過ぎて追跡しづらかった
- resulting_direction: `docs/history/docs/{summary,snapshot}` と `develop/history/{summary,snapshot}` へ整理した
- expected_benefit: history path が一意になり、以後の運用を単純化できる

## 2026-03-14-005 docs-develop-boundary

- scope: documentation system
- trigger: docs と develop の混線を防ぐ必要が出た
- resulting_direction: `docs/` は source-of-truth、`develop/` は実装計画と履歴に限定した
- expected_benefit: 何をどこへ書くかを迷わず更新できる

## 2026-03-14-006 summary-consolidation

- scope: documentation system
- trigger: docs 側 summary を 1 ファイルへ集約する方針が必要になった
- resulting_direction: `summary.md` へ entry を継ぎ足す形式へ統一した
- expected_benefit: docs 側 history の走査が容易になった

## 2026-03-14-007 isolated-dashboard-boundary

- scope: documentation system
- trigger: companion dashboard project との境界を切る必要が出た
- resulting_direction: `iDevelop/` を sibling companion project として分離した
- expected_benefit: `iSensorium` docs の責務が保たれる

## 2026-03-14-008 idevelop-project-placement

- scope: documentation system
- trigger: companion project の配置規則を source-of-truth に反映した
- resulting_direction: `iDevelop/` を sibling project として固定した
- expected_benefit: project 境界変更時の反映先が明確になった

## 2026-03-14-009 implementation-baseline-and-device-proof

- scope: documentation system
- trigger: Android recording spine の初回実装と Xperia 5 III 実機確認が完了した
- resulting_direction: `MRL-0 -> MRL-1` 到達可能性を current state に反映した
- expected_benefit: 次の sensor integration を device-backed に進められる

## 2026-03-14-010 mrl2-expansion-status

- scope: documentation system
- trigger: GNSS/BLE は進んだが ARCore が blocker になった
- resulting_direction: `MRL-2` の未解決点を GL/camera 文脈の問題として明示した
- expected_benefit: 次の作業で ARCore blocker に集中できる

## 2026-03-14-011 mrl2-completed-with-gl-thread-arcore

- scope: documentation system
- trigger: ARCore を GL thread へ移して full session を実機で確認した
- resulting_direction: `MRL-2` 完了として parser / schema contract へ進める状態にした
- expected_benefit: `MRL-3` へ移行する根拠が揃った

## 2026-03-14-012 mrl3-parser-contract-established

- scope: documentation system
- trigger: Python parser と validation report で session の読込と join を確認した
- resulting_direction: parser contract と metadata sufficiency を source-of-truth に反映した
- expected_benefit: operational validation を parser 前提で進められる

## 2026-03-14-013 mrl4-operational-readiness

- scope: documentation system
- trigger: continuous recording、offline local recovery、permission denied 下の partial session を実機で確認した
- resulting_direction: `MRL-4` 到達と `MRL-5` 移行条件を current state に反映した
- expected_benefit: 次は履歴 discipline と release-line change tracking を詰めればよい状態になった

## 2026-03-14-014 mrl5-history-discipline

- scope: documentation system
- trigger: docs snapshot が履歴再帰コピーで壊れる運用欠陥を修正し、`MRL-5` 到達を source-of-truth に固定した
- resulting_direction: `scripts/create_history_snapshot.ps1` と `docs/process/change_protocol.md` により summary / snapshot / current_state の同期運用を repository 内ルールとして明文化した
- expected_benefit: 次回 plan set 切替時に docs / develop history が構造的に壊れず、release line 変更の証跡を同じ手順で再現できる

## 2026-03-14-015 windows-beginner-evaluation-manual

- scope: documentation system
- trigger: ユーザーが体験ベース評価を行えるよう、Windows 初心者向けの操作手順を repository 内へ追加した
- resulting_direction: 現在名 `docs/process/UX_check_work_flow.md` を評価導線として固定し、root README から到達できるようにした
- expected_benefit: 実装者以外でも app install、session 操作、session file 確認まで自走しやすくなる
## 2026-03-14-016 ux-stability-fix

- scope: documentation system
- trigger: UX 評価で recording の断続感と stop 後クラッシュが報告され、実装修正と再検証を行った
- resulting_direction: app の current state に、`session-20260314-160134` で stop 後継続動作と refresh 成功を確認した事実を反映した
- expected_benefit: 初回体験フローが最後まで完走でき、今後の release-line 議論を UX 事実ベースで進められる
## 2026-03-14-017 stable-beginner-path-and-refresh-rescan

- scope: documentation system
- trigger: user manual check showed `Refresh` produced no visible reload and continuous recording felt unreliable for beginner evaluation
- resulting_direction: change the app to rescan the latest saved session on `Refresh` and make `video + IMU` the default stable path while keeping GNSS / BLE / ARCore behind an explicit beta switch
- expected_benefit: beginner UX can be evaluated on a stable route first, and the screen can visibly reflect the latest saved session after `Stop Session`
## 2026-03-14-018 manual-sampling-controls-for-five-streams

- scope: documentation system
- trigger: user requested `video + IMU + GNSS` as the base path and asked for BLE / ARCore to remain receivable with aggressively reduced sampling, plus manual sampling controls for all streams
- resulting_direction: the app now exposes per-stream sampling intervals and keeps all five streams configurable from the main screen, rather than hard-coding a single stability profile
- expected_benefit: hands-on evaluation can directly tune load versus observability without rebuilding the app
## 2026-03-14-019 preview-first-recording-overlay

- scope: documentation system
- trigger: hands-on evaluation showed the control panel was hiding the preview, recording UX should collapse to a stop-only overlay, and `Refresh` still felt invisible
- resulting_direction: restore full-screen preview, hide the setup panel during recording, throttle ARCore through scheduled render requests, and add visible feedback to `Refresh`
- expected_benefit: the app now behaves closer to a practical field recorder instead of a configuration screen during capture
