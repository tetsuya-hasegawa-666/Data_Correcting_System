# AGENTS.md

この project は `iClone/` 配下だけで規約、計画、実装準備、seed data を完結させる。

## 入口

- `docs/index.md`
- `develop/index.md`

## ルール

- source-of-truth は `docs/`
- 実開発計画と履歴は `develop/`
- seed data と config sample は `data/`
- `.md` は原則日本語で記述する
- broad search と再帰読込では `docs/history/**/snapshot/**` を既定除外する
- `docs/` を更新したら `docs/history/docs/summary/summary.md` と `docs/history/docs/snapshot/` を対で更新する
- `develop/` を更新したら `develop/history/summary/summary.md` と `develop/history/snapshot/` を対で更新する

