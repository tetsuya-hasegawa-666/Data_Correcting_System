# 現在の状態

## 現在の実行対象

- active plan set 候補: `2026-03-17-015`
- latest completed plan set: `2026-03-15-014`
- active market release target: `MRL-11 capture mode and contract line`
- latest completed market release: `MRL-10 guarded replacement preview MVP`
- active micro release target: `mRL-11-1`
- latest completed micro release target: `mRL-10-3 device validation and documentation close`
- 開始時点で固定済みの前提:
  - `MRL-6` で `shared-camera-session-adapter` seam、rollback anchor、additive manifest metadata、parser compatibility、reversible gate が固定されている。
  - `coreCamera` 側では `upstreamTrialPackage.status = READY` が確認済みである。
  - `iSensorium` 側では `shared-camera-session-adapter` の裏に replacement runtime を guarded に接続済みであり、requested route が `corecamera_shared_camera_trial` かつ gate 有効時は actual runtime が起動する。
- 今回の目標:
  - 通常計測とポケット収納計測の mode 定義を source-of-truth と plan へ固定する。
  - Android UI で日本語化できる箇所、日本語エラー表示、mode 選択導線を定義する。
  - session/export contract を `iDevelop` 側 viewer と整合する粒度へ広げる。
  - MVC 準拠、詳細エラーハンドリング、Codex 再テストまたは user validation 採用ルールを先に固定する。
- 次:
  - `2026-03-17-015` を active plan set として開始し、`MRL-11 -> MRL-13` を順に進める。
  - `MRL-11` で mode contract、`MRL-12` で Android MVC / 日本語 UX、`MRL-13` で error handling と再テスト条件を閉じる。
- blocker:
  - 現在の blocker はない。
- 検証条件:
  - `MRL-8` では replacement route の stop / failure / shutdown が frozen preview 復帰込みで安定し、`Refresh` が route metadata を再表示できることを exit 条件とした。
  - `MRL-9` では `Use guarded replacement route` switch を app 内へ追加し、`UX_check_work_flow.md` が replacement route 前提で読めることを exit 条件とした。
  - 検証結果として `./gradlew.bat clean assembleDebug testDebugUnitTest` と `python -m unittest python.test_session_parser` が通過した。
  - 追加確認として、実機 session `session-20260315-141238` と再検証 session で required artifact 8 点、`requestedRoute=activeRoute=corecamera_shared_camera_trial`、manifest `files.sizeBytes` と実ファイルサイズの一致を確認した。
  - 2026-03-15 の UX blocker 切り分けでは、`GLSurfaceView` 再初期化が toggle crash の直接原因であることを logcat で確認し、再初期化禁止で解消した。
  - 同日の preview live 化試行では `TextureView` preview surface を shared camera capture session に追加したが、Xperia 5 III で `Failed to create capture session; configuration failed` を再現したため、この経路は撤回して recording 成立優先へ戻した。
  - 最終的に `shared camera capture session` の target を増やさず、`TrialCpuImageVideoRecorder` に流れる保存用フレームから latest-only preview を構成する方式を実装した。
  - Xperia 5 III 実機確認で、`Use guarded replacement route` の短間隔 toggle が落ちないこと、`Start Session -> Stop Session -> Refresh` が通ること、replacement route recording 中に preview が更新されることを確認した。
  - preview は保存経路の `640x480` 系フレーム複製を `5fps` 始動で UI 表示し、向き補正も適用済みである。
  - 2026-03-16 に Codex が `./gradlew.bat clean assembleDebug testDebugUnitTest` と `python -m unittest python.test_session_parser` を再実行し、どちらも通過した。
  - 同日に Codex が現行 APK を Xperia 5 III へ再 install し、guarded replacement route の device evidence として session `session-20260316-200652` を採取した。
  - 上記 session では `requestedRoute=activeRoute=corecamera_shared_camera_trial`、preview log の `preview frame emitted: 640x480`、`video_events.jsonl` の start/finalize、`session_manifest.json` の `status=finalized`、required artifact 群の保存を確認した。

## 現在地

- active market release: `MRL-11 capture mode and contract line`
- active micro release: `mRL-11-1`
- latest completed market release: `MRL-10 guarded replacement preview MVP`
- latest completed micro release: `mRL-10-3 device validation and documentation close`
- thread purpose: `通常計測 / ポケット収納計測の mode 契約、Android 日本語 UX、MVC、エラーハンドリング、viewer 連携前提を source-of-truth と plan に固定する`

## 履歴上の baseline

- `develop/plans/2026-03-14-006/` は `MRL-0 -> MRL-5` を通じて recording spine、拡張センサ、parser、運用履歴 discipline を検証した履歴上の baseline である。
- この baseline は「到達済みなので停止してよい」という意味ではない。
- 新しい実装セッションでは、baseline を起点に active dated plan set を切るか、freeze note に従って sibling project へ移るかを最初に宣言する。

## 現在のリスク

- `docs/history/docs/snapshot/**` には過去の再帰コピーを含む snapshot があり、broad search や再帰読込の既定対象にすると作業を阻害する。
- `MRL reached` や `plan completed` を歴史的記録として残したまま active target を書かないと、Codex が会話終了条件と誤読する余地がある。
- `CameraX + ARCore` mainline は freeze 中であり、`iSensorium/` 本体では replacement-camera 実装を直接再開しない。

## 保留中の変更要求

- 通常計測 / ポケット収納計測の mode-aware recording を導入する
- Android UI を自然な日本語へ寄せる
- MVC 準拠と詳細エラーハンドリングを強化する
- `iDevelop` viewer 向け session/export contract を整える

## 次の検証点

- `MRL-10` 完了は baseline として保持する。
- `MRL-11` では mode 名称、metadata field、viewer 連携項目を固定する。
- `MRL-12` では Android UI 日本語化、mode selection UI、MVC 境界を固定する。
- `MRL-13` では error handling と完了根拠の採用ルールを、Codex retest または user validation のどちらでも追跡できるようにする。
- broad search や context gathering は `docs/history/docs/snapshot/**` を除外して行う。
- 実際の blocker や外部依存がない限り、15 分観測窓では停止せず、最大 6 時間まで継続する。
## Rollback anchor

- `coreCamera` からの guarded upstream trial に備えて、`iSensorium/` 実装状態の rollback anchor を Git tag `rollback-isensorium-pre-upstream-trial-2026-03-15-001` として固定した
- anchor commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`
- implementation-only size は約 `4.54 MiB`、`.gradle/` と `app/build/` を含む生成物込みでは約 `82.33 MiB`
- 実際の rollback 指示方法は `iSensorium/docs/process/UX_check_work_flow.md` と `coreCamera/docs/process/UX_check_work_flow.md` の先頭ハイライトに集約した
