# 現在の状態

## 現在の実行対象

- active plan set 候補: `2026-03-15-009`
- active market release target: `MRL-7 guarded replacement runtime wiring`
- active micro release target: `mRL-7-1 adapter runtime implementation`
- 開始時点で固定済みの前提:
  - `MRL-6` で `shared-camera-session-adapter` seam、rollback anchor、additive manifest metadata、parser compatibility、reversible gate が固定されている。
  - `coreCamera` 側では `upstreamTrialPackage.status = READY` が確認済みである。
  - `iSensorium` 側では replacement runtime そのものは未接続であり、`corecamera_shared_camera_trial` 要求時も fallback が既定である。
- 今回の目標:
  - `iSensorium` 内で replacement runtime を seam の裏へ実装する。
  - 既存 session in/out contract を維持したまま、required artifact 群を replacement route でも出力する。
  - requested route と active route の guarded 切替を、rollback 可能なまま実動作へ進める。
- 次:
  - `develop/plans/2026-03-15-009/` に従って `mRL-7-1 -> mRL-7-2 -> mRL-7-3` を順に閉じる。
  - `MRL-7` 完了後は `MRL-8 guarded upstream stabilization` へ移る。
- blocker:
  - 現時点の blocker は replacement runtime の `iSensorium` 実装そのもの。
- 検証条件:
  - replacement route が actual runtime を起動し、`session_manifest.json` と required artifact contract を保ち、frozen route へ即時復帰できることを `MRL-7` の exit 条件とする。

## 現在地

- current market release: `MRL-7 guarded replacement runtime wiring`
- current micro release: `mRL-7-1 adapter runtime implementation`
- thread purpose: `replacement runtime を iSensorium の guarded seam の裏へ実装し、contract 維持のまま user UX check へ接続する`

## 履歴上の baseline

- `develop/plans/2026-03-14-006/` は `MRL-0 -> MRL-5` を通じて recording spine、拡張センサ、parser、運用履歴 discipline を検証した履歴上の baseline である。
- この baseline は「到達済みなので停止してよい」という意味ではない。
- 新しい実装セッションでは、baseline を起点に active dated plan set を切るか、freeze note に従って sibling project へ移るかを最初に宣言する。

## 現在のリスク

- `docs/history/docs/snapshot/**` には過去の再帰コピーを含む snapshot があり、broad search や再帰読込の既定対象にすると作業を阻害する。
- `MRL reached` や `plan completed` を歴史的記録として残したまま active target を書かないと、Codex が会話終了条件と誤読する余地がある。
- `CameraX + ARCore` mainline は freeze 中であり、`iSensorium/` 本体では replacement-camera 実装を直接再開しない。

## 保留中の変更要求

- `MRL-7` 完了後に `MRL-8 guarded upstream stabilization` と `MRL-9 user UX check ready` の plan set を段階追加する

## 次の検証点

- 新しい active plan set は `develop/plans/2026-03-15-009/` とする。
- broad search や context gathering は `docs/history/docs/snapshot/**` を除外して行う。
- 実際の blocker や外部依存がない限り、15 分観測窓では停止せず、最大 6 時間まで継続する。
## Rollback anchor

- `coreCamera` からの guarded upstream trial に備えて、`iSensorium/` 実装状態の rollback anchor を Git tag `rollback-isensorium-pre-upstream-trial-2026-03-15-001` として固定した
- anchor commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`
- implementation-only size は約 `4.54 MiB`、`.gradle/` と `app/build/` を含む生成物込みでは約 `82.33 MiB`
- 実際の rollback 指示方法は `iSensorium/docs/process/UX_check_work_flow.md` と `coreCamera/docs/process/UX_check_work_flow.md` の先頭ハイライトに集約した
