# Workspace Overview

このワークスペースは 4 つの sibling project を持つ。

- `iSensorium`
  Xperia 5 III 上の実験系メイン project
- `iDevelop`
  Codex Dashboard 系の companion project
- `coreCamera`
  `Camera2 + ARCore Shared Camera` 専用の独立実験 project
- `iAgents`
  軽量 LLM multi-agent による AI 共創協働の独立実験 project

各 project はそれぞれの `AGENTS.md` と `docs/index.md` / `develop/index.md` を入口とする。

## Workspace-Wide Continuation Notes

- 15 分前後の manual check は evidence 採取の窓であり、作業停止の条件ではない。
- active release line に対する自律継続作業は、実 blocker や外部依存がない限り最大 6 時間まで続けてよい。
- broad search や再帰読込では、各 project の `docs/history/**/snapshot/**` を既定除外する。
- 高優先度:
  Codex は、実 blocker がない限り、active MRL の最後まで到達して人が完了と認識できる状態になるまで継続する。
