# 市場リリースライン計画

## 目的

この dated plan set は、`MRL-6` で固定した `shared-camera-session-adapter` seam の裏へ、`coreCamera` replacement stack を `iSensorium` 内で guarded に接続する。

## baseline の解釈

- `develop/plans/2026-03-14-006/` は recording spine から docs / develop discipline までの履歴 baseline である。
- `develop/plans/2026-03-15-004/` は guarded upstream trial 準備 line の完了記録である。
- `2026-03-15-009` は、その準備 line の次段として actual runtime wiring だけを扱う。

## ゲート状態

| RL | 状態 | 理由 |
|---|---|---|
| RL-0 | ready | recording spine baseline は検証済み |
| RL-1 | ready | frozen route の session bootstrap は維持されている |
| RL-2 | frozen_baseline | `CameraX + ARCore` mainline は freeze 中だが rollback 用 baseline として有効 |
| RL-3 | ready_as_contract | parser-visible session contract は固定済み |
| RL-4 | out_of_scope_now | long duration / thermal endurance は今回の対象外 |
| RL-5 | ready | docs / develop / history discipline は維持済み |
| RL-6 | completed | guarded seam、additive metadata、reversible gate は固定済み |
| RL-7 | completed | actual replacement runtime wiring が `iSensorium` で完了し、guarded route が実 runtime を起動できる |

## Market Release Lines

| ID | 名称 | 提供価値 | 開始条件 | 完了条件 | 関連マイクリリース | 変更要因 |
|---|---|---|---|---|---|---|
| MRL-7 | Guarded replacement runtime wiring | `iSensorium` が frozen session contract を維持したまま、replacement runtime を guarded route として実際に起動できる | `MRL-6` 完了、rollback anchor 固定、`coreCamera` package `READY` 確認、`iSensorium` 側変更許可あり | requested route `corecamera_shared_camera_trial` で actual replacement runtime が起動し、required artifact 群を contract 維持で出力し、frozen route に即時復帰できる | mRL-7-1, mRL-7-2, mRL-7-3 | runtime integration 未実装、preview continuity は後段、rollback 可能性維持 |
| MRL-8 | Guarded upstream stabilization | replacement runtime 接続後の session lifecycle、preview continuity、refresh、rollback 導線を guarded 条件内で安定化できる | `MRL-7` 完了 | replacement route で短時間 UX 評価に耐える安定性と rollback drill を確認できる | mRL-8-1, mRL-8-2, mRL-8-3 | lifecycle 退行、preview 退行、parser / contract drift |
| MRL-9 | User UX check ready | 利用者準備と UX 観察点が replacement route 前提で固定され、実 UX 確認へ渡せる | `MRL-8` 完了 | `UX_check_work_flow.md`、current state、history が user UX check ready 状態になり、採用 / guarded 継続 / rollback 分岐が明示される | mRL-9-1, mRL-9-2, mRL-9-3 | user-side guidance、evaluation point、release decision handoff |

## 現在の推奨順序

1. `MRL-7` は完了済みとして保持し、replacement runtime を seam の裏へ接続した実装記録とする。
2. 次段では `MRL-8` を新しい dated plan set として起こし、preview / stop / refresh / rollback を guarded 条件内で安定化する。
3. その後 `MRL-9` で user UX check 用文書と観察点を確定し、実確認へ渡す。
