# System Blueprint For Documentation

## 2026-03-15 Guarded Upstream Trial Seam

- `iSensorium` now treats `shared-camera-session-adapter` as the only allowed camera cutover seam.
- Outer session operations stay fixed as `startSession`, `stopSession`, and `findLatestSession`.
- Runtime route selection is guarded by `BuildConfig.CAMERA_STACK_ROUTE`.
- Current default route remains `frozen_camerax_arcore`.
- If `corecamera_shared_camera_trial` is requested before runtime wiring exists inside `iSensorium`, the app records the request in manifest metadata and falls back to the frozen route.
- `session_manifest.json` keeps the frozen parser-visible fields and adds only additive metadata:
  - `sessionAdapter`
  - `guardedUpstreamTrial`
- `guardedUpstreamTrial` references the verified sibling evidence:
  - source project: `coreCamera`
  - evidence plan set: `2026-03-14-001`
  - evidence session: `session-20260315-044922`
  - upstream trial package status: `READY`
- rollback guard stays fixed to:
  - tag: `rollback-isensorium-pre-upstream-trial-2026-03-15-001`
  - commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`
- validation hypothesis:
  - once `iSensorium` can host the replacement runtime behind the same seam without changing file names, timestamp basis, or outer session calls, the guarded route can be switched by configuration instead of by another large refactor.
- completion status:
  - `mRL-6-1`: adapter seam added
  - `mRL-6-2`: parser compatibility verified against additive manifest fields
  - `mRL-6-3`: explicit cutover gate fixed in code through `CORECAMERA_RUNTIME_ENABLED = false`

## Purpose

この文書は、実装対象をどう文書化するかの骨格を定義する。
技術内容そのものの最終版ではなく、どの論点をどの章に収めるかを固定する。

## Required Chapters For Implementation Thread

次スレッドでは、以下をこの順で埋める。

1. 前提整理
2. 推奨アーキテクチャ
3. データモデル
4. 取得方式
5. 圧縮・通信量削減
6. 同期設計
7. フォールバック
8. Android 実装方針
9. 実装順序
10. 検証計画
11. Kotlin コード骨格
12. 最終推奨構成
13. User Story Map
14. Market Release Line
15. 開発マイルストーン
16. Human + AI 開発プロセス
17. 進捗可視化方法
18. 長時間継続研究プロセス
19. Micro Release Line
20. 開発者体験駆動の検証計画
21. Micro Release を含む Mermaid 可視化
22. 変更可能な Release Line 運用設計
23. 人と Codex の変更時意思疎通ルール
24. 変更履歴と意味追跡ルール

## Content Allocation

| Topic | Primary Home | Why |
|---|---|---|
| Android 構成、API 選定、保存方式、同期、圧縮、フォールバック | 実装スレッドの本文 | 技術決定は一体で比較する必要がある |
| Goal、不変条件、前提 | `north_star.md` | 後から見ても意味がぶれないようにするため |
| Story、release、Mermaid、change point | `story_release_map.md` | 価値構造を一箇所に集約するため |
| 変更要求、衝突処理、意味確認、履歴 | `change_protocol.md` | 更新フローを一箇所に閉じるため |
| task state、研究サイクル、AI 自律継続ルール | `research_operation.md` | 実行管理の規律を固定するため |
| 現在の進捗、現在の micro release、保留事項 | `current_state.md` | ライブ状態だけを薄く持つため |

## Structure Constraints

- 技術仕様書と運用ルールを同じファイルに混在させない。
- release line の意味定義と週次進捗ログを混在させない。
- 実装の章立ては固定し、各章の中身だけ差し替える。
- 追加要求は新ファイル化より既存章への編入を優先する。

## Recommended Future Expansion

実装スレッドで技術詳細が固まったら、必要に応じて以下を追加できる。

- `docs/artifact/decision_log.md`
- `docs/reference/device_constraints.md`
- `docs/reference/storage_format_tradeoffs.md`

ただし初期構築段階では作らない。

## Implemented Baseline

2026-03-14 時点の初回実装で、次の最小 spine を追加した。

1. Android アプリ骨格
2. session directory 自動生成
3. CameraX による動画記録
4. accelerometer / gyroscope の IMU CSV 保存
5. monotonic time 基準の video event / frame timestamp 保存

この baseline は `MRL-0` から `MRL-1` へ進むための実装起点であり、GNSS、BLE、ARCore、圧縮最適化、長時間試験はまだ含めない。

## Current Expansion Constraint

`MRL-2` の拡張センサ統合では、GNSS と BLE は既存 CameraX spine に追記できる一方、ARCore pose は GL context と camera 共有前提が強い。

- GNSS: Fused Location を session 内 CSV へ追記可能
- BLE: scan result を session 内 JSONL へ追記可能
- ARCore: `MissingGlContextException` を避けるため、CameraX 単独構成から shared camera または GL ベース rendering 統合へ進める必要がある

したがって `MRL-2` の残タスクは ARCore 統合経路の切り替えであり、`MRL-3` へ進む前にここを解消する。

## Current Parser Contract

`MRL-3` では、1 session を以下の単位で Python から読めることを contract とする。

- `session_manifest.json`: session id、timebase、collector status、stream 定義
- `video_frame_timestamps.csv`: 動画 frame ごとの monotonic / wall clock 基準
- `imu.csv`: IMU event ごとの monotonic / wall clock 基準
- `gnss.csv`: 位置 event ごとの monotonic / wall clock 基準
- `ble_scan.jsonl`: BLE scan event ごとの monotonic / wall clock 基準
- `arcore_pose.jsonl`: ARCore pose event ごとの monotonic / wall clock 基準

join key の主軸は `elapsed_realtime_ns` 系とし、`sessionStartElapsedRealtimeNanos` を session 基準に用いる。manifest 内 sample count は finalize タイミング依存のため、parser は実ファイル行数も正とみなして評価する。
