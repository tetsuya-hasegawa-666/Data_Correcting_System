# Development Change

- date: 2026-03-14
- target_behavior: 実開発変更の履歴運用
- intended_change: 振る舞い変更の目的、背景理由、変更内容要約を必ず残す方式へ切り替える
- background_reason: 文書体系履歴だけでは、実際の開発判断と振る舞い変更の学習資産が不足する
- change_summary: 実開発専用の履歴レイヤと、変更した文書のみを保存するスナップショットレイヤを追加した
- affected_documents: `docs/index.md`, `docs/process/change_protocol.md`, `docs/process/research_operation.md`, `docs/development_history/README.md`, `docs/development_snapshots/README.md`
- expected_effect: 今後の機能変更で、目的、背景、具体変更を短く比較できるようになる
