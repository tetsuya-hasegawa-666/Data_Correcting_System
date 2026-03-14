# Workspace Overview

このワークスペースは 3 つの sibling project を持つ。

- `iSensorium`
  Xperia 5 III 上の多種センサ同時記録基盤
- `iDevelop`
  Codex Dashboard 系の companion project
- `coreCamera`
  `Camera2 + ARCore Shared Camera` 専用の独立実験 project

各 project はそれぞれの `AGENTS.md` と `docs/index.md` / `develop/index.md` を入口とする。

## Workspace-Wide Continuation Notes

- 15 分前後の manual check は evidence 採取の窓であり、既定の停止条件ではない。
- active release line に対する自律継続作業は、実 blocker や外部依存がない限り最大 6 時間まで継続してよい。
- broad search や再帰読込では、各 project の `docs/history/**/snapshot/**` を既定で除外する。
