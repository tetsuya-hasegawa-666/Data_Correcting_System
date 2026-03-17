# 市場リリースライン計画

## 目的

この dated plan set は、frozen session contract と rollback anchor を崩さずに `iSensorium` の guarded upstream trial 準備を開始するためのものである。

## baseline の解釈

- `develop/plans/2026-03-14-006/` は検証済みの履歴 baseline として維持する。
- `MRL-0` から `MRL-5` は、frozen mainline と文書運用 discipline の baseline として有効なまま維持する。
- `MRL-6` は additive な line であり、reversible seam の裏で guarded upstream trial work を段階化するためにだけ存在する。

## ゲート状態

| RL | 状態 | 理由 |
|---|---|---|
| RL-0 | ready | baseline の session bootstrap はすでに検証済み |
| RL-1 | ready | frozen な video/session/timestamp/IMU route が利用可能 |
| RL-2 | frozen_blocked | frozen `CameraX + ARCore` route は `ARCore ON` 下で既知の camera-path stall をまだ示す |
| RL-3 | ready_as_baseline | parser-visible な session contract が存在し、backward compatible を維持すべき |
| RL-4 | out_of_scope_now | long-duration と thermal endurance は今回も明示的に対象外 |
| RL-5 | ready | docs/develop/history discipline は guarded integration work に利用可能 |
| RL-6 | in_progress | guarded upstream trial seam preparation が `iSensorium` 内で進行中 |

## Market Release Lines

| ID | 名前 | 提供価値 | 開始条件 | 完了条件 | 関連 Micro Release | 変更要因 |
|---|---|---|---|---|---|---|
| MRL-6 | Guarded upstream trial | `iSensorium` が外側 session operation と frozen artifact shape を保ったまま reversible な camera cutover seam を持てる | `MRL-5` discipline が active、rollback anchor が固定済み、`coreCamera` が `upstreamTrialPackage.status = READY` を報告している | adapter seam が有効で、frozen route が default のまま維持され、guarded metadata は additive のみで、replacement route には明示的な reversible gate が残る | mRL-6-1, mRL-6-2, mRL-6-3 | frozen mainline の stall evidence、sibling replacement readiness、rollback-safe な upstream preparation |

## 現在の推奨順序

1. `mRL-6-1` は、outer operations を seam 経由にするところまでで閉じる。
2. `mRL-6-2` は、additive manifest metadata が downstream assumption を変えないことを示して閉じる。
3. `mRL-6-3` が reversible cutover gate を具体的な検証条件で定義するまでは、real replacement runtime wiring を試みない。
