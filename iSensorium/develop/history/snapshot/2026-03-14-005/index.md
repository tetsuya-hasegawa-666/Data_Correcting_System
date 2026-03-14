# Develop Index

このディレクトリは、`docs/` で定義された意味体系と運用規約に従って、実開発の計画と履歴を管理する。

## Governance Principle

- 拡張的変更にオープン:
  新しい開発計画、検証観点、release line 分解を追加できる。
- 修正的変更にクローズ:
  進行中計画の意味を曖昧に差し替えず、履歴と変更文書スナップショットを対で残す。

## Layout

| Layer | File | Purpose |
|---|---|---|
| PlanSet | `develop/plans/YYYY-MM-DD-XXX/` | その時点の release line 計画実体を 2 文書セットで置く |
| HistorySummary | `develop/history/summary/summary.md` | 実開発変更の単一要約履歴 |
| HistorySnapshot | `develop/history/snapshot/README.md` | 実開発変更の変更文書スナップショット |

## Rules

1. release line 計画実体は `develop/plans/YYYY-MM-DD-XXX/` に置く。
2. 1 つの plan set には最低限 `market_release_lines.md` と `micro_release_lines.md` を含める。
3. plan set の `YYYY-MM-DD-XXX` は、対応する develop 履歴 entry id と一致させる。
4. develop の計画文書は `docs/artifact/story_release_map.md` の階層定義に従う。
5. 実開発変更時は `develop/history/summary/summary.md` にエントリを追加する。
6. 同じ変更時点の「変更した文書のみ」を `develop/history/snapshot/YYYY-MM-DD-XXX/` に保存する。
7. 計画文書は docs の意味体系を再定義しない。具体化だけを行う。
8. ルート `develop/` はメインプロジェクト本体と repository 境界管理の計画だけを扱う。
9. `iDevelop/` の feature 計画、実装履歴、検証記録は `iDevelop/develop/` 配下で管理する。
