# Research Operation

## Purpose

この文書は、Codex が `iDevelop` を MVC、BDD、TDD ベースで継続開発するための運用ルールを定義する。

## Core Cycle

1. 体験起点で BDD ストーリーを定義する。
2. ストーリーから受け入れ条件を導出する。
3. 受け入れ条件を満たす最小 failing test を書く。
4. test を green にする最小実装を行う。
5. MVC 境界を壊さない範囲でリファクタリングする。
6. current state と履歴を更新する。

## BDD Rules

- ストーリーは画面都合ではなく利用者価値で定義する。
- document、data、code はそれぞれ独立した責務として扱う。
- optional scope は must scope と分離する。

## TDD Rules

- 先に failing test を書く。
- 1 つの test で 1 つの狭い振る舞いだけを固定する。
- green 後にだけリファクタリングする。
- test のない重要ロジック追加は避ける。

## MVC Rules

- View は表示と入力導線に閉じる。
- Controller はユースケース制御に集中する。
- Model は永続化、読込、集計、契約表現を担当する。
- 画面をまたぐ共有関心は `shared-core` に集約する。

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
- 実装や検証の変更は、スクリーンショットまたは出力差分を残せる形にする。
- release line の exit criteria に UI 体験確認が含まれる場合は、entry command で起動して画面を目で見て exploratory check を行う。
- exploratory check は test の代替ではなく、BDD/TDD の green 後に行う追加確認として扱う。
- 各 market release line の成果物には、その時点の挙動に対応した `docs/process/UX_check_work_flow.md` の更新を含める。
- `UX_check_work_flow.md` は現行の tab 構成、主な操作、保存手順、停止方法を反映し、古い画面構成を残さない。

## Naming And Sequence Rule

- plan set と release line は、ユーザーが別指定しない限り連番で追加する。
- 既に採用した記載データ、ID、名称、状態名、成果物名は、明示変更がない限り再利用する。
- BDD、TDD、current state、history、UX check の間で同一対象を別名で記載しない。
