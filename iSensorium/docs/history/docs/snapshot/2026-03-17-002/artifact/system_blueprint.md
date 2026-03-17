# 文書化向けシステム青写真

## 2026-03-15 guarded upstream trial seam

- `iSensorium` は `shared-camera-session-adapter` を唯一許可された camera cutover seam として扱う。
- 外側の session operation は `startSession`、`stopSession`、`findLatestSession` のまま固定する。
- runtime route の選択は `BuildConfig.CAMERA_STACK_ROUTE` で guard する。
- 現在の default route は `frozen_camerax_arcore` のまま維持する。
- `BuildConfig.CORECAMERA_RUNTIME_ENABLED = true` かつ requested route が `corecamera_shared_camera_trial` の場合、app は guarded route として replacement runtime を起動する。
- default route のままでは frozen route を維持し、requested route と active route の両方を manifest metadata に記録する。
- requested route は app 内の `Use guarded replacement route` switch でも切り替えられ、利用者 UX check で compile-time 編集なしに guarded route を選べる。
- `session_manifest.json` は frozen 側の parser-visible field を維持し、additive metadata だけを追加する。
  - `sessionAdapter`
  - `guardedUpstreamTrial`
- 実機検証で、replacement route session でも required artifact 8 点が保存され、manifest `files.sizeBytes` と実ファイルサイズが一致することを確認済みである。
- guarded replacement route の UX 系 blocker は `MRL-10` 完了時点で解消済みである。
  - route switch 操作時の crash は `GLSurfaceView` 再初期化禁止で解消した。
  - replacement route recording 中の preview 停止は recorder side preview tap と UI renderer で解消した。
- replacement route preview は `shared camera capture session` の target を増やさず、`TrialCpuImageVideoRecorder` の保存用フレーム複製から `640x480` 系 `5fps` 始動の latest-only preview を構成する。
- preview renderer は best-effort であり、preview failure が recorder / finalize を巻き込まない。
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
  - `mRL-6-3`: explicit cutover gate を code 上で固定済み
  - `mRL-7-1`: `CoreCameraTrialSessionAdapter` と shared-camera runtime bootstrap を `iSensorium` 内へ実装済み
  - `mRL-7-2`: required artifact contract を replacement route でも維持し、parser regression を再通過済み
  - `mRL-7-3`: requested route と active route の guarded activation を有効化し、stop 後に frozen preview へ戻す reversible wiring を実装済み
  - `mRL-8-1`: replacement route の stop / failure / shutdown 終端で frozen preview 復帰と resource cleanup を安定化済み
  - `mRL-8-2`: latest session refresh と route summary を replacement route 観察向けに整理済み
  - `mRL-8-3`: build / unit test / parser regression を再通過し、rollback 導線を維持したまま stabilization を完了済み
  - `mRL-9-1`: `UX_check_work_flow.md` を replacement route 前提の利用者導線へ更新済み
  - `mRL-9-2`: current state / release map / develop を user UX check ready 状態へ更新済み
  - `mRL-9-3`: 採用 / guarded 継続 / rollback の判断点を UX check 文書へ明記済み
  - post `MRL-9`: replacement route session の保存アウトプット整合を実機で確認済み
  - `mRL-10-1`: recorder side preview tap を guarded replacement route へ追加済み
- `mRL-10-2`: replacement route recording 中だけ preview を UI 表示する guarded renderer を追加済み
- `mRL-10-3`: Xperia 5 III 実機で preview 更新、recording 成立、保存整合維持を確認し、`MRL-10` を完了済み

## 2026-03-17 計測モード拡張と運用原則

- `iSensorium` は Android 端末側の計測、同期記録、session metadata、export contract を担う
- 計測モードは少なくとも次の 2 系統を持つ
  - `standard_handheld`
  - `pocket_recording`
- mode 定義は UI 表示だけでなく、session manifest、後段 viewer、UX 評価手順で同一名称を使う
- Android UI で自然に日本語化できる箇所は極力日本語にする
- file 名、class 名、package 名、識別子、config key はアルファベットを維持する

## MVC と責務境界

- View:
  画面描画、日本語ラベル表示、入力導線、状態表示、エラー表示
- Controller:
  mode 選択、session 開始停止、permission 分岐、route 切替、export 実行、UI 遷移制御
- Model:
  session contract、mode contract、manifest、export payload、repository、error state 定義
- recorder や low-level runtime は Controller から直接 UI 状態へ書き戻さず、Model を経由して可観測状態へ反映する

## 計測モード contract

- `standard_handheld`
  - 画面確認を行いながらの通常計測
  - preview と操作導線の視認性を優先する
- `pocket_recording`
  - スマホをポケットやバッグに収納したままの計測
  - 誤操作防止、状態の簡潔化、収納状態前提の注意表示を優先する
- どちらの mode でも session id、timestamp basis、required artifact contract は共通基盤を保つ
- mode 差分は additive metadata と UI 挙動差分として表現し、parser 互換性を壊さない

## export / session metadata contract

- session manifest には mode を表す安定 field を保持する
- 後段 viewer が必要とする最小 export 情報を明示する
  - `sessionId`
  - `requestedRoute`
  - `activeRoute`
  - `recordingMode`
  - `status`
  - `startedAt`
  - `finalizedAt`
  - `files`
- export 契約は `iDevelop` 側 viewer が参照できる粒度で保ち、mode 差分を UI 上で判別できるようにする

## エラーハンドリング原則

- mode 切替失敗、permission 不足、route fallback、preview failure、finalize failure、export failure を別々に扱う
- 人が読んで状況を把握しやすい日本語メッセージを優先する
- 失敗時には次の action を判断できる情報を残す
  - 継続可能か
  - fallback 済みか
  - retry 可能か
  - user action が必要か
- preview failure のような周辺機能失敗は、recorder や finalize を巻き込まない

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
| mode 別 UX 確認、利用者準備、ユーザー検証の採用条件 | `UX_check_work_flow.md` | mode 差分と user-side evidence を運用導線へ集約するため |

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
