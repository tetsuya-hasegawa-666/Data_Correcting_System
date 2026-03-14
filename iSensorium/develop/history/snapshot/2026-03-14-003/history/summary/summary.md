# Develop History Summary

## 2026-03-14-001 development-history-framework

- target_behavior: 実開発変更の履歴運用
- intended_change: 振る舞い変更の目的、背景理由、変更内容要約を必ず残す方式へ切り替える
- background_reason: 文書体系履歴だけでは、実際の開発判断と振る舞い変更の学習資産が不足する
- change_summary: 実開発専用の履歴レイヤと、変更した文書のみを保存するスナップショットレイヤを追加した
- affected_documents: `docs/index.md`, `docs/process/change_protocol.md`, `docs/process/research_operation.md`, `docs/history/develop/summary/README.md`, `docs/history/develop/snapshot/README.md`
- expected_effect: 今後の機能変更で、目的、背景、具体変更を短く比較できるようになる

## 2026-03-14-002 initial-release-line-plans

- target_behavior: 実開発計画の初期配置
- intended_change: docs で定義した意味体系に沿って Market Release Line と Micro Release Line の計画文書を develop 側に配置する
- background_reason: 規約と実開発計画を分離しつつ、次スレッドから具体的な実装計画へ接続できる状態が必要になった
- change_summary: develop の入口文書、履歴 README、release line 計画文書を追加し、docs/develop の責務境界に沿った初期計画面を作成した
- affected_documents: `develop/index.md`, `develop/history/summary/README.md`, `develop/history/snapshot/README.md`, `develop/plans/2026-03-14-002/market_release_lines.md`, `develop/plans/2026-03-14-002/micro_release_lines.md`
- expected_effect: 次の実装スレッドで、Market と Micro の両ラインを参照しながら実装順序と検証順序を決められる
