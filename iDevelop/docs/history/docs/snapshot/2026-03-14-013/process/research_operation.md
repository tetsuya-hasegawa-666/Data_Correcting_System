# Research Operation

## Purpose

この文書は、Codex 向けダッシュボードを MVC, BDD, TDD ベースで継続開発するための運用ルールを定義する。

## Core Cycle

1. 体験単位で BDD ストーリーを定義する。
2. ストーリーから受け入れ条件を抽出する。
3. 受け入れ条件を満たす最小 failing test を作る。
4. test を通す最小実装を行う。
5. MVC の責務逸脱がない範囲でリファクタリングする。
6. current state と履歴を更新する。

## BDD Rules

- ストーリーは画面単位ではなく利用者価値単位で定義する。
- 文書画面、データ画面、コード画面はそれぞれ独立した振る舞い集合として扱う。
- optional scope は must scope と分離する。

## TDD Rules

- 先に failing test を作る。
- 1 つのテストで 1 つの振る舞いだけを確定させる。
- passing 後にだけリファクタリングする。
- テストのない拡張ポイント追加は避ける。

## MVC Rules

- View は描画と入力受理だけを持つ。
- Controller はユースケース調停に集中する。
- Model は永続化対象とドメインルールを保持する。
- 画面をまたぐ共通処理は `shared-core` に集約する。

## Task State

- NEW
- STORY_DEFINED
- TEST_RED
- TEST_GREEN
- REFACTORING
- VERIFIED
- RECORDED

## Evidence Rule

- 各 feature は対応する BDD ストーリー、テスト、結果確認を対で残す。
- 可視化や集計の変更は、スクリーンショットまたは出力例を残せる形にする。
- release line の exit criteria に UI 操作確認が含まれる場合は、entry command で起動して画面を手で触る exploratory check を行う。
- exploratory check は test の代替ではなく、BDD/TDD の green 後に行う追加確認として扱う。
- 各 market release line の成果物には、その時点の機能に対応した `docs/process/UX_check_work_flow.md` の更新を含める。
- `UX_check_work_flow.md` は現在の tab 構成、主要操作、期待結果、終了手順を反映し、古い画面導線を残さない。
