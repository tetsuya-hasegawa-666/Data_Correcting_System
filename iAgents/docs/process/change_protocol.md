# 変更プロトコル

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 目的

軽量 model provider、agent 役割、round 制御、評価シナリオの変更時に、意味理解と履歴追跡を失わないようにする。

## 方針

- open:
  新しい agent role、provider adapter、評価観点は既存 layer へ追加できる。
- closed:
  既存 role contract、CLI entry、release 意味を無言で上書きしない。

## 対象の分割

- `docs/` の変更:
  目的、価値、役割、process、observability の変更
- `develop/` の変更:
  release line、task 分解、開発順序、snapshot の変更
- `data/` の変更:
  team config、seed brief、evaluation input の変更
- `src/` と `tests/` の変更:
  orchestration、adapter、CLI、検証コードの変更

## 実装責務の分離

- 文書正本は `docs/` に置く。
- line と進行管理は `develop/` に置く。
- seed 入力と評価素材は `data/` に置く。
- 実行コードとテストは `src/` と `tests/` に置く。

## 利用者準備の配置

- user action、外部 device access、手動準備は `docs/process/UX_check_work_flow.md` 冒頭の `利用者準備ノート` を source-of-truth とする。
- 実 blocker が出るまでは、推測の user task を note に書かない。

## 文書体系の履歴

- `docs/` を変更した場合は `docs/history/docs/summary/summary.md` に 1 件要約を追加する。
- 同時点の `docs/` 全体 snapshot を `docs/history/docs/snapshot/` へ保存する。
- `develop/` の変更履歴と snapshot は `develop/` 配下だけで管理する。

## 継続解釈ルール

- active release line が未完了なら、Codex は次の mRL、次の設計、または必要な change handling へ継続する。
- active target の判定は `develop/index.md` と `docs/observability/current_state.md` を突き合わせて行う。

## 完了判定ルール

- Codex が完了を宣言する場合、原則として Codex 自身の再確認結果を伴う。
- ただし、ユーザーが検証済みと明示した場合は `user validation` を完了根拠として採用できる。
- どちらを採用したかは `current_state.md` と history に明記する。
