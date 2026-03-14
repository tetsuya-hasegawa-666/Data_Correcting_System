# Develop History Summary

## 2026-03-14-018 pilot-operation-line-closure

- target_behavior: `MRL-9` を pilot operation line として閉じる
- intended_change: setup checklist、pilot runbook、rollback note、evidence log、handoff pack を completed state と一緒に固定する
- background_reason: `MRL-8` までで live generic dashboard は完成していたため、最後は pilot 運用に必要な文書パックと completion state をそろえる必要があった
- change_summary: pilot 用 docs を追加し、`current_state.md` と `2026-03-14-004` plan を completed 状態に更新した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: 次セッションは新 plan set 作成から開始できる

## 2026-03-14-017 generic-code-entry-implementation

- target_behavior: `MRL-8` を generic code entry line として閉じる
- intended_change: codeRoots recursive read、live code browse、read-only code policy 表示を追加する
- background_reason: `MRL-7` までで document/data の live read と change tracking は閉じたため、optional scope の code browse を generic contract へ接続する必要があった
- change_summary: snapshot loader に codeTargets を追加し、manifest の `codeRoots` を live browse に接続し、code workspace の source policy / kind / updatedAt 表示を追加して `npm test` と `npm run build` を通した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: 次の target を `MRL-9 / mRL-9-1` に進め、pilot setup / rollback / evidence pack の整理へ着手できる

## 2026-03-14-016 change-tracking-implementation

- target_behavior: `MRL-7` を change tracking line として閉じる
- intended_change: stale indicator、refresh evidence、async refresh flow を dashboard shell に追加する
- background_reason: `MRL-6` では live read と read-only 表示までは閉じたが、refresh 後の差分判断と evidence が未実装だった
- change_summary: bootstrap metadata、source signature、localStorage evidence、status strip、refresh handling を追加し、`npm test` `npm run build` `/api/dashboard/live-state` を通した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: 次の target を `MRL-8 / mRL-8-1` に進め、code/script live browse の contract へ着手できる

## 2026-03-14-015 live-document-data-read-implementation

- target_behavior: `MRL-6` を live document/data read line として閉じる
- intended_change: manifest-based snapshot loader、Vite live route、read-only repository wiring、refresh UX を実装する
- background_reason: `MRL-5` で generic contract は閉じたため、次は実体 project の document/data を read-only で扱える状態まで進める必要があった
- change_summary: recursive filesystem scan と live bootstrap を追加し、document/data の UI を read-only live source 対応へ更新し、`npm test` と `npm run build` を green にした
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: 次の target を `MRL-7 / mRL-7-1` に進め、refresh policy と stale tracking の設計へ直結できる

## 2026-03-14-014 release-line-renumber-correction

- target_behavior: active plan set の release line 番号が連番規則と一致している
- intended_change: `2026-03-14-004` の market / micro release 番号を `MRL-5` 開始へ修正する
- background_reason: user 指摘により、新 plan set でも release line は前回の続き番号を使う必要があると確認された
- change_summary: `market_release_lines.md`、`micro_release_lines.md`、関連 docs の current target 表記を `MRL-5` 開始へ振り直した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: `MRL-5` 完了後の次ターゲットが `MRL-6 / mRL-6-1` として一貫する

## 2026-03-14-013 sequence-and-data-stability-rule

- target_behavior: 今後の release line 計画を飛び番や命名揺れなく継続できる
- intended_change: plan set 採番を連番固定とし、ID、名称、状態名、成果物名、データ名の継続利用を develop 規約へ追加する
- background_reason: user 指示により、release line 運用を今後も同じ記載データで安定継続する必要が生じた
- change_summary: `develop/index.md` と active plan set に採番規則と記載データ継続利用規則を追加した
- affected_documents: `develop/history/summary/summary.md`, `develop/index.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: 次回以降の plan set でも同一 naming と sequence rule を前提に安全に継続できる

## 2026-03-14-012 live-connection-plan-set

- target_behavior: 実体接続から本番仮運用までを release line で管理できる
- intended_change: `2026-03-14-004` plan set を追加し、generic contract / live read / change tracking / pilot operation を段階化する
- background_reason: dummy dashboard の UX は評価可能になったため、次は変化し続ける実体 project への接続計画が必要になった
- change_summary: 新しい market/micro release line 文書を追加し、`current_state.md` を新 active set に切り替えた
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: 次の実装は `mRL-5-1` の project manifest contract から迷わず開始できる

## 2026-03-14-011 mrl5-ux-fix-implementation

- target_behavior: MRL-5 の read-only entry を評価可能な UX まで引き上げる
- intended_change: 日本語 UI、tab 動作、cancel UX、dummy data 体験をコード実装と検証結果へ反映する
- background_reason: user exploratory check で `データ` `コード` tab 不動作と document cancel 不足が見つかり、全体評価を止めていた
- change_summary: controller/view/test を更新し、`npm test` と `npm run build` を green に戻した
- affected_documents: `develop/history/summary/summary.md`
- expected_effect: 次は manual UI check の evidence 取得だけに集中できる

## 2026-03-14-001 codex-dashboard-bootstrap-plan

- target_behavior: ダッシュボード用サブプロジェクトの初期実開発計画
- intended_change: 独立した release line 計画と履歴入口を配置する
- background_reason: 実装に入る前に、文書画面、データ画面、optional なコード画面の進め方をサブプロジェクト内で追跡できる状態が必要
- change_summary: `develop/index.md` と初期 plan set を追加し、ダッシュボード専用の実開発管理面を作成した
- affected_documents: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-001/market_release_lines.md`, `develop/plans/2026-03-14-001/micro_release_lines.md`
- expected_effect: 次スレッドから dashboard feature をこの配下だけで分解し、変更を追跡できる

## 2026-03-14-002 pre-implementation-release-reset

- target_behavior: 次セッション開始前の release line 再設計
- intended_change: `iDevelop` の実開発計画を、即時実装前提から pre-implementation handoff 前提へ組み直す
- background_reason: 現セッションでは実装に入らず、次セッションで新規に開発開始するため、実行前提の plan だと粒度と順序が合わない
- change_summary: readiness milestone 中心の新しい plan set を `develop/plans/2026-03-14-002/` に追加し、current state と入口規約を次セッション向けに合わせ直した
- affected_documents: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-002/market_release_lines.md`, `develop/plans/2026-03-14-002/micro_release_lines.md`
- expected_effect: 次の実装セッションで、開始条件、must scope、optional scope 判定、TDD 入口を順に確認しながら着手できる

## 2026-03-14-003 first-document-slice-implementation

- target_behavior: `document-workspace` の最初の must scope 実装 slice を成立させる
- intended_change: `mRL-4-1` と `mRL-4-2` を、shared-core bootstrap と document search/preview 実装で閉じる
- background_reason: `src/` と `data/` が空のままでは market release line の kickoff 条件が具体的な実装順へ接続されず、次の data workspace へ進む足場もできない
- change_summary: Vite + TypeScript + Vitest の最小基盤、seed document、`document-workspace` MVC、BDD/TDD を反映した plan/current state 更新を追加した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-002/market_release_lines.md`, `develop/plans/2026-03-14-002/micro_release_lines.md`
- expected_effect: document slice の green/build 済み起点から、次の `mRL-2-2` data workspace story へ継続できる

## 2026-03-14-004 first-data-slice-implementation

- target_behavior: `data-workspace` の最初の must scope 実装 slice を成立させる
- intended_change: `mRL-2-2` と `mRL-2-3` を、dataset 一覧・status 集計・軽量 chart 実装で閉じる
- background_reason: must scope が文書画面だけでは market release line `MRL-2` を完了できず、optional scope 判定へ進む前提が不足していた
- change_summary: static dataset seed、`data-workspace` MVC、controller/view テスト、must scope 完了時点の plan/current state 更新を追加した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-002/market_release_lines.md`, `develop/plans/2026-03-14-002/micro_release_lines.md`
- expected_effect: must scope 完了済みの状態で停止し、次の `mRL-3-1` optional scope phase gate へ明確に接続できる

## 2026-03-14-005 optional-scope-gate-decision

- target_behavior: `MRL-3` の optional scope 判定を完了する
- intended_change: `mRL-3-1` と `mRL-3-2` を、defer 判断と安全境界固定で閉じる
- background_reason: must scope 完了後に code/debug workspace を無条件で追加すると、境界未定義のまま slice が肥大化する
- change_summary: `code-workspace` を今回のラインから外し、future entry 条件を read-only path policy と no process attach に限定して docs/develop/current state を更新した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-002/market_release_lines.md`, `develop/plans/2026-03-14-002/micro_release_lines.md`
- expected_effect: 次の `mRL-4-1` handoff 整理へ入る前に、optional scope の採否理由と安全条件が一意に残る

## 2026-03-14-006 handoff-line-closure

- target_behavior: `MRL-4` の handoff line を完了する
- intended_change: `mRL-4-1` から `mRL-4-3` を、next slice・TDD 順序・停止条件の固定で閉じる
- background_reason: must scope と optional scope の判断後も、次セッションの実装再開点が散らばったままだと kickoff コストが残る
- change_summary: current state に handoff note を追加し、plan set `2026-03-14-002` を完了扱いへ更新した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-002/market_release_lines.md`, `develop/plans/2026-03-14-002/micro_release_lines.md`
- expected_effect: 新しい plan set を切る前に、document edit/save slice から再開するための判断材料が一箇所に揃う

## 2026-03-14-007 execution-release-line-construction

- target_behavior: 設計構想を実現するための新しい release line 文書を構築する
- intended_change: handoff 完了済みの `2026-03-14-002` に代えて、execution-oriented な `2026-03-14-003` plan set を追加する
- background_reason: 既存 plan set は handoff 目的で完了しており、実装継続の順序を表す新しい release line が必要になった
- change_summary: document authoring、source sync、data workflow、shared-core hardening、optional read-only entry、integrated readiness の market line と、それを支える micro line を新設した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-003/market_release_lines.md`, `develop/plans/2026-03-14-003/micro_release_lines.md`
- expected_effect: 次の実装セッションで `mRL-1-1` から設計構想の実現ラインに沿って着手できる

## 2026-03-14-008 entry-command-ui-check-rule

- target_behavior: release line 完了時にユーザーが dashboard を起動して UI 操作確認できる前提を固定する
- intended_change: execution-oriented plan と package script に entry command / exploratory check を組み込む
- background_reason: plan だけでは「最後まで到達したときの利用可能状態」が曖昧で、実装完了の定義がずれる余地があった
- change_summary: `npm run dashboard` と `npm run preview` を追加し、market/micro release の exit criteria に UI exploratory check を明記した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-003/market_release_lines.md`, `develop/plans/2026-03-14-003/micro_release_lines.md`
- expected_effect: 設計構想の実現ラインが、最終的にユーザー操作可能な dashboard 提供まで含む計画として読める

## 2026-03-14-009 execution-lines-implemented

- target_behavior: execution-oriented plan の主要 market line を実装へ反映する
- intended_change: document edit/save、source policy、data update、shared navigation、read-only code entry を追加する
- background_reason: release line 文書だけでは設計構想の成立条件がまだ実装で裏付けられていなかった
- change_summary: localStorage ベースの document/data repository、edit/save UI、dataset update/result summary、workspace tabs、error banner、read-only code workspace を追加し、entry command 起動まで確認した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-003/market_release_lines.md`, `develop/plans/2026-03-14-003/micro_release_lines.md`
- expected_effect: `MRL-6` は manual UI exploratory check を残すだけの段階まで進み、次の plan は persistence 深掘りへ集中できる

## 2026-03-14-010 release-line-review-alignment

- target_behavior: release line 計画と current state の矛盾を解消する
- intended_change: `MRL-5` と `MRL-6` の完了条件、evidence、UX_check_work_flow 更新責務を明確化する
- background_reason: 実装済み内容に対して stale な risk/handoff が残っており、line 完了判定がずれる状態だった
- change_summary: market/micro release line に `UX_check_work_flow.md` を成果物として追加し、current state の risk/handoff を実装実態へ更新した
- affected_documents: `develop/history/summary/summary.md`, `develop/plans/2026-03-14-003/market_release_lines.md`, `develop/plans/2026-03-14-003/micro_release_lines.md`
- expected_effect: 次の新 plan set で UX 改修や汎用化を始める前に、現行 line の完了条件を一意に読める
