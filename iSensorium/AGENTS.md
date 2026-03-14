# AGENTS.md

このプロジェクトにおける運用規約の入口は `docs/index.md` である。
`docs/` は source-of-truth と運用規約を扱い、`develop/` は実開発の計画と履歴を扱う。

## Binding Rule

- 規約変更は `docs/` に反映する。
- 実開発計画や変更記録は `develop/` に反映する。
- `docs/` の変更は `docs/history/docs/summary/summary.md` の対応エントリと `docs/history/docs/snapshot/YYYY-MM-DD-XXX/` を対で残す。
- `develop/` の変更は `develop/history/summary/summary.md` の対応エントリと `develop/history/snapshot/YYYY-MM-DD-XXX/` を対で残す。
- release line 計画実体は `develop/plans/YYYY-MM-DD-XXX/` に置き、対応する develop 履歴 entry id と一致させる。

## Entry Point

- 規約確認: `docs/index.md`
- 実開発確認: `develop/index.md`
