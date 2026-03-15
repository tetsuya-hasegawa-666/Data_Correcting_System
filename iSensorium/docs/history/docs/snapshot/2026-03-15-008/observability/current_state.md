# 現在の状態

## 現在の実行対象

- active plan set 候補: `MRL-6 完了後は未定義`
- active market release target: `MRL-6 guarded upstream trial completed`
- active micro release target: `固定なし。次の dated plan set で post-MRL-6 wiring target を宣言する必要がある`
- この準備段階で完了したこと:
  - `iSensorium` の外側 session operation は local adapter seam 経由へ切り替え済み。
  - session details と `session_manifest.json` は、既存 file contract を変えずに guarded upstream trial metadata を公開する。
  - rollback anchor は不変のままで、adapter seam metadata と一緒に記録されている。
  - additive manifest fields に対する parser compatibility は Python unit test で検証済み。
  - `CORECAMERA_RUNTIME_ENABLED = false` により explicit reversible gate を code 上で固定し、requested replacement route が暗黙に cut over しない状態を保っている。
- 次:
  - seam の裏に実際の replacement runtime wiring を入れるため、新しい dated plan set を開く。
  - replacement runtime を `iSensorium` へ取り込み、検証するまでは frozen route を default のまま維持する。
- blocker:
  - `MRL-6` 自体に blocker はない。次の blocker は runtime-wiring line に属する。
- 検証条件:
  - rollback anchor を保ったまま seam、additive metadata、parser check、reversible gate が揃ったため、`MRL-6` の exit 条件は満たされている。

## 現在地

- current market release: `historical baseline validated。新しい session ごとに active execution target を宣言する必要がある`
- current micro release: `globally fixed なものはない`
- thread purpose: `historical baseline を停止条件として誤読させず、次セッションでは active plan set と active micro release を明示してから継続実行する`

## 履歴上の baseline

- `develop/plans/2026-03-14-006/` は `MRL-0 -> MRL-5` を通じて recording spine、拡張センサ、parser、運用履歴 discipline を検証した履歴上の baseline である。
- この baseline は「到達済みなので停止してよい」という意味ではない。
- 新しい実装セッションでは、baseline を起点に active dated plan set を切るか、freeze note に従って sibling project へ移るかを最初に宣言する。

## 現在のリスク

- `docs/history/docs/snapshot/**` には過去の再帰コピーを含む snapshot があり、broad search や再帰読込の既定対象にすると作業を阻害する。
- `MRL reached` や `plan completed` を歴史的記録として残したまま active target を書かないと、Codex が会話終了条件と誤読する余地がある。
- `CameraX + ARCore` mainline は freeze 中であり、`iSensorium/` 本体では replacement-camera 実装を直接再開しない。

## 保留中の変更要求

- なし

## 次の検証点

- 次の新規実装セッションでは、開始時に `develop/index.md` を読み、active dated plan set と active micro release を明記する。
- broad search や context gathering は `docs/history/docs/snapshot/**` を除外して行う。
- 実際の blocker や外部依存がない限り、15 分観測窓では停止せず、最大 6 時間まで継続する。
## Rollback anchor

- `coreCamera` からの guarded upstream trial に備えて、`iSensorium/` 実装状態の rollback anchor を Git tag `rollback-isensorium-pre-upstream-trial-2026-03-15-001` として固定した
- anchor commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`
- implementation-only size は約 `4.54 MiB`、`.gradle/` と `app/build/` を含む生成物込みでは約 `82.33 MiB`
- 実際の rollback 指示方法は `iSensorium/docs/process/UX_check_work_flow.md` と `coreCamera/docs/process/UX_check_work_flow.md` の先頭ハイライトに集約した
