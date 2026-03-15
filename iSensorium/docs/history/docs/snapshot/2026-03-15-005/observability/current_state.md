# Current State

## Active Execution Target

- active plan set candidate: `none fixed after MRL-6 completion`
- active market release target: `MRL-6 guarded upstream trial completed`
- active micro release target: `none; next dated plan set must declare post-MRL-6 wiring target`
- completed in this preparation step:
  - `iSensorium` outer session operations are routed through a local adapter seam.
  - session details and `session_manifest.json` now expose guarded upstream trial metadata without changing the existing file contract.
  - rollback anchor remains unchanged and is recorded together with the adapter seam metadata.
  - parser compatibility with additive manifest fields is verified by Python unit test.
  - explicit reversible gate is fixed in code by `CORECAMERA_RUNTIME_ENABLED = false`, so requested replacement route still cannot silently cut over.
- next:
  - open a new dated plan set for actual replacement runtime wiring behind the seam.
  - keep frozen route as default until replacement runtime is imported and validated in `iSensorium`.
- blocker:
  - no blocker for `MRL-6`; next blocker belongs to the future runtime-wiring line.
- validation condition:
  - `MRL-6` exit is satisfied because seam, additive metadata, parser check, and reversible gate are all in place while rollback anchor remains intact.

## Current Position

- current market release: `historical baseline validated, active execution target must be declared per new session`
- current micro release: `none fixed globally`
- thread purpose: `historical baseline を停止条件として誤読させず、次セッションでは active plan set と active micro release を明示してから継続実行する`

## Historical Baseline

- `develop/plans/2026-03-14-006/` は `MRL-0 -> MRL-5` を通じて recording spine、拡張センサ、parser、運用履歴 discipline を検証した historical baseline である。
- この baseline は「到達済みなので停止してよい」という意味ではない。
- 新しい実装セッションでは、baseline を起点に active dated plan set を切るか、freeze note に従って sibling project へ移るかを最初に宣言する。

## Active Risks

- `docs/history/docs/snapshot/**` には過去の再帰コピーを含む snapshot があり、broad search や再帰読込の既定対象にすると作業を阻害する。
- `MRL reached` や `plan completed` を歴史的記録として残したまま active target を書かないと、Codex が会話終了条件と誤読する余地がある。
- `CameraX + ARCore` mainline は freeze 中であり、`iSensorium/` 本体では replacement-camera 実装を直接再開しない。

## Pending Change Requests

- none

## Next Validation Point

- 次の新規実装セッションでは、開始時に `develop/index.md` を読み、active dated plan set と active micro release を明記する。
- broad search や context gathering は `docs/history/docs/snapshot/**` を除外して行う。
- 実際の blocker や外部依存がない限り、15 分観測窓では停止せず、最大 6 時間まで継続する。
## Rollback Anchor

- `coreCamera` からの guarded upstream trial に備えて、`iSensorium/` 実装状態の rollback anchor を Git tag `rollback-isensorium-pre-upstream-trial-2026-03-15-001` として固定した
- anchor commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`
- implementation-only size は約 `4.54 MiB`、`.gradle/` と `app/build/` を含む生成物込みでは約 `82.33 MiB`
- 実際の rollback 指示方法は `iSensorium/docs/process/UX_check_work_flow.md` と `coreCamera/docs/process/UX_check_work_flow.md` の先頭ハイライトに集約した
