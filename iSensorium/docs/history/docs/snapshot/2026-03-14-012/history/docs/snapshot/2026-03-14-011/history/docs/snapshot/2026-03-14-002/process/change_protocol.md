# Change Protocol

## Purpose

release line や価値定義の変更時に、人と Codex の意味理解を失わず、変更の影響を追跡できるようにする。

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

## History Record Template

変更履歴は最低限以下を持つ。

- before
- reason
- after
- impact
- unresolved
- next confirmation

## Documentation-System Direction History

文書体系そのものを変更した場合は、個別差分の羅列ではなく、文書体系全体がどの方向へ動いたかを短く要約して `docs/history/` に 1 件追加する。
また、価値検証と効果検証のため、同じ変更時点の `docs/` 全体スナップショットを `docs/snapshots/` に保存する。

記録対象:

- source-of-truth の責務変更
- 文書レイヤの追加、統合、廃止
- agent 運用ルールの変更
- 変更受理や研究運用の基準変更

記録しないもの:

- 単なる誤字修正
- 局所的な wording 調整
- `current_state.md` の通常更新

方向履歴は「何が変わったか」より「この変更で文書体系全体がどの方向へ寄ったか」を 2-5 行で記録する。

## Paired Operation Rule

当面の運用では、文書体系変更時に以下を必須とする。

1. `docs/history/` に短い方向履歴を 1 件追加する。
2. `docs/snapshots/` に同時点の `docs/` 全体スナップショットを 1 件保存する。
3. 両者は同じ日付と連番で対応づける。

目的:

- 文書体系変更の意図を短く追えるようにする
- その変更時点の全体構成を後から検証できるようにする
- 別開発へ転用する際の比較材料を残す

## Visualization Status

変更要求の状態は以下に限定する。

- NEW
- EVALUATING
- ADOPTED
- HOLD
- REJECTED
- MERGED
- NEW_LINE
