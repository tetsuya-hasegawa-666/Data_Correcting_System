# Change Protocol

## Purpose

release line や価値定義の変更時に、人と Codex の意味理解を失わず、変更の影響を追跡できるようにする。

## Policy Direction

この規約は、拡張的変更にオープンであり、修正的変更にクローズである。

- open:
  新しい価値、機能、履歴観点、検証観点の追加を既存レイヤへ編入できる。
- closed:
  既存の意味を無言で上書きせず、履歴、スナップショット、影響範囲を必須とする。

## Scope Split

- `docs/` の変更:
  source-of-truth、規約、意味体系、運用ルールの変更
- `develop/` の変更:
  実開発計画、release line 実体、実装準備、変更対象文書の変更
- `iDevelop/` の変更:
  ダッシュボード用サブプロジェクト内部の仕様、計画、コード、データ定義、履歴の変更

## Input Format From Human

変更要求は以下を最小セットとする。

- change target
- reason
- keep
- discard allowed
- effective timing
- viewpoint
- value judgment changed

## Response Format From Codex

- interpreted meaning
- affected scope
- preserved items
- changed items
- lost items
- release lines redefined
- next validation point
- certainty vs hypothesis

## Meaning Confirmation Rules

- Codex は解釈を先に明示する。
- 曖昧さは仮説として分離する。
- 人が確認すべき点を列挙する。
- 確定事項と仮説事項を混在させない。

## Conflict Rules

競合は以下の順で判定する。

1. 不変条件との衝突
2. Human Goal との衝突
3. 既存 Market Release value との衝突
4. 実装コストと期間の衝突
5. 研究価値と運用価値の衝突

衝突時は、採用、保留、棄却、新ライン化のいずれかに振り分ける。

## Documentation-System History

`docs/` を変更した場合は、個別差分の羅列ではなく、文書体系全体がどの方向へ動いたかを短く要約して `docs/history/docs/summary/summary.md` に 1 件追加する。
また、同じ変更時点の `docs/` 全体スナップショットを `docs/history/docs/snapshot/` に保存する。

## Docs Pair Rule

1. `docs/history/docs/summary/summary.md` に短い要約履歴を 1 件追加する。
2. `docs/history/docs/snapshot/` に同時点の `docs/` 全体スナップショットを 1 件保存する。
3. スナップショットディレクトリ名は `YYYY-MM-DD-XXX` とする。
4. 両者は同じ日付と連番で対応づける。

## Development Pair Delegation

`develop/` の変更履歴とスナップショット規約は `develop/index.md` と `develop/history/` 配下で管理する。
`docs/` 側では境界だけを定義し、実体管理は `develop/` に委譲する。

## Subproject Isolation Rule

- `iDevelop/` は `iSensorium` と sibling な companion project として扱う。
- ダッシュボード機能の要求整理、設計、実装、データ画面定義、履歴保存は `iDevelop/` 配下だけで行う。
- ルート `docs/` / `develop/` には、分離境界と初期化判断だけを残す。
- サブプロジェクトの feature 変更をルート側 change set に混在させない。

## Visualization Status

変更要求の状態は以下に限定する。

- NEW
- EVALUATING
- ADOPTED
- HOLD
- REJECTED
- MERGED
- NEW_LINE
