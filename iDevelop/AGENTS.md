# AGENTS.md

このサブプロジェクトの運用入口は `docs/index.md` である。`docs/` を source-of-truth とし、`develop/` を開発計画と履歴の管理場所とする。

## Binding Rule

- このディレクトリは companion project だが、計画・実装・テスト・文書更新・検証は `iDevelop/` 配下だけで完結させる。
- companion project `iSensorium/` との境界は、必要なときだけ各 project の文書へ反映する。
- 文書変更は `docs/` に集約する。
- 開発計画と履歴の変更は `develop/` に集約する。
- `docs/` の変更は `docs/history/docs/summary/summary.md` の追記エントリと `docs/history/docs/snapshot/YYYY-MM-DD-XXX/` を対で残す。
- `develop/` の変更は `develop/history/summary/summary.md` の追記エントリと `develop/history/snapshot/YYYY-MM-DD-XXX/` を対で残す。
- release line 計画は `develop/plans/YYYY-MM-DD-XXX/` に置き、対応する develop 履歴 entry id と一致させる。
- plan set / release line の採番は、ユーザーが別指定しない限り直前の番号の次を使う。
- plan、docs、history、current state に書く ID、名称、状態名、成果物名、データ名は、明示変更がない限り既存表記を再利用する。

## Entry Point

- 文書確認入口: `docs/index.md`
- 開発計画入口: `develop/index.md`
