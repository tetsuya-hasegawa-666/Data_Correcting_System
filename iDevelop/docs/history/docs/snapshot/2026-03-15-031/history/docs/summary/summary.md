# Docs History Summary

## 2026-03-15-031 document-explorer-rebalance-line

- scope: dashboard documentation system
- trigger: the user requested a new MRL for moving unlock/draft guidance into preview, restoring a 1/4 search pane, and replacing the flat document list with an explorer-style tree
- resulting_direction: `current_state.md` now records `MRL-18` completion and the preview-side action split, while the develop plan/history track the new release line and closure
- expected_benefit: document consultation and drafting decisions are made in the preview context, while search stays compact and navigable

## 2026-03-15-030 local-draft-ux-clarification

- scope: dashboard documentation system
- trigger: post-completion UX clarification was implemented for ambiguous read-only unlock behavior, consultation guidance, compact header layout, and preview overflow handling
- resulting_direction: `current_state.md` now defines `local draft` unlock semantics and compact header behavior, while `UX_check_work_flow.md` now validates unlock wording, consultation capability explanation, and overflow-safe layout
- expected_benefit: the completed consultation workspace stays understandable in actual operation, especially when live sources start read-only and editing must be re-enabled smoothly

## 2026-03-15-029 shared-shell-to-pilot-closure

- scope: dashboard documentation system
- trigger: `2026-03-15-005 / MRL-13` から `MRL-17` までを閉じるため、shared shell、code gate、proposal/action、safe apply、pilot evidence を source-of-truth に反映する必要が生じた
- resulting_direction: `system_blueprint.md` を completed phase へ更新し、`UX_check_work_flow.md` に shared shell / code / apply 手順を追加し、`research_operation.md` に `MRL-13` から `MRL-17` の TDD evidence を反映し、`current_state.md`、`UX_evidence_log.md`、plan を completed 状態へ進めた
- expected_benefit: consultation workspace の completed baseline が docs で固定され、次 plan set を completed 状態から起動できる

## 2026-03-15-028 data-consultation-line

- scope: dashboard documentation system
- trigger: `2026-03-15-005 / MRL-12` を閉じるため、data consultation の UX と次 target を source-of-truth に反映する必要が生じた
- resulting_direction: `UX_check_work_flow.md` に data consultation 手順を追加し、`research_operation.md` の data TDD task set を green 化し、`current_state.md` と plan を `MRL-13` 開始状態へ更新した
- expected_benefit: 次セッションが shared conversation shell の failing test から開始でき、document/data consultation の完了条件が揃う

## 2026-03-15-026 document-consultation-line

- scope: dashboard documentation system
- trigger: `2026-03-15-005 / MRL-11` を閉じるため、document consultation の UX と次 target を source-of-truth に反映する必要が生じた
- resulting_direction: `UX_check_work_flow.md` に document consultation 手順を追加し、`research_operation.md` の TDD task set を green 化し、`current_state.md` と plan を `MRL-12` 開始状態へ更新した
- expected_benefit: 次セッションが data consultation の failing test から開始でき、document consultation の完了条件が docs でぶれなくなる

## 2026-03-15-025 interaction-contract-line

- scope: dashboard documentation system
- trigger: `2026-03-15-005 / MRL-10` を閉じるため、consultation scenario、contract、approval state、TDD task set を source-of-truth に固定する必要が生じた
- resulting_direction: `north_star.md` に BDD story を追加し、`project_contract.md` と `system_blueprint.md` に consultation contract を追加し、`research_operation.md` に TDD task set を追加し、`current_state.md` と plan を `MRL-11` 開始状態へ進めた
- expected_benefit: 次セッションが document consultation の failing test から開始でき、interaction contract の再設計なしに must scope 実装へ直行できる

## 2026-03-15-024 consultation-workspace-redirection

- scope: dashboard documentation system
- trigger: `iDevelop` の価値を read-only dashboard ではなく user-Codex consultation workspace として再定義し、新しい release line 計画が必要になった
- resulting_direction: `north_star.md` `system_blueprint.md` `project_contract.md` `current_state.md` を consultation-first に更新し、次 plan set `2026-03-15-005` の起点を固定した
- expected_benefit: 次の実装が閲覧中心の延長ではなく、相談体験の中核へ一直線につながる

## 2026-03-14-023 ux-check-consolidation

- scope: dashboard documentation system
- trigger: `UX_check_work_flow.md` を全体 UX 確認の単一 source-of-truth に戻し、pilot 系の重複文書を統合する必要が生じた
- resulting_direction: `UX_check_work_flow.md` に checklist / run / rollback を統合し、`pilot_setup_checklist.md` `pilot_runbook.md` `rollback_note.md` `pilot_handoff.md` を削除、evidence は `UX_evidence_log.md` に統一し、`docs/index.md` と `current_state.md` を整合させた
- expected_benefit: 体験確認の導線が 1 本に集約され、文書乱立による迷いを防げる

## 2026-03-14-022 pilot-operation-line

- scope: dashboard documentation system
- trigger: `2026-03-14-004 / MRL-9` の pilot operation line を閉じるため、setup / runbook / rollback / evidence / handoff を source-of-truth に追加する必要が生じた
- resulting_direction: `docs/index.md` `current_state.md` に completed state を反映し、pilot checklist / runbook / rollback / evidence / handoff 文書を追加した
- expected_benefit: `2026-03-14-004` を completed plan set として閉じ、新 plan set へ迷わず移行できる

## 2026-03-14-021 generic-code-entry-line

- scope: dashboard documentation system
- trigger: `2026-03-14-004 / MRL-8` の generic code entry line を実装し、codeRoots と live code browse の現在地を source-of-truth へ反映する必要が生じた
- resulting_direction: `project_contract.md` `system_blueprint.md` `current_state.md` `UX_check_work_flow.md` `market_release_lines.md` `micro_release_lines.md` を `MRL-8` 完了前提へ更新し、次 target を `MRL-9 / mRL-9-1` に進めた
- expected_benefit: 次セッションが pilot operation line から開始でき、code workspace の contract と live browse 状態が文書でぶれなくなる

## 2026-03-14-020 change-tracking-line

- scope: dashboard documentation system
- trigger: `2026-03-14-004 / MRL-7` の change tracking line を実装し、status / evidence / 次 target を source-of-truth へ反映する必要が生じた
- resulting_direction: `current_state.md` `UX_check_work_flow.md` `market_release_lines.md` `micro_release_lines.md` を `MRL-7` 完了前提へ更新し、次 target を `MRL-8 / mRL-8-1` に進めた
- expected_benefit: 次セッションが code/script contract の slice から開始でき、refresh / stale / evidence の現在地が文書でぶれなくなる

## 2026-03-14-019 live-document-data-read-line

- scope: dashboard documentation system
- trigger: `2026-03-14-004 / MRL-6` の live document/data read line を実装し、source-of-truth を実装事実へ合わせる必要が生じた
- resulting_direction: `current_state.md` `UX_check_work_flow.md` `market_release_lines.md` を live read / read-only / refresh UX / 次 target `MRL-7` へ更新した
- expected_benefit: 次セッションが stale tracking line から開始でき、manual UX check と current state の齟齬が消える

## 2026-03-14-018 release-line-renumber-correction

- scope: dashboard documentation system
- trigger: `2026-03-14-004` の release line は連番規則に従い `MRL-5` 開始であるべきと判明した
- resulting_direction: plan set、system blueprint、current state、history の MRL / mRL 番号を `MRL-5` 開始へ修正し、`MRL-5` 完了後の current target を `MRL-6 / mRL-6-1` にそろえた
- expected_benefit: 連番運用ルールと active plan の現在位置が一致し、次の実装開始点がぶれない

## 2026-03-14-017 generic-project-contract-line

- scope: dashboard documentation system
- trigger: `2026-03-14-004 / MRL-5` の generic project contract line を source-of-truth 文書で閉じた
- resulting_direction: `project_contract.md`、`north_star.md`、`system_blueprint.md`、`UX_check_work_flow.md`、`current_state.md` を更新し、next target を `MRL-6 / mRL-6-1` に進めた
- expected_benefit: 次セッションで filesystem repository と recursive live read 実装に直行できる

## 2026-03-14-016 sequence-and-data-stability-rule

- scope: dashboard documentation system
- trigger: release line は連番採番、記載データは既存表記を継続利用するという全体運用ルールが追加された
- resulting_direction: workspace governance と `iDevelop` の docs / develop ルールを正規化し、採番規則と記載データ継続利用規則を source-of-truth に固定した
- expected_benefit: 以後の plan set と履歴更新で命名揺れや飛び番を避け、一貫した release line 運用を維持できる

## 2026-03-14-015 live-connection-plan-activation

- scope: dashboard documentation system
- trigger: dummy UX 検証を通過したため、実体接続から本番仮運用へ進む新 plan set を active に切り替えた
- resulting_direction: `current_state.md` を `2026-03-14-004` 前提へ更新し、next validation point を generic project contract 定義へ移した
- expected_benefit: 次セッションの最初の判断が release line と矛盾せず、実体接続へ直行できる

## 2026-03-14-014 mrl5-ux-alignment

- scope: dashboard documentation system
- trigger: MRL-5 に向けた UX 是正として、日本語 UI、tab 動作、cancel 挙動、体験手順を現行実装へ合わせた
- resulting_direction: `current_state.md` を最新状態へ更新し、`UX_check_work_flow.md` を現行 UI の確認手順へ刷新した
- expected_benefit: manual UI check の入口がぶれず、MRL-6 の evidence 取得へそのまま進める

## 2026-03-14-001 dashboard-doc-bootstrap

- scope: dashboard documentation system
- trigger: ダッシュボード project を main project と分離した subproject として立ち上げる要求が入った
- resulting_direction: サブプロジェクト内に独立した docs/source-of-truth を先置きし、保存形式、MVC、BDD、TDD、拡張性を中核前提として構成した。
- expected_benefit: 次スレッドからダッシュボード固有の設計と実装を、main project を壊さずに継続できる。

## 2026-03-14-002 idevelop-rename-placement

- scope: dashboard documentation system
- trigger: ダッシュボード project 名を `iDevelop` として sibling 配置へ揃える要求が入った
- resulting_direction: project 名、ディレクトリ名、north star の対象記述を `iDevelop` 基準へ揃え、companion project `iSensorium` との境界を明示する構造へ寄せた。
- expected_benefit: dashboard project の識別が明確になり、`iSensorium` との役割分担と参照整合が取りやすくなる。

## 2026-03-14-003 pre-implementation-reset

- scope: dashboard documentation system
- trigger: 実開発は別セッションで新規開始する前提で、現在の文書全体を再整合する必要が生じた
- resulting_direction: source-of-truth を「今すぐ実装する plan」から「次セッションで迷わず実装開始できる handoff 文書」へ寄せ直した。
- expected_benefit: 次の実装セッションで、命名や境界の再確認に時間を使わず、must scope の設計と実装に直行できる。

## 2026-03-14-004 document-workspace-first-slice

- scope: dashboard documentation system
- trigger: active plan set `2026-03-14-002` を基準に、最初の must scope 実装 slice を確定して即時着手した
- resulting_direction: `document-workspace` の first slice を一覧・検索・プレビューとして source-of-truth に固定し、pre-implementation 前提の記述を実装開始済みの状態へ更新した。
- expected_benefit: 次の継続セッションで data workspace を追加する際も、document slice の BDD/TDD 基準と optional scope の defer 判断を再利用できる。

## 2026-03-14-005 data-workspace-first-slice

- scope: dashboard documentation system
- trigger: must scope を次の market release line 直前まで進めるため、data workspace の最小 slice を追加した
- resulting_direction: dataset 一覧・status 集計・軽量 chart と sample data contract を source-of-truth に固定し、must scope 完了時点を `MRL-3` 手前として整理した。
- expected_benefit: optional scope の code/debug 判定へ進む前に、文書画面とデータ画面の両 must scope が green/build 済みの基準として残る。

## 2026-03-14-006 optional-scope-phase-gate

- scope: dashboard documentation system
- trigger: 次の market release line に入る前に、optional scope の code/debug workspace を採否判定する必要が生じた
- resulting_direction: `code-workspace` を今回のラインでは defer とし、将来 entry 時の read-only / path 制約 / no process attach を source-of-truth に固定した。
- expected_benefit: must scope を守ったまま optional scope の拡大条件を明確化でき、次の handoff で安全境界を再利用できる。

## 2026-03-14-007 handoff-line-closure

- scope: dashboard documentation system
- trigger: active plan set `2026-03-14-002` を完了状態で閉じるため、handoff 条件を固定する必要があった
- resulting_direction: next first target、最初の TDD 順序、停止条件、未解決事項を current state の handoff note に集約した。
- expected_benefit: 次セッションが document edit/save の failing test から迷わず再開できる。

## 2026-03-14-008 execution-plan-activation

- scope: dashboard documentation system
- trigger: handoff 完了後に、設計構想を実装へ進める新しい release line 文書が必要になった
- resulting_direction: active plan set を `2026-03-14-003` へ切り替え、current state の起点を document edit/save slice へ更新した。
- expected_benefit: 実装再開時に handoff 文書ではなく execution-oriented plan を直接参照できる。

## 2026-03-14-009 entry-command-ui-check-rule

- scope: dashboard documentation system
- trigger: 最終到達時にユーザーが entry command で dashboard を開き、UI を操作しながら確認できることを明示する必要が生じた
- resulting_direction: entry command を `npm run dashboard` に固定し、release line の exit に UI exploratory check を含める方針を追加した。
- expected_benefit: 実装完了の解釈が揃い、ユーザーが起動・操作して確認できる状態を plan で担保しやすくなる。

## 2026-03-14-010 execution-lines-implemented

- scope: dashboard documentation system
- trigger: execution-oriented plan に沿って document/data/code/shared-core の主要実装を進めた
- resulting_direction: current state と blueprint を、edit/save、localStorage source policy、data update、read-only code entry まで実装済みの状態へ更新した。
- expected_benefit: 次の validation が manual UI exploratory check と persistence 深掘りに絞られる。

## 2026-03-14-011 windows-beginner-manual

- scope: dashboard documentation system
- trigger: Windows 初心者でもテストと体験操作ができる実行マニュアルが必要になった
- resulting_direction: PowerShell 起動、`npm install`、`npm test`、`npm run build`、`npm run dashboard`、UI 操作確認、終了手順を 1 本の手順へ整理した。
- expected_benefit: 非開発者寄りの利用者でも dashboard の起動と基本確認を自力で行いやすくなる。

## 2026-03-14-012 ux-check-manual-rename

- scope: dashboard documentation system
- trigger: 体験確認マニュアルのファイル名を `UX_check_work_flow.md` へ統一する必要が生じた
- resulting_direction: 入口文書と README の参照先を新しいファイル名へ揃えた。
- expected_benefit: 実ファイル名と案内文書の不一致がなくなり、起動手順を迷わず辿れる。

## 2026-03-14-013 release-line-review-alignment

- scope: dashboard documentation system
- trigger: release line 計画と current state の整合を見直し、UX_check_work_flow 同期ルールを組み込む必要が生じた
- resulting_direction: stale な risk/handoff を整理し、各 market line の成果物へ `UX_check_work_flow.md` 更新責務を追加した。
- expected_benefit: 実装状態、release line、体験確認導線の 3 つが同じ完了条件で読める。

## 2026-03-15-027 continuation-window-alignment

- scope: dashboard documentation system
- trigger: 継続作業が約 15 分で止まりやすく、active な market release line 完了前に handoff 寄りの読み方へ流れる衝突を解消する必要が生じた
- resulting_direction: active な market release line は user block または 6 時間上限まで継続する規約を source-of-truth へ追加し、current state の handoff note を continuation note として再定義した。
- expected_benefit: 15 分前後で任意停止せず、同一 MRL の exit criteria 到達まで自律継続しやすくなる。
## 2026-03-15-028 workspace-document-rule-centralization

- scope: dashboard documentation system
- trigger: workspace 共通の日本語文書方針と文書ルール参照先を 1 か所へ集約し、`UX_check_work_flow.md` の英語残りを解消する必要が出た
- resulting_direction: root `DOCUMENTATION_RULE.md` を追加し、`iDevelop/docs/index.md` と `docs/process/*.md` をその参照前提へ更新し、`UX_check_work_flow.md` を日本語へ統一した
- expected_benefit: `iDevelop` 文書が workspace 共通ルールへ一貫して従い、UI 検証手順も日本語で読みやすくなる
## 2026-03-15-029 push-rule-and-user-preparation-centralization

- scope: dashboard documentation system
- trigger: workspace 共通で生成物非 push ルールと利用者準備の UX 文書集約ルールを固定する必要が出た
- resulting_direction: root `DOCUMENTATION_RULE.md` に共通ルールを追加し、`iDevelop/docs/process/UX_check_work_flow.md` も同じ利用者準備ノート構成へ揃えた
- expected_benefit: project をまたいでも同じ文書構造で user-side preparation と push ルールを参照できる
