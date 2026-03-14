# Change Protocol

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## Purpose

ダッシュボードの変更時に、人と Codex が誤解なく判断し、変更影響を `iDevelop/` の中で閉じて扱えるようにする。

## Policy Direction

この project は、情報の更新に open であり、その表現の更新に closed である。

- open:
  画面実装、設計、運用ルール、検証結果を必要なレイヤへ反映できる。
- closed:
  既存の意味を無言で上書きせず、履歴、スナップショット、差分説明を残す。

## Stability Rule

- release line / plan set の採番は、ユーザーが別指定しない限り連番を使う。
- 既存の記載データ、ID、名称、状態名、成果物名、データ名は、明示変更がない限り同一表記を維持する。
- 同じ意味の項目を別名へ言い換える場合は、変更理由と適用範囲を docs / develop の両方に残す。

## Scope Split

- `docs/` の変更:
  source-of-truth、運用ルール、観測情報、確認導線の更新
- `develop/` の変更:
  開発計画、release line、開発履歴、計画スナップショットの更新
- `src/` と `data/` の変更:
  ダッシュボード実装、サンプルデータ、検証対象ロジックの更新

## Input Format From Human

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

## Isolation Rule

- ダッシュボード由来の変更をメインプロジェクト実装へ混在させない。
- 変更のために別 project のコードを読むことはできるが、変更はこの配下に閉じる。
- ルール変更は境界ルール変更時だけに両 project へ反映する。

## Docs Pair Rule

1. `docs/history/docs/summary/summary.md` に変更履歴を 1 件追記する。
2. `docs/history/docs/snapshot/` にその時点の `docs/` スナップショットを 1 件残す。
3. スナップショットディレクトリ名は `YYYY-MM-DD-XXX` とする。
4. 文書更新後は整合と参照先を確認する。

## Development Pair Delegation

`develop/` の計画履歴とスナップショット更新は `develop/index.md` と `develop/history/` の規約に従う。
