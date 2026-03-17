# 2026-03-17-015 市場リリースライン計画

## 目的

この dated plan set は、`MRL-10` 完了後の次段として、通常計測 / ポケット収納計測の mode contract、Android 日本語 UX、MVC、詳細エラーハンドリング、viewer 連携前提を固定する。

## baseline の解釈

- `develop/plans/2026-03-15-014/` は guarded replacement route の preview MVP 完了記録である
- `MRL-10` 完了は、recording 成立、保存整合、preview MVP がそろった baseline として扱う
- `2026-03-17-015` は、その baseline の上で mode-aware recording と運用規律を追加する

## ゲート状態

| RL | 状態 | 理由 |
|---|---|---|
| RL-0 | ready | recording spine baseline は検証済み |
| RL-1 | ready | frozen route と guarded route の session bootstrap は維持されている |
| RL-2 | frozen_baseline | `CameraX + ARCore` mainline は freeze 中だが baseline として有効 |
| RL-3 | ready_as_contract | parser-visible session contract は固定済み |
| RL-4 | out_of_scope_now | long duration / thermal endurance は今回の対象外 |
| RL-5 | ready | docs / develop / history discipline は維持済み |
| RL-6 | completed | guarded seam、additive metadata、reversible gate は固定済み |
| RL-7 | completed | guarded replacement runtime wiring は完了済み |
| RL-8 | completed | stabilization は完了済み |
| RL-9 | completed | user UX check ready は完了済み |
| RL-10 | completed | preview MVP は完了済み |

## Market Release Lines

| ID | 名称 | 提供価値 | 開始条件 | 完了条件 | 関連マイクリリース | 変更要因 |
|---|---|---|---|---|---|---|
| MRL-11 | capture mode and contract line | 通常計測とポケット収納計測を同一 session/export 意味体系で扱える | `MRL-10` 完了、現行 session/export contract が安定している | mode 名称、metadata field、viewer 連携項目、UX 用語が docs / develop で固定される | mRL-11-1, mRL-11-2, mRL-11-3 | 携行パターン差分、viewer 連携不足、命名揺れ |
| MRL-12 | mobile MVC and Japanese UX line | Android UI が日本語導線で mode 選択でき、MVC 境界が明示される | `MRL-11` 完了 | mode selection UI、日本語文言、View / Controller / Model の責務分離、再テスト条件が固定される | mRL-12-1, mRL-12-2, mRL-12-3 | UI 意味不一致、責務混線、可読性不足 |
| MRL-13 | robust recording and error handling line | mode-aware recording が詳細 error handling と完了根拠規律つきで運用できる | `MRL-12` 完了 | recorder / session / export / preview / permission の error handling と、`Codex retest` / `user validation` 採用ルールが docs / develop に固定される | mRL-13-1, mRL-13-2, mRL-13-3 | 周辺失敗の巻き込み、再現困難、完了根拠の曖昧さ |

## 推奨順序

1. `MRL-11` で mode 名称、metadata、viewer 連携契約を固定する
2. `MRL-12` で Android 日本語 UX と MVC 境界を固定する
3. `MRL-13` で error handling と完了判定規律を固定する
