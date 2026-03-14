# Develop Index

このディレクトリは、`docs/` で定義されたダッシュボード規約に従って、実開発の計画と履歴を管理する。

## Governance Principle

- 新しい feature 計画は release line に従って追加する。
- 変更理由、背景、変更内容要約を履歴として残す。

## Layout

| Layer | File | Purpose |
|---|---|---|
| PlanSet | `develop/plans/YYYY-MM-DD-XXX/` | その時点の release line 計画実体を 2 文書セットで置く |
| HistorySummary | `develop/history/summary/summary.md` | 実開発変更の単一要約履歴 |
| HistorySnapshot | `develop/history/snapshot/README.md` | 実開発変更の変更文書スナップショット |

## Rules

1. release line 計画実体は `develop/plans/YYYY-MM-DD-XXX/` に置く。
2. 1 つの plan set には `market_release_lines.md` と `micro_release_lines.md` を含める。
3. plan set の `YYYY-MM-DD-XXX` は develop 履歴 entry id と一致させる。
4. 実開発変更時は `develop/history/summary/summary.md` にエントリを追加する。
5. 同じ変更時点の「変更した文書のみ」を `develop/history/snapshot/YYYY-MM-DD-XXX/` に保存する。
6. 実開発文書は `docs/` の意味体系を破壊しない。必要なら docs 側変更を先に行う。
