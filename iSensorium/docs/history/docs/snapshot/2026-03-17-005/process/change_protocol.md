# 変更プロトコル

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 目的

manager context collection system の価値定義、接続方式、YAML 契約、AI 振る舞いの変更時に、意味理解と履歴追跡を失わないようにする。

## 方針

- open:
  新しい入力経路、質問戦略、KPI 観点、運用手順は既存 layer へ追加できる。
- closed:
  既存 schema、認証条件、release 意味を無言で上書きしない。

## 対象の分割

- `docs/` の変更:
  目的、価値、schema、process、observability の変更
- `develop/` の変更:
  release line、task 分解、開発順序、snapshot の変更
- `data/` の変更:
  seed config、sample YAML、sample attachment path の変更
- `iDevelop/` の変更:
  review dashboard や operator console を companion 側へ切り出した後の UI / viewer 変更

## 実装責務の分離

- Android edge capture、host sync、YAML canonical contract、local intelligence orchestration は `iSensorium/` 配下で扱う。
- 独立した dashboard / review frontend を切り出すときだけ `iDevelop/` へ分離する。
- どちらへ置くべきか即断できない変更だけを相談対象とし、それまでは `iSensorium/` 内で継続する。

## 利用者準備の配置

- user action、外部 device access、手動準備は `docs/process/UX_check_work_flow.md` 冒頭の `利用者準備ノート` を source-of-truth とする。
- 実 blocker が出るまでは、推測の user task を note に書かない。

## 人からの入力形式

- change target
- reason
- keep
- discard allowed
- effective timing
- viewpoint
- value judgment changed

## Codex の応答形式

- interpreted meaning
- affected scope
- preserved items
- changed items
- lost items
- release lines redefined
- next validation point
- certainty vs hypothesis

## 競合ルール

1. 非交渉事項との衝突
2. Human Goal との衝突
3. 既存 MRL value との衝突
4. セキュリティ境界との衝突
5. 実装コストと運用コストの衝突

衝突時は `ADOPTED` `HOLD` `REJECTED` `NEW_LINE` のいずれかへ振り分ける。

## 文書体系の履歴

- `docs/` を変更した場合は `docs/history/docs/summary/summary.md` に 1 件要約を追加する。
- 同時点の `docs/` 全体 snapshot を `docs/history/docs/snapshot/` へ保存する。
- `develop/` の変更履歴と snapshot は `develop/` 配下だけで管理する。

## snapshot 運用ルール

- `docs/` snapshot は `docs/history/docs/snapshot/` 自身を除外する。
- `develop/` snapshot は変更した文書だけを保存する。
- seed data の変更は `develop/` snapshot へ対象 path を明記して残す。

## 継続解釈ルール

- 15 分前後の manual check は evidence 採取窓であり、停止条件ではない。
- active release line が未完了なら、Codex は次の mRL、次の設計、または必要な change handling へ継続する。
- active target の判定は `develop/index.md` と `docs/observability/current_state.md` を突き合わせて行う。

## 完了判定ルール

- Codex が完了を宣言する場合、原則として Codex 自身の再確認結果を伴う。
- ただし、ユーザーが検証済みと明示した場合は `user validation` を完了根拠として採用できる。
- どちらを採用したかは `current_state.md` と history に明記する。
