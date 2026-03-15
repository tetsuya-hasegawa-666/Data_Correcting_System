# 現在の状態

## 現在の実行対象

- active plan set 候補: `2026-03-15-009`
- active market release target: `MRL-8 guarded upstream stabilization`
- active micro release target: `mRL-8-1 session lifecycle stabilization`
- 開始時点で固定済みの前提:
  - `MRL-6` で `shared-camera-session-adapter` seam、rollback anchor、additive manifest metadata、parser compatibility、reversible gate が固定されている。
  - `coreCamera` 側では `upstreamTrialPackage.status = READY` が確認済みである。
  - `iSensorium` 側では `shared-camera-session-adapter` の裏に replacement runtime を guarded に接続済みであり、requested route が `corecamera_shared_camera_trial` かつ gate 有効時は actual runtime が起動する。
- 今回の目標:
  - `MRL-7` 完了状態を source-of-truth に固定する。
  - replacement route の session lifecycle、preview continuity、refresh、rollback 導線を guarded 条件のまま安定化する。
  - user UX check 前に、短時間実機評価に耐える出口条件を `MRL-8` で閉じる。
- 次:
  - `MRL-8 guarded upstream stabilization` 用の dated plan set を起こし、session lifecycle と UX 退行点を順に潰す。
  - その後 `MRL-9 user UX check ready` へ移る。
- blocker:
  - `MRL-7` 自体の blocker はない。
  - 次の blocker 候補は replacement route の preview continuity と stop 後 refresh を、frozen route 同等の UX へ近づける安定化作業である。
- 検証条件:
  - `MRL-7` では replacement route が actual runtime を起動し、`session_manifest.json` と required artifact contract を保ち、frozen route へ即時復帰できることを exit 条件とした。
  - 検証結果として `./gradlew.bat clean assembleDebug testDebugUnitTest` と `python -m unittest python.test_session_parser` が通過した。

## 現在地

- current market release: `MRL-8 guarded upstream stabilization`
- current micro release: `mRL-8-1 session lifecycle stabilization`
- thread purpose: `guarded replacement runtime を短時間 UX 評価に耐える状態へ安定化し、その後 user UX check へ接続する`

## 履歴上の baseline

- `develop/plans/2026-03-14-006/` は `MRL-0 -> MRL-5` を通じて recording spine、拡張センサ、parser、運用履歴 discipline を検証した履歴上の baseline である。
- この baseline は「到達済みなので停止してよい」という意味ではない。
- 新しい実装セッションでは、baseline を起点に active dated plan set を切るか、freeze note に従って sibling project へ移るかを最初に宣言する。

## 現在のリスク

- `docs/history/docs/snapshot/**` には過去の再帰コピーを含む snapshot があり、broad search や再帰読込の既定対象にすると作業を阻害する。
- `MRL reached` や `plan completed` を歴史的記録として残したまま active target を書かないと、Codex が会話終了条件と誤読する余地がある。
- `CameraX + ARCore` mainline は freeze 中であり、`iSensorium/` 本体では replacement-camera 実装を直接再開しない。

## 保留中の変更要求

- `MRL-7` 完了を履歴固定したうえで `MRL-8 guarded upstream stabilization` と `MRL-9 user UX check ready` の plan set を段階追加する

## 次の検証点

- `2026-03-15-009` は `MRL-7` 完了記録として保持し、次の active plan set は `MRL-8` 用に新設する。
- broad search や context gathering は `docs/history/docs/snapshot/**` を除外して行う。
- 実際の blocker や外部依存がない限り、15 分観測窓では停止せず、最大 6 時間まで継続する。
## Rollback anchor

- `coreCamera` からの guarded upstream trial に備えて、`iSensorium/` 実装状態の rollback anchor を Git tag `rollback-isensorium-pre-upstream-trial-2026-03-15-001` として固定した
- anchor commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`
- implementation-only size は約 `4.54 MiB`、`.gradle/` と `app/build/` を含む生成物込みでは約 `82.33 MiB`
- 実際の rollback 指示方法は `iSensorium/docs/process/UX_check_work_flow.md` と `coreCamera/docs/process/UX_check_work_flow.md` の先頭ハイライトに集約した
