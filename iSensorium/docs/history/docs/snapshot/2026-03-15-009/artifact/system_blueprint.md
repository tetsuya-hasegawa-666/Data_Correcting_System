# 文書化向けシステム青写真

## 2026-03-15 guarded upstream trial seam

- `iSensorium` は `shared-camera-session-adapter` を唯一許可された camera cutover seam として扱う。
- 外側の session operation は `startSession`、`stopSession`、`findLatestSession` のまま固定する。
- runtime route の選択は `BuildConfig.CAMERA_STACK_ROUTE` で guard する。
- 現在の default route は `frozen_camerax_arcore` のまま維持する。
- `iSensorium` 内に runtime wiring が入る前に `corecamera_shared_camera_trial` が要求された場合、app はその要求を manifest metadata に記録したうえで frozen route へ fallback する。
- `session_manifest.json` は frozen 側の parser-visible field を維持し、additive metadata だけを追加する。
  - `sessionAdapter`
  - `guardedUpstreamTrial`
- `guardedUpstreamTrial` は検証済み sibling evidence を参照する。
  - source project: `coreCamera`
  - evidence plan set: `2026-03-14-001`
  - evidence session: `session-20260315-044922`
  - upstream trial package status: `READY`
- rollback guard は次へ固定する。
  - tag: `rollback-isensorium-pre-upstream-trial-2026-03-15-001`
  - commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`
- 検証仮説:
  - `iSensorium` が同じ seam の裏に replacement runtime を収容でき、file 名、timestamp basis、外側の session call を変えずに済むなら、guarded route は大きな再設計ではなく設定で切り替えられる。
- 完了状態:
  - `mRL-6-1`: adapter seam を追加済み
  - `mRL-6-2`: additive manifest fields に対する parser compatibility を検証済み
  - `mRL-6-3`: `CORECAMERA_RUNTIME_ENABLED = false` により explicit cutover gate を code 上で固定済み

## 目的

この文書は、実装対象をどう文書化するかの骨格を定義する。
技術内容そのものの最終版ではなく、どの論点をどの章に収めるかを固定する。

## 実装スレッドで必要な章

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

## 内容の配置

| 話題 | 主な配置先 | 理由 |
|---|---|---|
| Android 構成、API 選定、保存方式、同期、圧縮、フォールバック | 実装スレッドの本文 | 技術決定は一体で比較する必要がある |
| Goal、不変条件、前提 | `north_star.md` | 後から見ても意味がぶれないようにするため |
| Story、release、Mermaid、change point | `story_release_map.md` | 価値構造を一箇所に集約するため |
| 変更要求、衝突処理、意味確認、履歴 | `change_protocol.md` | 更新フローを一箇所に閉じるため |
| task state、研究サイクル、AI 自律継続ルール | `research_operation.md` | 実行管理の規律を固定するため |
| 現在の進捗、現在の micro release、保留事項 | `current_state.md` | ライブ状態だけを薄く持つため |

## 構造上の制約

- 技術仕様書と運用ルールを同じファイルに混在させない。
- release line の意味定義と週次進捗ログを混在させない。
- 実装の章立ては固定し、各章の中身だけ差し替える。
- 追加要求は新ファイル化より既存章への編入を優先する。

## 今後の推奨拡張

実装スレッドで技術詳細が固まったら、必要に応じて以下を追加できる。

- `docs/artifact/decision_log.md`
- `docs/reference/device_constraints.md`
- `docs/reference/storage_format_tradeoffs.md`

ただし初期構築段階では作らない。

## 実装済み baseline

2026-03-14 時点の初回実装で、次の最小 spine を追加した。

1. Android アプリ骨格
2. session directory 自動生成
3. CameraX による動画記録
4. accelerometer / gyroscope の IMU CSV 保存
5. monotonic time 基準の video event / frame timestamp 保存

この baseline は `MRL-0` から `MRL-1` へ進むための実装起点であり、GNSS、BLE、ARCore、圧縮最適化、長時間試験はまだ含めない。

## 現在の拡張制約

`MRL-2` の拡張センサ統合では、GNSS と BLE は既存 CameraX spine に追記できる一方、ARCore pose は GL context と camera 共有前提が強い。

- GNSS: Fused Location を session 内 CSV へ追記可能
- BLE: scan result を session 内 JSONL へ追記可能
- ARCore: `MissingGlContextException` を避けるため、CameraX 単独構成から shared camera または GL ベース rendering 統合へ進める必要がある

したがって `MRL-2` の残タスクは ARCore 統合経路の切り替えであり、`MRL-3` へ進む前にここを解消する。

## 現在の parser contract

`MRL-3` では、1 session を以下の単位で Python から読めることを contract とする。

- `session_manifest.json`: session id、timebase、collector status、stream 定義
- `video_frame_timestamps.csv`: 動画 frame ごとの monotonic / wall clock 基準
- `imu.csv`: IMU event ごとの monotonic / wall clock 基準
- `gnss.csv`: 位置 event ごとの monotonic / wall clock 基準
- `ble_scan.jsonl`: BLE scan event ごとの monotonic / wall clock 基準
- `arcore_pose.jsonl`: ARCore pose event ごとの monotonic / wall clock 基準

join key の主軸は `elapsed_realtime_ns` 系とし、`sessionStartElapsedRealtimeNanos` を session 基準に用いる。manifest 内 sample count は finalize タイミング依存のため、parser は実ファイル行数も正とみなして評価する。
