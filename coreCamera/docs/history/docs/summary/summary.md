# Docs History Summary

## 2026-03-14-001 corecamera-project-bootstrap

- scope: documentation system
- trigger: `iSensorium` に干渉しない `Camera2 + Shared Camera` replacement work 用の別 thread を開く必要があった
- resulting_direction: source-of-truth と develop の entry point を持つ isolated sibling project として `coreCamera/` を scaffold した
- expected_benefit: 次 session で、同じ release-line discipline を維持したまま replacement-camera work をすぐ始められる

## 2026-03-14-002 full-prestart-documentation-pack

- scope: documentation system
- trigger: isolated project でも、`iSensorium` と同じ governance precision、handover quality、UX/test guidance level が必要だった
- resulting_direction: contract、story map、user preparation、restart order、UX check workflow、より詳細な handover/current-state documents を持つよう `coreCamera/` を拡張した
- expected_benefit: 次 session で project context を作り直さず、直接 `Camera2 + Shared Camera` implementation を始められる

## 2026-03-14-003 shared-camera-skeleton-start

- scope: documentation system
- trigger: isolated implementation が始まり、凍結 contract と adapter seam が具体的な project truth になった
- resulting_direction: source-of-truth に `shared-camera-session-adapter`、完了済み `mRL-0-*` / `mRL-1-*`、および `MRL-1` への移行を記録した
- expected_benefit: 次 session では current implementation status と compatibility rule を再定義せずに `mRL-2-1` から継続できる

## 2026-03-14-004 contract-compatible-output-implemented

- scope: documentation system
- trigger: isolated shared-camera code が、contract-facing な実際の video、frame-timestamp、pose、manifest output を出力するようになった
- resulting_direction: source-of-truth に `MRL-2`、完了済み `mRL-2-*`、および次の validation が `MRL-3` に進んだことを記録した
- expected_benefit: 次 session は output shape assumptions を作り直さずに continuity validation を開始できる

## 2026-03-15-001 continuity-validation-and-readiness-recording

- scope: documentation system
- trigger: isolated shared-camera sessions が、凍結 baseline に対する continuity 評価と manifest への `swapReadiness` または blocker 記録を行うようになった
- resulting_direction: source-of-truth に `MRL-3`、完了済み `mRL-3-*`、および `MRL-4` 前に real target-device capture が 1 回必要であることを明記した
- expected_benefit: 後続 session は validation criteria を再定義せずに、adapter planning または blocker confirmation に直接進める

## 2026-03-15-002 adapter-plan-and-cutover-definition

- scope: documentation system
- trigger: 維持対象の adapter seam と reversible な cutover route を、後の integration decision 前に明示的な source-of-truth にする必要があった
- resulting_direction: source-of-truth に `MRL-4`、完了済み `mRL-4-*`、および後の cutover work 用の固定 adapter-plan document と manifest metadata を記録した
- expected_benefit: 次 session は swap rule を再構築せず、凍結済み plan に基づいて `MRL-5` の integrate-or-abandon decision を行える

## 2026-03-15-003 markdown-japanese-default-rule

- scope: documentation system
- trigger: `.md` file は、意味的に必要な場合を除き日本語で書くべきだと conversation で明確になった
- resulting_direction: source-of-truth と process docs に、chat の暗黙了解ではなく、明示的な Japanese-first markdown rule を持たせた
- expected_benefit: 後続 session は言語方針を再確認したり drift させたりせずに documentation update を継続できる

## 2026-03-15-004 mrl5-integration-recommendation-confirmed

- scope: documentation system
- trigger: Xperia 5 III 実機 session `session-20260315-043204` で `MRL-5` 判定に必要な target-device evidence が揃った
- resulting_direction: source-of-truth に `MRL-5` 完了、external blocker 解消、`integrationRecommendation = RECOMMEND_GUARDED_UPSTREAM_TRIAL` を固定した
- expected_benefit: 後続 session は blocker 解消の再確認ではなく、guarded upstream trial をどう扱うかの判断に集中できる

## 2026-03-15-005 mrl6-mrl7-sensor-and-trial-package

- scope: documentation system
- trigger: Xperia 5 III 実機 session `session-20260315-044637` と `session-20260315-044922` で full sensor integration と upstream trial package が確認できた
- resulting_direction: source-of-truth に `MRL-6` / `MRL-7` 完了、`upstreamTrialPackage = READY`、および実上流 trial には `iSensorium/` 側変更許可が必要という境界を固定した
- expected_benefit: 後続 session は sensor placeholder の再実装なしで、workspace boundary を越えるべきかどうかの判断に進める

## 2026-03-15-005 continuation-window-alignment

- scope: documentation system
- trigger: 15 分前後で継続作業が止まりやすく、`coreCamera` 側に 6 時間上限まで継続する明示ルールが不足していた
- resulting_direction: source-of-truth、process、develop entry、handover に continuation window rule を追加し、active な market release line がある限り 15 分任意停止を前提にしないよう揃えた
- expected_benefit: 次回以降は active な MRL の exit criteria 到達まで同一 session で継続しやすくなり、15 分前後での premature stop を避けやすくなる
## 2026-03-15-006 rollback-anchor-notice-for-upstream-trial

- scope: documentation system
- trigger: `iSensorium/` 変更許可の前提として guarded upstream trial 前の rollback 指示を source-of-truth に固定する必要が出た
- resulting_direction: `coreCamera/docs/process/UX_check_work_flow.md` 先頭に理由付き rollback notice を追加し、`current_state` と handover に anchor tag と参照先を明記した
- expected_benefit: 次セッションで `iSensorium/` を触る前に rollback 基準と指示方法を即座に参照できる
