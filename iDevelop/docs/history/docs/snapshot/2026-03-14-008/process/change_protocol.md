# Change Protocol

## Purpose

ダッシュボード機能の変更時に、人と Codex が意味理解を失わず、変更影響を `iDevelop/` の中で追跡できるようにする。

## Policy Direction

この規約は、拡張的変更にオープンであり、修正的変更にクローズである。

- open:
  画面追加、拡張ポイント追加、集計追加、表示追加を既存レイヤへ編入できる。
- closed:
  既存の意味を無言で上書きせず、履歴、スナップショット、影響範囲を必須とする。

## Scope Split

- `docs/` の変更:
  source-of-truth、規約、意味体系、運用ルールの変更
- `develop/` の変更:
  実開発計画、release line 実体、実装準備、変更対象文書の変更
- `src/` と `data/` の変更:
  ダッシュボード実装、サンプルデータ、結果整理ロジックの変更

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

- ダッシュボード固有の変更をメインプロジェクト本体へ混在させない。
- 参照のために外部文書やコードを読むことはできるが、変更はこの配下に閉じる。
- ルート側へ戻すのは境界ルール変更時だけに限定する。

## Docs Pair Rule

1. `docs/history/docs/summary/summary.md` に短い要約履歴を 1 件追加する。
2. `docs/history/docs/snapshot/` に同時点の `docs/` 全体スナップショットを 1 件保存する。
3. スナップショットディレクトリ名は `YYYY-MM-DD-XXX` とする。
4. 両者は同じ日付と連番で対応づける。

## Development Pair Delegation

`develop/` の変更履歴とスナップショット規約は `develop/index.md` と `develop/history/` 配下で管理する。
