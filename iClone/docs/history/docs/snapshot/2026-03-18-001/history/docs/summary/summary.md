# docs 履歴要約

## 2026-03-18-001 beginner-friendly UX test flow expansion

- `UX_check_work_flow.md` に Windows 初心者向けの現時点テスト手順を追記した
- 事前起動条件、エントリーポイント、host stack 起動、preview 確認手順を明文化した
- 最小確認手順に加えて、最終目標手順を併記した

## 2026-03-17-002 local sync hub architecture reflection

- Windows 11 + WSL2/Docker または Ubuntu を host、Android を edge とする主体アーキテクチャを明文化した
- `system_blueprint.md` に mDNS、Syncthing Docker、Tailscale option、Ollama / LocalAI を反映した
- current state を `MRL-1 connectivity line` へ進めた

## 2026-03-17-003 current target UX and full release map expansion

- Xperia 5 III と `Tezy-GT37` を現行ターゲットとして source-of-truth に反映した
- スマホ側 UX と PC 側 UX の要件を main artifact に追加した
- MRL / mRL を end-to-end と将来拡張まで含む全体計画へ拡張した

## 2026-03-17-004 connectivity skeleton and runtime reflection

- compose、observer、runtime layout を追加し、`MRL-1` の構築物を source-of-truth と current state に反映した
- active micro release を `mRL-1-3 tailscale optional extension` へ進めた

## 2026-03-17-005 MRL-1 close and MRL-2 activation

- Tailscale option を config と helper へ反映し、`MRL-1` を完了扱いへ進めた
- active line を `MRL-2 edge capture UX line` に切り替えた

## 2026-03-17-006 edge UX contracts and preview

- Xperia 5 III 向けの one-question mobile preview と multimodal flow contract を追加した
- `MRL-2` を completed とし、active line を `MRL-3 PC review UX line` へ進めた

## 2026-03-17-007 PC review preview baseline

- review snapshot generator と PC preview を追加した
- `MRL-3` の inbox board と ops panel の最小表示を反映した

## 2026-03-17-001 iClone manager context collection 初期化

- project を `iClone/` で独立初期化した
- source-of-truth、develop、seed data、snapshot ルールを追加した
- manager context collection system の基本構想を artifact 文書へ反映した
