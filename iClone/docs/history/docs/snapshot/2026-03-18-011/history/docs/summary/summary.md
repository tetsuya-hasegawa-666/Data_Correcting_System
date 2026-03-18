# docs 履歴要約

## 2026-03-18-011 autosave and local browse skeleton

- 保存ボタン未押下でも端末内へ自動仮保存する前提を north star と system blueprint へ反映した
- 端末ワークスペース一覧、閲覧履歴、音声 / 画像メモの文字見出しルールを UI contract と schema に追加した
- mobile preview を auto-save、sort 付き一覧、閲覧履歴を含む骨格へ拡張した

## 2026-03-18-010 status help wording focused on available actions

- mobile preview のラベル説明を、同期状態そのものよりも利用可能な機能説明へ寄せた
- `PC synced` はスマホと PC のワークスペース同期が完了した文面へ更新した

## 2026-03-18-009 question panel heading and boxed status area

- mobile preview の質問エリア見出しを常に `次の質問` へ統一した
- 質問未到着時は内容欄中央の `PC 同期待ち` だけで空状態を表す形へ整理した
- ラベルエリアも枠付きパネルにして、メモ機能と統一感のある見た目へ寄せた

## 2026-03-18-008 label placement under followup area

- mobile preview の状態ラベルを下部領域の直下へ移し、質問エリアとの関係を追いやすくした
- 上部の状態説明は静的案内に寄せ、重複する説明を減らした
- `UX_check_work_flow.md` の確認観点もラベル配置に合わせて更新した

## 2026-03-18-007 three-label checkmark expression

- mobile preview を `Local` `PC` `PC synced` の 3 ラベル常時表示へ整理した
- 緑 `✓` と赤 `×` で状態達成度を示す形へ更新した
- `UX_check_work_flow.md` の確認観点も同じ表現へ揃えた

## 2026-03-18-001 beginner-friendly UX test flow expansion

- `UX_check_work_flow.md` に Windows 初心者向けの現時点テスト手順を追記した
- 事前起動条件、エントリーポイント、host stack 起動、preview 確認手順を明文化した
- 最小確認手順に加えて、最終目標手順を併記した

## 2026-03-18-002 file preview fetch error fix

- PC preview が `file://` 直開きでも動くように、snapshot generator を `.js` 出力対応へ変更した
- `index.html` は `fetch()` ではなく `status_snapshot.js` と `review_snapshot.js` を読む方式へ更新した

## 2026-03-18-003 saved vs synced preview differentiation

- mobile preview で `saved` と `synced` を切り替えて見比べられるようにした
- `UX_check_work_flow.md` に、状態差の確認手順を追記した

## 2026-03-18-004 saved synced dual-label status

- mobile preview を 2 ラベル常時表示へ更新した
- 達成時は緑 `✓`、未達時は赤 `×` を表示する形に変更した

## 2026-03-18-005 followup question state modeling

- mobile preview に「未同期」「同期済みだが質問待ち」「同期済みで質問あり」の 3 状態を追加した
- 実運用に近い follow-up question の表示条件を UX テスト手順へ反映した

## 2026-03-18-006 three-label mobile state refinement

- mobile preview を 3 ラベル表現へ整理した
- `Local: 現saved` でも下部領域サイズを固定し、待機表現を常時見えるようにした

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
