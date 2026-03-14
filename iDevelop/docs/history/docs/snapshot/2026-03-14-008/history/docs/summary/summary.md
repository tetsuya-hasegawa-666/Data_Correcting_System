# Docs History Summary

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
