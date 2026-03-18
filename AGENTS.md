# AGENTS.md

このワークスペースは 4 つの sibling project を持つ。

- `iSensorium/`
  メインプロジェクト。入口は `iSensorium/docs/index.md` と `iSensorium/develop/index.md`
- `iDevelop/`
  Codex 開発支援ダッシュボードの companion project。入口は `iDevelop/docs/index.md` と `iDevelop/develop/index.md`
- `coreCamera/`
  `Camera2 + ARCore Shared Camera` 専用の独立実験 project。入口は `coreCamera/docs/index.md` と `coreCamera/develop/index.md`
- `iAgents/`
  軽量 LLM を複数インスタンス起動して AI 共創協働を試す独立実験 project。入口は `iAgents/docs/index.md` と `iAgents/develop/index.md`

## Workspace Rule

- 変更対象 project を先に確定してから作業する。
- `iSensorium/` の規約・計画・実装は `iSensorium/` 配下だけで扱う。
- `iDevelop/` の規約・計画・実装は `iDevelop/` 配下だけで扱う。
- `coreCamera/` の規約・計画・実装は `coreCamera/` 配下だけで扱う。
- `iAgents/` の規約・計画・実装は `iAgents/` 配下だけで扱う。
- project 間の境界ルール変更だけを、両 project の該当文書へ反映する。
- release line / plan set の採番は、ユーザーが別指定しない限り連番を使う。
- いったん採用した記載データ、ID、名称、状態名、成果物名は、ユーザーが変更を指示しない限り継続利用する。
- broad search や再帰読込では、各 project の `docs/history/**/snapshot/**` を既定で除外する。
- 15 分前後の manual check は evidence 採取の窓であり、会話停止や作業停止の既定条件ではない。
- 実 blocker や外部依存がない限り、active release line に対する自律継続作業は最大 6 時間まで続けてよい。

## Codex とユーザーの運用取り決め

- 高優先度:
  Codex は、実 blocker や外部依存が存在しない限り、active plan set の最後の MRL まで継続して作業する。
- 高優先度:
  Codex は、`ブロッカーがない` と判断した状態で単に停止してはならない。停止が許されるのは、active MRL 群の終端まで到達して人が完了と認識できる状態になったとき、または実 blocker を明示したときだけとする。
- 高優先度:
  `作業が終わった` という報告は、active plan set の MRL が最後まで完了したか、会話中にユーザーが明示的に範囲を縮めた場合に限る。
- 高優先度:
  中間 milestone、prototype、companion scope は、ユーザーが最終目標として再定義しない限り、停止理由に使ってはならない。
- 高優先度:
  Codex は current state、develop、history を、`今どこで止まってよいか` ではなく `どこまで進める必要があるか` が伝わる状態で維持する。

## Documentation Rule

- workspace 共通の文書ルールは `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md` を唯一の基準とする
- 各 project の `docs/index.md`、`docs/process/change_protocol.md`、`docs/process/research_operation.md`、`docs/process/UX_check_work_flow.md` はこの文書を参照し、project 固有ルールだけを追加する
- `.md` は原則として日本語で記述する
- `app/build/`、`.gradle/`、`tmp/` などの生成物は全 project で commit / push しない
- 利用者準備は `USER_PREPARATION.md` を増やさず、各 project の `docs/process/UX_check_work_flow.md` に集約する
