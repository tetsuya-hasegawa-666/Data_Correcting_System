# AGENTS.md

このワークスペースは 3 つの sibling project を持つ。

- `iSensorium/`
  メインプロジェクト。入口は `iSensorium/docs/index.md` と `iSensorium/develop/index.md`
- `iDevelop/`
  Codex 開発支援ダッシュボードの companion project。入口は `iDevelop/docs/index.md` と `iDevelop/develop/index.md`
- `coreCamera/`
  `Camera2 + ARCore Shared Camera` 専用の独立実験 project。入口は `coreCamera/docs/index.md` と `coreCamera/develop/index.md`

## Workspace Rule

- 変更対象 project を先に確定してから作業する。
- `iSensorium/` の規約・計画・実装は `iSensorium/` 配下だけで扱う。
- `iDevelop/` の規約・計画・実装は `iDevelop/` 配下だけで扱う。
- `coreCamera/` の規約・計画・実装は `coreCamera/` 配下だけで扱う。
- project 間の境界ルール変更だけを、両 project の該当文書へ反映する。
- release line / plan set の採番は、ユーザーが別指定しない限り連番を使う。
- いったん採用した記載データ、ID、名称、状態名、成果物名は、ユーザーが変更を指示しない限り継続利用する。
- broad search や再帰読込では、各 project の `docs/history/**/snapshot/**` を既定で除外する。
- 15 分前後の manual check は evidence 採取の窓であり、会話停止や作業停止の既定条件ではない。
- 実 blocker や外部依存がない限り、active release line に対する自律継続作業は最大 6 時間まで続けてよい。
