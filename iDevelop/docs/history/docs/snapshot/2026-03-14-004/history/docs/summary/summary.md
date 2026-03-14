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
