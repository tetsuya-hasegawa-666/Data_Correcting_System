# Docs History Summary

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
