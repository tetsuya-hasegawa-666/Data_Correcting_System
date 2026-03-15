# docs 履歴要約

## 2026-03-15-012 replacement route 保存アウトプット整合確認

- 対象範囲: 文書体系
- 発生理由: 実機確認で replacement route の required artifact と manifest file size 整合が確認できた一方、UX blocker が 2 件に収束したため、live 文書へ現在地を反映する必要が出た
- 反映内容: `current_state.md`、`system_blueprint.md`、`UX_check_work_flow.md`、`develop/index.md` を更新し、保存アウトプット完了と残 UX blocker を明記した
- 期待効果: 次の作業が「データ取得確認」ではなく、`switch crash` と `preview 停止` の解消に集中できる

## 2026-03-15-011 MRL-8 と MRL-9 完了

- 対象範囲: 文書体系
- 発生理由: guarded replacement runtime の stabilization と user UX check ready 条件が揃い、live 文書を `MRL-8/9 completed` 状態へ切り替える必要が出た
- 反映内容: `system_blueprint.md`、`story_release_map.md`、`current_state.md`、`UX_check_work_flow.md`、`develop/index.md`、`develop/plans/2026-03-15-011/` を更新し、利用者が app 内 switch で replacement route を選べる前提へ整理した
- 期待効果: 次の作業が Codex 実装ではなく利用者 UX 確認へ明確に移り、採用 / guarded 継続 / rollback の判断点を source-of-truth から辿れる

## 2026-03-15-010 MRL-7 guarded runtime wiring 完了

- 対象範囲: 文書体系
- 発生理由: `shared-camera-session-adapter` の裏に replacement runtime を実装し、`MRL-7` の exit 条件を満たしたため、live 状態文書を準備中から完了状態へ切り替える必要が出た
- 反映内容: `system_blueprint.md`、`story_release_map.md`、`current_state.md`、`develop/index.md`、`develop/plans/2026-03-15-009/` を `MRL-7 completed` と次段 `MRL-8` 前提へ更新した
- 期待効果: guarded runtime wiring が履歴上で閉じ、次の作業が stabilization と user UX check 準備に限定される

## 2026-03-15-009 MRL-7 以降の実装計画追加

- 対象範囲: 文書体系
- 発生理由: `MRL-6` 完了後の次実装入口が未定義のままだと、replacement runtime wiring と user UX check までの線形計画が source-of-truth から読めなかった
- 反映内容: `story_release_map.md`、`current_state.md`、`develop/index.md`、`develop/plans/2026-03-15-009/` を更新し、`MRL-7`、`MRL-8`、`MRL-9` の計画を追加した
- 期待効果: `iSensorium` の次実装が `MRL-7 guarded replacement runtime wiring` から開始され、その後の stabilization と user UX check まで段階的に進められる

## 2026-03-15-008 docs-develop-japanese-rule-sweep

- 対象範囲: 文書体系
- 発生理由: `docs/` と `develop/` の live 文書を全面確認した結果、history summary や release map に英語見出しと英語ラベルが残っていた
- 反映内容: `story_release_map.md`、`develop/index.md`、`docs/history/docs/summary/summary.md`、`develop/history/summary/summary.md` を日本語基準へ再整理し、paired history を追加した
- 期待効果: 次回以降は `docs/` と `develop/` を広く読んでも、日本語ルールと履歴書式ルールを一貫して参照できる

## 2026-03-15-007 日本語化ルールと利用者準備配置の是正

- 対象範囲: 文書体系
- 発生理由: `.md` の日本語化原則と、利用者準備を `UX_check_work_flow.md` に集約する root ルールに対し、直前の `iSensorium` 更新が一部不適合だった
- 反映内容: `README.md` を日本語へ補正し、`USER_PREPARATION.md` を廃止して `UX_check_work_flow.md` 冒頭の `利用者準備ノート` へ戻し、snapshot manifest 生成文言も日本語へ改めた
- 期待効果: 次回以降の `iSensorium` 文書更新で、日本語化ルールと利用者準備配置ルールを同時に外さず運用できる

## 2026-03-15-006 利用者準備ノート復帰案

- 対象範囲: 文書体系
- 発生理由: workspace 共通ルールの解釈として、一時的に user action / external device access を `USER_PREPARATION.md` へ集約する方針を採った
- 反映内容: `USER_PREPARATION.md` を source-of-truth として復活させ、`docs/index.md`、`README.md`、`docs/process/UX_check_work_flow.md`、関連 process 文書を「準備ノート参照 + UX 手順本体」の境界へ整理した
- 期待効果: 利用者準備の更新先が一意になり、guarded upstream trial で user-side task と UX 評価手順が混線しにくくなる想定だった

## 2026-03-15-005 guarded upstream trial line 完了

- 対象範囲: 文書体系
- 発生理由: adapter seam 実装、parser compatibility check、reversible cutover gate の 3 点が揃い、`MRL-6` の exit 条件を満たした
- 反映内容: `current_state` と `story_release_map` を `MRL-6 completed` として更新し、次は実 runtime wiring 用の新 dated plan set を起こす前提に整理した
- 期待効果: guarded preparation line と実 integration line が混ざらず、次の変更は replacement runtime wiring に限定できる

## 2026-03-15-004 guarded upstream trial seam 準備

- 対象範囲: 文書体系
- 発生理由: `coreCamera` 側で `upstreamTrialPackage.status = READY` が確認されたため、`iSensorium` 側でも rollback-safe な guarded seam を先に固定する必要が出た
- 反映内容: `system_blueprint` に `shared-camera-session-adapter` を唯一の cutover seam として明記し、`current_state` と `story_release_map` に `MRL-6 guarded upstream trial` の開始条件を追加した
- 期待効果: `iSensorium` は frozen route を維持したまま小差分で上流統合準備を進められ、次の wiring が additive metadata と reversible toggle の範囲に収まる

## 2026-03-15-003 workspace 文書ルール集約

- 対象範囲: 文書体系
- 発生理由: workspace 共通の日本語文書方針と文書ルール参照先を 1 か所へ集約する必要が出た
- 反映内容: root `DOCUMENTATION_RULE.md` を基準として、`iSensorium/docs/index.md` と `docs/process/*.md` から参照できる形へ整理した
- 期待効果: `iSensorium` の source-of-truth が project 固有ルールに集中し、workspace 共通ルールとの責務分離を保てる

## 2026-03-15-002 rollback anchor notice 追加

- 対象範囲: 文書体系
- 発生理由: `coreCamera` 側の guarded upstream trial を `iSensorium/` へ広げる前提として、現実装へ確実に戻せる rollback 指示を文書化する必要が出た
- 反映内容: `iSensorium/docs/process/UX_check_work_flow.md` 冒頭に rollback notice を追加し、`current_state` に anchor tag とサイズ判断を記録した
- 期待効果: 新セッションで `iSensorium/` を触る前に rollback 起点と復帰導線を source-of-truth から辿れる

## 2026-03-15-001 継続解釈の明確化

- 対象範囲: 文書体系
- 発生理由: active docs が `MRL reached = stop` と読める余地を残し、snapshot 再帰も広い探索の負荷になっていた
- 反映内容: historical baseline と active execution target を分離し、`15 min != stop condition` と `6h` 上限ルール、snapshot 除外ルールを source-of-truth へ反映した
- 期待効果: future session が短い観測窓や古い完了表示で止まらず、実 blocker が出るまで継続できる

## 2026-03-14-020 CameraX mainline freeze と coreCamera 分離

- 対象範囲: 文書体系
- 発生理由: `ARCore ON` で multi-second camera-path stall が再現し、`iSensorium` 本線での延命より置換経路分離が妥当になった
- 反映内容: `iSensorium` 側を `CameraX + ARCore` freeze として記録し、`coreCamera/` を `Camera2 + Shared Camera` の独立実験 project として切り出した
- 期待効果: 次セッションが原因再議論を省いて、正しい camera architecture へ直接進める

## 2026-03-14-019 preview 優先 recording overlay

- 対象範囲: 文書体系
- 発生理由: hands-on evaluation で control panel が preview を隠し、recording 中 UX が観察しづらいことが分かった
- 反映内容: full-screen preview、recording 中 stop-only overlay、`Refresh` 可視化、ARCore の interval-driven render 方針を current state に反映した
- 期待効果: manual tester が recording 継続可否を preview から判断しやすくなる

## 2026-03-14-018 5 stream 手動 sampling 制御

- 対象範囲: 文書体系
- 発生理由: user が `video + IMU + GNSS` を基底にしつつ、BLE / ARCore を低頻度で受けたいと要求した
- 反映内容: per-stream sampling interval と low-rate BLE / ARCore confirmation 方針を文書化した
- 期待効果: 再 build せずに、現地で負荷と観測性の調整を行える

## 2026-03-14-017 beginner 安定経路と refresh 再読込

- 対象範囲: 文書体系
- 発生理由: user manual check で `Refresh` に visible reload がなく、continuous recording も beginner evaluation には不安定だった
- 反映内容: `Refresh` で latest session を再読込し、default route を stable mode、GNSS / BLE / ARCore を opt-in beta mode として整理した
- 期待効果: non-developer が `Start Session -> Stop Session -> Refresh` を理解しやすくなる

## 2026-03-14-016 UX 安定化修正

- 対象範囲: 文書体系
- 発生理由: UX 評価で recording の断続感と stop 後クラッシュが報告された
- 反映内容: flush 頻度低減、status 更新抑制、ARCore stop race の整理、再検証結果を current state に反映した
- 期待効果: stop 後も app が落ちず、saved session を評価導線へ乗せられる

## 2026-03-14-015 Windows 初心者向け評価手順

- 対象範囲: 文書体系
- 発生理由: ユーザーが chat なしで体験ベース評価を行えるよう、Windows 初心者向け操作手順が必要だった
- 反映内容: `docs/process/UX_check_work_flow.md` を評価導線として整備し、`README.md` から辿れるようにした
- 期待効果: install から session file 確認までを repository 内文書だけで案内できる

## 2026-03-14-014 MRL-5 history discipline

- 対象範囲: 文書体系
- 発生理由: docs snapshot が履歴再帰コピーで壊れる運用欠陥を修正し、`MRL-5` 到達を source-of-truth に固定する必要があった
- 反映内容: `scripts/create_history_snapshot.ps1`、`docs/process/change_protocol.md`、`docs/observability/current_state.md` へ summary / snapshot / current_state の連携ルールを追記した
- 期待効果: 次回以降の plan set 移行時も docs / develop history を同じ discipline で運用できる

## 2026-03-14-013 MRL-4 operational readiness

- 対象範囲: 文書体系
- 発生理由: continuous recording、offline local recovery、permission denied 下の partial session を実機で確認した
- 反映内容: `MRL-4` 到達と `MRL-5` 移行条件を current state に反映した
- 期待効果: 次段の作業が release-line change tracking に集中できる

## 2026-03-14-012 MRL-3 parser contract

- 対象範囲: 文書体系
- 発生理由: Python parser と validation report で session の読込と join を確認した
- 反映内容: parser contract と metadata sufficiency を source-of-truth に追加した
- 期待効果: operational validation を parser 側証跡付きで進められる

## 2026-03-14-011 MRL-2 GL thread ARCore 完了

- 対象範囲: 文書体系
- 発生理由: ARCore を GL thread へ移して full session を実機で確認した
- 反映内容: `MRL-2` 完了と parser / schema contract へ進む状態を current state に反映した
- 期待効果: `MRL-3` へ移行する前提が明確になった

## 2026-03-14-010 MRL-2 expansion status

- 対象範囲: 文書体系
- 発生理由: GNSS/BLE は進んだが ARCore が blocker になった
- 反映内容: `MRL-2` の未解決点と GL / camera 文脈の制約を記録した
- 期待効果: 次の実装で ARCore blocker に集中できる

## 2026-03-14-009 実装 baseline と device proof

- 対象範囲: 文書体系
- 発生理由: Android recording spine の初回実装と Xperia 5 III 実機確認が完了した
- 反映内容: `MRL-0 -> MRL-1` の到達状態と current state を確定した
- 期待効果: 次の sensor integration を device-backed な前提で進められる

## 2026-03-14-008 iDevelop project placement

- 対象範囲: 文書体系
- 発生理由: companion project の配置規則を source-of-truth に反映した
- 反映内容: `iDevelop/` を sibling project として明記した
- 期待効果: project 境界の記述ぶれを防げる

## 2026-03-14-007 isolated dashboard boundary

- 対象範囲: 文書体系
- 発生理由: companion dashboard project との境界を切る必要が出た
- 反映内容: `iDevelop/` を sibling companion project として位置付けた
- 期待効果: `iSensorium` docs の責務が保ちやすくなる

## 2026-03-14-006 summary 集約

- 対象範囲: 文書体系
- 発生理由: docs 側 summary を 1 ファイルへ集約する方針が必要になった
- 反映内容: `summary.md` に entry を追記する単一形式へ統一した
- 期待効果: docs 側 history の参照先が明確になる

## 2026-03-14-005 docs / develop 境界整理

- 対象範囲: 文書体系
- 発生理由: docs と develop の混線を防ぐ必要が出た
- 反映内容: `docs/` を source-of-truth、`develop/` を実装計画 / 開発履歴として分離した
- 期待効果: 何をどこへ書くかを判断しやすくなる

## 2026-03-14-004 history tree 簡素化

- 対象範囲: 文書体系
- 発生理由: 履歴ツリーが分散し過ぎて追跡しづらかった
- 反映内容: `docs/history/docs/{summary,snapshot}` と `develop/history/{summary,snapshot}` へ整理した
- 期待効果: history path が一貫し、以後の参照が軽くなる

## 2026-03-14-003 open / closed correction

- 対象範囲: 文書体系
- 発生理由: docs 更新の open / closed 境界を補正する必要が出た
- 反映内容: source-of-truth だけを中心に更新する運用へ修正した
- 期待効果: 設計判断と履歴反映を分けて扱える

## 2026-03-14-002 paired history snapshot

- 対象範囲: 文書体系
- 発生理由: summary と snapshot を対で残す必要が明確になった
- 反映内容: docs history に paired summary / snapshot ルールを導入した
- 期待効果: 変更理由と snapshot を同じ entry id で追跡できる

## 2026-03-14-001 agentized doc system

- 対象範囲: 文書体系
- 発生理由: agent 主導で docs を source-of-truth として扱う枠組みを導入した
- 反映内容: docs / develop の責務分離と source-of-truth 運用を明文化した
- 期待効果: 以後の実装と履歴更新の基準を固定できる
## 2026-03-15-013 guarded route 最小復旧

- 対象レイヤ: source-of-truth
- 変更要約: `Use guarded replacement route` の短間隔 toggle crash 解消を current state と UX workflow に反映し、preview live 化の `TextureView` 追加案は Xperia 5 III で shared camera capture session 構成失敗を起こすため撤回した事実を記録した
- 判断根拠: 実機 logcat で `setRenderer has already been called for this instance` と `Failed to create capture session; configuration failed` を確認した
- 影響: guarded replacement route は recording 成立と保存アウトプット整合を維持したまま、未解決 UX blocker を preview live 1 件へ絞って継続する
