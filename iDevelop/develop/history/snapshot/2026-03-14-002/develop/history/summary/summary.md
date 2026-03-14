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
