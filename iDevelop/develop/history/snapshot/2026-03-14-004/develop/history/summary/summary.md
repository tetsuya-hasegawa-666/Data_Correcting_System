# Develop History Summary

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
