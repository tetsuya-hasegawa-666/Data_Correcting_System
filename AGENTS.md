# AGENTS.md

このワークスペースは 2 つの sibling project を持つ。

- `iSensorium/`
  メインプロジェクト。入口は `iSensorium/docs/index.md` と `iSensorium/develop/index.md`
- `iDevelop/`
  Codex 開発支援ダッシュボードの companion project。入口は `iDevelop/docs/index.md` と `iDevelop/develop/index.md`

## Workspace Rule

- 変更対象 project を先に確定してから作業する。
- `iSensorium/` の規約・計画・実装は `iSensorium/` 配下だけで扱う。
- `iDevelop/` の規約・計画・実装は `iDevelop/` 配下だけで扱う。
- project 間の境界ルール変更だけを、両 project の該当文書へ反映する。
- release line / plan set の採番は、ユーザーが別指定しない限り連番を使う。
- いったん採用した記載データ、ID、名称、状態名、成果物名は、ユーザーが変更を指示しない限り継続利用する。
