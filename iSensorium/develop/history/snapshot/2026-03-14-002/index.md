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
| Plan | `develop/plans/market_release_lines.md` | Market Release Line 計画 |
| Plan | `develop/plans/micro_release_lines.md` | Micro Release Line 計画 |
| History | `develop/history/summary/README.md` | 実開発変更の要約履歴 |
| Snapshot | `develop/history/snapshot/README.md` | 実開発変更の変更文書スナップショット |

## Rules

1. develop の計画文書は `docs/artifact/story_release_map.md` の階層定義に従う。
2. 実開発変更時は `develop/history/summary/` に履歴を追加する。
3. 同じ変更時点の「変更した文書のみ」を `develop/history/snapshot/` に保存する。
4. 計画文書は docs の意味体系を再定義しない。具体化だけを行う。
