# 市場リリースライン計画

## 目的

この dated plan set は、`MRL-8 guarded upstream stabilization` と `MRL-9 user UX check ready` を連続で閉じ、`iSensorium` を利用者 UX 確認へ渡せる状態にする。

## baseline の解釈

- `develop/plans/2026-03-14-006/` は recording spine から docs / develop discipline までの履歴 baseline である。
- `develop/plans/2026-03-15-009/` は `MRL-7 guarded replacement runtime wiring` の完了記録である。
- `2026-03-15-011` は、その guarded runtime を短時間 UX 評価に耐える状態へ安定化し、利用者 UX check ready まで進める active line である。

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
| RL-7 | completed | guarded replacement runtime wiring は完了済み |
| RL-8 | completed | session lifecycle、refresh、rollback 導線の stabilization を完了した |
| RL-9 | completed | user UX check ready 文書と観察点を固定した |

## Market Release Lines

| ID | 名称 | 提供価値 | 開始条件 | 完了条件 | 関連マイクリリース | 変更要因 |
|---|---|---|---|---|---|---|
| MRL-8 | Guarded upstream stabilization | replacement runtime を短時間 UX 評価に耐える reversible な recording route として使える | `MRL-7` 完了、rollback anchor 固定、required artifact contract 維持 | start / stop / failure / shutdown / refresh 後の状態遷移が guarded 条件内で安定し、parser / unit test / build が通る | mRL-8-1, mRL-8-2, mRL-8-3 | lifecycle 退行、refresh 退行、rollback 明瞭性不足 |
| MRL-9 | User UX check ready | 利用者が replacement route 前提の UX 確認を迷わず始められる | `MRL-8` 完了 | `UX_check_work_flow.md`、current state、history、release map が user UX check ready 状態を示し、採用 / guarded 継続 / rollback の判断点が読める | mRL-9-1, mRL-9-2, mRL-9-3 | user-side guidance、observation point、handoff 不足 |

## 現在の推奨順序

1. `MRL-8` は完了済みとして保持し、shutdown・failure・refresh の stabilization 記録とする。
2. `MRL-9` は完了済みとして保持し、user UX check 用文書と観察点の固定記録とする。
3. 次は利用者による実 UX 確認へ渡し、採用 / guarded 継続 / rollback を判定する。
