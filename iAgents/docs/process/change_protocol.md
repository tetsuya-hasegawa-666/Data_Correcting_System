# 変更プロトコル

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 目的

Excel Online Shadow Assistant prototype の UX 機能、API、browser UI、検証導線の変更時に、意味理解と履歴追跡を失わないようにする。

## 方針

- open:
  新しい提案 UI、整形ロジック、評価観点は既存 layer へ追加できる。
- closed:
  非侵襲原則、提案型 safety、外部 companion app 前提を無言で上書きしない。

## 対象の分割

- `docs/` の変更:
  目的、価値、UX 機能、検証手順、observability の変更
- `develop/` の変更:
  release line、task 分解、完了判断、snapshot の変更
- `data/` の変更:
  scenario、sample table、evaluation input の変更
- `src/` と `tests/` の変更:
  local server、analysis logic、web UI、検証コードの変更

## 実装責務の分離

- UX 機能定義は `docs/` に置く。
- line と進行管理は `develop/` に置く。
- scenario と evaluation seed は `data/` に置く。
- 実行コードと回帰確認は `src/` と `tests/` に置く。

## 利用者準備の配置

- user action や Microsoft account 利用は `docs/process/UX_check_work_flow.md` 冒頭の `利用者準備ノート` を source-of-truth とする。
- 実 blocker が出るまでは、推測の user task を note に書かない。

## 文書体系の履歴

- `docs/` を変更した場合は `docs/history/docs/summary/summary.md` に 1 件要約を追加する。
- 同時点の `docs/` 全体 snapshot を `docs/history/docs/snapshot/` へ保存する。
- `develop/` の変更履歴と snapshot は `develop/` 配下だけで管理する。
