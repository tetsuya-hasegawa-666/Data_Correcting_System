# 現在の状態

## 現在の実行対象

- active plan set 候補: `2026-03-15-014`
- active market release target: `MRL-10 guarded replacement preview MVP`
- active micro release target: `mRL-10-3 device validation and documentation close`
- 開始時点で固定済みの前提:
  - `MRL-6` で `shared-camera-session-adapter` seam、rollback anchor、additive manifest metadata、parser compatibility、reversible gate が固定されている。
  - `coreCamera` 側では `upstreamTrialPackage.status = READY` が確認済みである。
  - `iSensorium` 側では `shared-camera-session-adapter` の裏に replacement runtime を guarded に接続済みであり、requested route が `corecamera_shared_camera_trial` かつ gate 有効時は actual runtime が起動する。
- 今回の目標:
  - shared camera capture session の target を増やさずに replacement route の live preview MVP を作る。
  - recorder に流れる保存用フレーム複製から `640x480` 系 `5fps` 始動 preview を guarded に表示する。
  - 保存アウトプット整合と recording 成立を崩さない。
- 次:
  - `mRL-10-1` と `mRL-10-2` の実装は完了したため、`mRL-10-3` の実機確認へ進む。
  - Xperia 5 III で `Use guarded replacement route` ON の recording 中に preview 更新が見えることを確認する。
  - 実機確認後に docs / develop / history を `MRL-10` 完了状態へ更新する。
- blocker:
  - 保存アウトプット自体の blocker はない。
  - `Use guarded replacement route` の短間隔 toggle crash は 2026-03-15 の復旧修正で解消した。
  - 現在の blocker は 1 件に収束した。
    - replacement route recording 中に preview が動かない
- 検証条件:
  - `MRL-8` では replacement route の stop / failure / shutdown が frozen preview 復帰込みで安定し、`Refresh` が route metadata を再表示できることを exit 条件とした。
  - `MRL-9` では `Use guarded replacement route` switch を app 内へ追加し、`UX_check_work_flow.md` が replacement route 前提で読めることを exit 条件とした。
  - 検証結果として `./gradlew.bat clean assembleDebug testDebugUnitTest` と `python -m unittest python.test_session_parser` が通過した。
  - 追加確認として、実機 session `session-20260315-141238` と再検証 session で required artifact 8 点、`requestedRoute=activeRoute=corecamera_shared_camera_trial`、manifest `files.sizeBytes` と実ファイルサイズの一致を確認した。
  - 2026-03-15 の UX blocker 切り分けでは、`GLSurfaceView` 再初期化が toggle crash の直接原因であることを logcat で確認し、再初期化禁止で解消した。
  - 同日の preview live 化試行では `TextureView` preview surface を shared camera capture session に追加したが、Xperia 5 III で `Failed to create capture session; configuration failed` を再現したため、この経路は撤回して recording 成立優先へ戻した。
  - 次の preview 対策は `shared camera capture session` の target を増やさず、`TrialCpuImageVideoRecorder` に流れる保存用フレームから latest-only preview を構成する方針とした。

## 現在地

- current market release: `MRL-10 guarded replacement preview MVP`
- current micro release: `mRL-10-1 recorder side preview tap`
- thread purpose: `guarded replacement route の recording 成立と保存整合を維持したまま、別経路 preview MVP を追加する`

## 履歴上の baseline

- `develop/plans/2026-03-14-006/` は `MRL-0 -> MRL-5` を通じて recording spine、拡張センサ、parser、運用履歴 discipline を検証した履歴上の baseline である。
- この baseline は「到達済みなので停止してよい」という意味ではない。
- 新しい実装セッションでは、baseline を起点に active dated plan set を切るか、freeze note に従って sibling project へ移るかを最初に宣言する。

## 現在のリスク

- `docs/history/docs/snapshot/**` には過去の再帰コピーを含む snapshot があり、broad search や再帰読込の既定対象にすると作業を阻害する。
- `MRL reached` や `plan completed` を歴史的記録として残したまま active target を書かないと、Codex が会話終了条件と誤読する余地がある。
- `CameraX + ARCore` mainline は freeze 中であり、`iSensorium/` 本体では replacement-camera 実装を直接再開しない。

## 保留中の変更要求

- 利用者 UX 確認の結果に応じて、採用 / guarded 継続 / rollback の次 release line を切る

## 次の検証点

- `2026-03-15-011` は `MRL-8` と `MRL-9` の完了記録として保持する。
- `2026-03-15-014` は preview MVP の active plan set として扱う。
- guarded replacement route は「保存アウトプット整合あり、toggle crash 解消、preview live は未解決」という前提から開始する。
- preview は `640x480` 系 `5fps` 始動の MVP とし、shared camera capture session へ追加 target を足さない。
- broad search や context gathering は `docs/history/docs/snapshot/**` を除外して行う。
- 実際の blocker や外部依存がない限り、15 分観測窓では停止せず、最大 6 時間まで継続する。
## Rollback anchor

- `coreCamera` からの guarded upstream trial に備えて、`iSensorium/` 実装状態の rollback anchor を Git tag `rollback-isensorium-pre-upstream-trial-2026-03-15-001` として固定した
- anchor commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`
- implementation-only size は約 `4.54 MiB`、`.gradle/` と `app/build/` を含む生成物込みでは約 `82.33 MiB`
- 実際の rollback 指示方法は `iSensorium/docs/process/UX_check_work_flow.md` と `coreCamera/docs/process/UX_check_work_flow.md` の先頭ハイライトに集約した
