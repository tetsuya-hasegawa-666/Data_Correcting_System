# Change Protocol

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

意味のある `coreCamera/` の変更があった場合は、必ず次を更新する:

1. `docs/observability/current_state.md`
2. 実際の user-side blocker が発生または解消したときの `docs/process/UX_check_work_flow.md`
2. `docs/history/docs/summary/summary.md`
3. `develop/history/summary/summary.md`
4. `docs/history/docs/snapshot/` と `develop/history/snapshot/` の対応する snapshot directory

## Pairing Rule

- すべての docs/develop 変更は、1 つの dated summary entry で説明できなければならない
- snapshots は常に pair で作成する
- implementation がまだ始まっていなくても、decision や planning の変更は意味のある変更として数える
- 実際に user action が無いと block される場合を除き、推測の user task を `docs/process/UX_check_work_flow.md` に書かない

## Markdown Language Rule

- `.md` の内容は日本語を基本とする
- identifiers、file names、API names、引用元の用語、または日本語化すると意味が落ちる表現は原文のまま保持する
- conversation から project-wide または process-wide の言語方針が明確になったら、chat のみに残さず source-of-truth を更新する
