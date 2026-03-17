# develop 履歴概要

## 2026-03-17-019 device state verification after plan pivot

- Xperia 5 III 実機で `com.isensorium.app` version `0.1.0` を起動し、現行 Android runtime が `MRL-13` capture line の UI を維持していることを確認した。
- guarded replacement route で `session-20260317-203458` を記録し、`session_manifest.json` を含む required artifact 8 点の保存を確認した。
- `MRL-14` から `MRL-18` の manager context line は docs / develop / seed data 先行であり、Android 実装は未着手であることを再確認した。

## 2026-03-17-018 manager context collection foundation start

- `develop/plans/2026-03-17-016/market_release_lines.md` を新しい MRL 正本として追加し、`MRL-14` から `MRL-18` を起票した。
- `develop/plans/2026-03-17-016/micro_release_lines.md` を追加し、`mRL-14-1` から `mRL-18-3` を定義した。
- `develop/index.md` を active plan set `2026-03-17-016` 前提へ更新した。
- 旧 `MRL-0` から `MRL-13` は legacy capture research line として履歴保持する方針へ整理した。

## 2026-03-17-017 累積 release 台帳への統合

- `develop/plans/2026-03-17-015/market_release_lines.md` を `MRL-0` から `MRL-13` までの累積正本へ再構成した。
- `develop/plans/2026-03-17-015/micro_release_lines.md` を `mRL-0-1` から `mRL-13-3` までの累積正本へ再構成した。
- `develop/index.md` に、過去 dated plan set の release 文書は履歴であり、レビュー時の主参照は累積正本であることを明記した。
- `docs/artifact/story_release_map.md` を、ストーリー俯瞰と累積台帳への導線を示す文書として整理した。
