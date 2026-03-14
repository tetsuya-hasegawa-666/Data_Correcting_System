# Develop History Summary

## 2026-03-14-001 corecamera-project-bootstrap

- target_behavior: `iSensorium` を汚染しない clean な replacement-camera workstream を開く
- intended_change: docs、develop entry point、最初の release-line plan set を持つ `coreCamera/` を scaffold する
- background_reason: 凍結済み `CameraX + ARCore` mainline には、`ARCore ON` 下で確認済みの camera-path defect がある
- change_summary: 後の `Camera2 + Shared Camera` implementation に向けて、isolated project boundary と restart-ready planning artifact を作成した
- affected_documents: `coreCamera/docs/index.md`, `coreCamera/develop/index.md`, `coreCamera/develop/plans/2026-03-14-001/market_release_lines.md`, `coreCamera/develop/plans/2026-03-14-001/micro_release_lines.md`
- expected_effect: 次 session で scope を再設定せず、すぐに `coreCamera/` で implementation を始められる

## 2026-03-14-002 full-prestart-documentation-pack

- target_behavior: 将来の session が、不足した governance document なしに直ちに `Camera2 + Shared Camera` implementation を始められるようにする
- intended_change: `coreCamera/` を artifact、process、observability、UX、contract、release-line、handover documents まで `iSensorium` と同等の discipline で拡張する
- background_reason: implementation を別 session に移すなら、薄い scaffold だけでは再開に不十分だった
- change_summary: contract、story map、UX flow、より詳細な observability note、明示的な restart order を追加した
- affected_documents: `coreCamera/docs/`, `coreCamera/develop/`, `coreCamera/SESSION_HANDOVER.md`
- expected_effect: 次 session で context 再構築ではなく implementation 開始に時間を使える

## 2026-03-14-003 shared-camera-skeleton-start

- target_behavior: `iSensorium` に触れずに isolated な `Camera2 + ARCore Shared Camera` 開発を開始する
- intended_change: Android app skeleton、shared-camera lifecycle controller、凍結 compatibility contract、ローカル verification test を追加する
- background_reason: `MRL-1` では、実 output emission や上流 swap planning の前に、制御可能な bootstrap と stop path が必要だった
- change_summary: `shared-camera-session-adapter`、session artifact scaffolding、start/stop lifecycle handling、unit test を実装し、完了済み `mRL-0-*` と `mRL-1-*` を docs に反映した
- affected_documents: `coreCamera/app/`, `coreCamera/docs/index.md`, `coreCamera/docs/artifact/project_contract.md`, `coreCamera/docs/artifact/system_blueprint.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/develop/index.md`, `coreCamera/SESSION_HANDOVER.md`
- expected_effect: 次 session は buildable な isolated shared-camera base の上で、直接 `mRL-2-1` の contract-output implementation に進める

## 2026-03-14-004 contract-compatible-shared-camera-output

- target_behavior: 凍結済み `shared-camera-session-adapter` boundary を壊さずに `MRL-2` を完了する
- intended_change: placeholder だった session output を、実際の shared-camera video、frame-timestamp、pose、manifest emission に置き換える
- background_reason: replacement stack が凍結 mainline と同じ contract-facing artifact を出さない限り、`MRL-3` の continuity validation は意味を持たない
- change_summary: MediaRecorder ベースの `video.mp4`、offscreen-GL の ARCore pose sampling、より詳細な manifest stream state reporting を追加し、source-of-truth/develop restart docs を `MRL-1` から `MRL-2` へ進めた
- affected_documents: `coreCamera/app/`, `coreCamera/docs/index.md`, `coreCamera/docs/artifact/system_blueprint.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/develop/index.md`, `coreCamera/SESSION_HANDOVER.md`
- expected_effect: 次 session は isolated replacement stack の contract-compatible output を用いて `mRL-3-1` continuity comparison を始められる

## 2026-03-15-001 continuity-validation-and-swap-readiness

- target_behavior: captured shared-camera session を、明示的な readiness または blocker を持つ測定可能な continuity evidence に変換して `MRL-3` を完了する
- intended_change: emitted frame と pose timestamp を凍結 baseline に対して分析し、monotonic timebase continuity を検証し、manifest に blocker state を記録し、restart docs を `MRL-4` 向けに更新する
- background_reason: 各 isolated session が、凍結済み `ARCore ON` continuity baseline を上回ったか、なぜまだ blocked なのかを示せない限り、後の adapter planning は正当化できない
- change_summary: continuity analyzer、manifest-level の `swapReadiness` 記録、stop 時の blocker reporting、analyzer unit test、local `.gitignore` を追加し、project を `MRL-2` から `MRL-3` へ進める doc update を行った
- affected_documents: `coreCamera/app/`, `coreCamera/.gitignore`, `coreCamera/docs/index.md`, `coreCamera/docs/artifact/system_blueprint.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/develop/index.md`, `coreCamera/SESSION_HANDOVER.md`, `coreCamera/USER_PREPARATION.md`
- expected_effect: 次 session は real target-device session で blocker を解消するか、blocker を明示したまま `MRL-4` planning を開始できる

## 2026-03-15-002 adapter-plan-and-cutover-definition

- target_behavior: 上流実装に触れずに、後の adapter mapping と reversible cutover step を `coreCamera` 内で凍結して `MRL-4` を完了する
- intended_change: code-backed な adapter-plan metadata を追加し、維持対象 operation binding と cutover gate を定義し、source-of-truth/develop docs を `MRL-3` から `MRL-4` へ進める
- background_reason: `MRL-5` で integration recommendation を出すには、後の swap route がすでに具体化され review 可能である必要がある
- change_summary: `IntegrationCutoverPlanner` を追加し、session manifest に `integrationAdapterPlan` を出力し、adapter-plan unit test を追加し、source-of-truth の adapter integration plan document を作成し、restart/handover docs を `MRL-5` 向けに更新した
- affected_documents: `coreCamera/app/`, `coreCamera/docs/index.md`, `coreCamera/docs/artifact/adapter_integration_plan.md`, `coreCamera/docs/artifact/project_contract.md`, `coreCamera/docs/artifact/story_release_map.md`, `coreCamera/docs/artifact/system_blueprint.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/develop/index.md`, `coreCamera/SESSION_HANDOVER.md`
- expected_effect: 次 session は、凍結済み adapter plan と記録済み blocker state に基づいて `MRL-5-1` integration recommendation を行える

## 2026-03-15-003 markdown-japanese-default-rule

- target_behavior: 後続 session が `.md` file を編集し続ける前に、documentation language の曖昧さをなくす
- intended_change: source-of-truth と process docs に Japanese-first markdown rule を記録する
- background_reason: 言語方針が conversation で明確になり、chat context のみに残すべきではなかった
- change_summary: governance、process、current-state documents に `.md` の言語 rule を追加し、paired history に記録した
- affected_documents: `coreCamera/docs/index.md`, `coreCamera/docs/process/change_protocol.md`, `coreCamera/docs/process/research_operation.md`, `coreCamera/docs/observability/current_state.md`
- expected_effect: 後続 session は再確認なしに、期待される言語で documentation change を継続できる

## 2026-03-15-004 mrl5-integration-recommendation-confirmed

- target_behavior: target-device evidence が揃った replacement path について、integration recommendation を code と docs の両方で固定する
- intended_change: `integrationRecommendation` manifest section、`MRL-5` 状態、external blocker 解消、guarded upstream trial recommendation を develop history に反映する
- background_reason: `MRL-4` までは planning-ready だったが、実機証跡なしでは integrate-or-hold decision を閉じられなかった
- change_summary: CPU recorder finalize と intentional stop handling を安定化し、Xperia 5 III 実機 session `session-20260315-043204` で `MRL-5` を確認し、paired docs/develop history を更新した
- affected_documents: `coreCamera/app/`, `coreCamera/docs/index.md`, `coreCamera/docs/artifact/project_contract.md`, `coreCamera/docs/artifact/system_blueprint.md`, `coreCamera/docs/artifact/story_release_map.md`, `coreCamera/docs/artifact/adapter_integration_plan.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/develop/index.md`, `coreCamera/SESSION_HANDOVER.md`, `coreCamera/USER_PREPARATION.md`
- expected_effect: 後続 session は `mRL-5-1` の再実施なしで、isolated のまま guarded upstream trial 前提の次判断へ進める

## 2026-03-15-005 mrl6-mrl7-sensor-and-trial-package

- target_behavior: replacement stack を camera-only 証跡から full sensor outputs と upstream trial package まで引き上げる
- intended_change: `imu.csv`、`gnss.csv`、`ble_scan.jsonl` の実出力と `upstreamTrialPackage` manifest section を code-backed に固定する
- background_reason: `MRL-5` 完了後も non-camera streams が placeholder のままだと、guarded upstream trial を package 単位で引き渡せなかった
- change_summary: sensor collectors と runtime permissions を追加し、Xperia 5 III 実機 session `session-20260315-044637` と `session-20260315-044922` で `MRL-6` / `MRL-7` を確認し、paired docs/develop history を更新した
- affected_documents: `coreCamera/app/`, `coreCamera/app/src/main/AndroidManifest.xml`, `coreCamera/docs/index.md`, `coreCamera/docs/artifact/project_contract.md`, `coreCamera/docs/artifact/story_release_map.md`, `coreCamera/docs/artifact/system_blueprint.md`, `coreCamera/docs/artifact/adapter_integration_plan.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/develop/index.md`, `coreCamera/SESSION_HANDOVER.md`, `coreCamera/USER_PREPARATION.md`
- expected_effect: 後続 session は `coreCamera/` 内では実装をほぼ閉じた状態で、workspace boundary 許可が出れば上流 trial へ接続できる

## 2026-03-15-005 continuation-window-alignment

- target_behavior: active な market release line の途中で 15 分前後に止まりにくくする
- intended_change: `coreCamera` の source-of-truth、process、develop entry、handover に continuation window rule を追加する
- background_reason: 15 分停止を明示する文書は見当たらなかったが、6 時間上限まで継続する rule が `coreCamera` 側に十分固定されていなかった
- change_summary: `docs/index.md`、`research_operation.md`、`current_state.md`、`develop/index.md`、`SESSION_HANDOVER.md` に continuation window rule を追加し、paired history を更新した
- affected_documents: `coreCamera/docs/index.md`, `coreCamera/docs/process/research_operation.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/develop/index.md`, `coreCamera/SESSION_HANDOVER.md`
- expected_effect: active な MRL がある間は、user block または 6 時間上限に達するまで同一 session で exit criteria 到達まで進めやすくなる
## 2026-03-15-006 rollback-anchor-notice-for-upstream-trial

- target_behavior: guarded upstream trial 開始前に `iSensorium/` rollback 基準を迷わず実行できる
- intended_change: UX check 冒頭へ rollback notice を追加し、develop 側からも current state / handover 経由で anchor を辿れるようにする
- background_reason: 次セッションで `iSensorium/` を編集可能にするには、rollback 手順が chat ではなく文書に固定されている必要がある
- change_summary: `coreCamera/docs/process/UX_check_work_flow.md`、`coreCamera/docs/observability/current_state.md`、`coreCamera/SESSION_HANDOVER.md` に rollback anchor `rollback-isensorium-pre-upstream-trial-2026-03-15-001` を反映した
- affected_documents: `coreCamera/docs/process/UX_check_work_flow.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/SESSION_HANDOVER.md`, `coreCamera/docs/history/docs/summary/summary.md`, `coreCamera/develop/history/summary/summary.md`
- expected_effect: 次セッションの upstream trial 準備で rollback 起点と操作方法を即座に参照できる
## 2026-03-15-007 workspace-document-rule-centralization

- target_behavior: workspace 共通の文書ルールを `coreCamera` 側文書から一貫して参照できる
- intended_change: root `DOCUMENTATION_RULE.md` を基準にし、`docs/index.md` と `docs/process/*.md` へ参照導線を追加する
- background_reason: 日本語原則や文書ルールの置き場が project ごとに分散すると、`UX_check_work_flow.md` のような言語ぶれが再発しやすい
- change_summary: `coreCamera/docs/index.md`、`coreCamera/docs/process/change_protocol.md`、`coreCamera/docs/process/research_operation.md`、`coreCamera/docs/process/UX_check_work_flow.md` を root 文書ルール参照前提へ更新した
- affected_documents: `DOCUMENTATION_RULE.md`, `AGENTS.md`, `coreCamera/docs/index.md`, `coreCamera/docs/process/change_protocol.md`, `coreCamera/docs/process/research_operation.md`, `coreCamera/docs/process/UX_check_work_flow.md`
- expected_effect: 次回以降の `coreCamera` 文書更新で、workspace 共通ルールと project 固有ルールを混ぜずに運用できる
## 2026-03-15-008 push-rule-and-user-preparation-centralization

- target_behavior: `coreCamera` で生成物を commit / push せず、利用者準備を UX 文書だけで管理できる
- intended_change: root 文書ルールに生成物非 push ルールと利用者準備ルールを追加し、live 文書の `USER_PREPARATION.md` 参照を UX 文書へ集約する
- background_reason: `USER_PREPARATION.md` が live 文書と並走すると情報が重複しやすく、`app/build/` や `.gradle/` の誤 stage も再発しやすい
- change_summary: `coreCamera/docs/process/UX_check_work_flow.md` に利用者準備ノートを統合し、`coreCamera/USER_PREPARATION.md` を削除、関連参照を live 文書から除去した
- affected_documents: `DOCUMENTATION_RULE.md`, `AGENTS.md`, `coreCamera/docs/process/UX_check_work_flow.md`, `coreCamera/docs/index.md`, `coreCamera/develop/index.md`, `coreCamera/docs/observability/current_state.md`, `coreCamera/SESSION_HANDOVER.md`, `coreCamera/README.md`, `coreCamera/docs/process/change_protocol.md`, `coreCamera/docs/process/research_operation.md`
- expected_effect: 次回以降の `coreCamera` 継続時は UX 文書だけを見れば user-side preparation と rollback / UX route をまとめて確認できる
