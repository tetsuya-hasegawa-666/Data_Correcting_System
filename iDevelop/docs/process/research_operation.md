# Research Operation

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## Purpose

この文書は、Codex が `iDevelop` を MVC、BDD、TDD ベースで継続開発するための運用ルールを定義する。

## Core Cycle

1. 体験起点で BDD ストーリーを定義する。
2. ストーリーから受け入れ条件を導出する。
3. 受け入れ条件を満たす最小 failing test を書く。
4. test を green にする最小実装を行う。
5. MVC 境界を壊さない範囲でリファクタリングする。
6. current state と履歴を更新する。

## Continuation Window Rule

- active な market release line がある場合、同一 session 内ではその exit criteria を満たすまで micro release を順送りで進める。
- 1 つの micro release が green になっても、同じ market release line 内の次 micro release へ自動で進んでよい。
- 15 分前後で任意停止する運用は取らない。
- 停止条件は次に限定する。
  - user 操作、追加データ、明示承認が必要で進められない
  - active な market release line の exit criteria を満たした
  - 継続時間が 6 時間上限に到達した

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
- `current_state.md` の handoff / continuation 系メモは停止指示ではなく、継続時の現在地共有として扱う。

## Naming And Sequence Rule

- plan set と release line は、ユーザーが別指定しない限り連番で追加する。
- 既に採用した記載データ、ID、名称、状態名、成果物名は、明示変更がない限り再利用する。
- BDD、TDD、current state、history、UX check の間で同一対象を別名で記載しない。

## Current TDD Task Set

| task_id | behavior_id | test_target | criterion | status | evidence |
|---|---|---|---|---|---|
| `TDD-10-1` | `document-bundle-fixed` | `tests/shared-core/consultationSession.test.ts` | selected document から consultation bundle を組み立てられる | TEST_GREEN | shared-core model green |
| `TDD-10-2` | `code-phase-gate-visible` | `tests/shared-core/consultationSession.test.ts` | code consultation が `phase-gated-read-only` を返す | TEST_GREEN | shared-core model green |
| `TDD-10-3` | `document-approval-state-visible` | `tests/shared-core/dashboardController.test.ts` | dashboard shell が contract と approval state を表示する | TEST_GREEN | dashboard shell green |
| `TDD-11-1` | `document-bundle-fixed` | `tests/document-workspace/documentWorkspaceController.test.ts` | 複数文書選択 bundle を保持できる | TEST_GREEN | document controller green |
| `TDD-11-2` | `document-response-schema-fixed` | `tests/document-workspace/documentWorkspaceView.test.ts` | focus input と response panel が `Summary` `Evidence` `Next Action` を表示する | TEST_GREEN | document view green |
| `TDD-11-3` | `document-approval-state-visible` | `tests/shared-core/dashboardController.test.ts` | shared shell から document consultation を実行できる | TEST_GREEN | dashboard integration green |
| `TDD-12-1` | `data-bundle-fixed` | `tests/data-workspace/dataWorkspaceController.test.ts` | dataset selection を consultation bundle として保持できる | TEST_GREEN | data controller green |
| `TDD-12-2` | `data-response-schema-fixed` | `tests/data-workspace/dataWorkspaceView.test.ts` | focus input と response panel が `Summary` `Evidence` `Next Action` を表示する | TEST_GREEN | data view green |
| `TDD-12-3` | `data-approval-state-visible` | `tests/shared-core/dashboardController.test.ts` | shared shell から data consultation を実行できる | TEST_GREEN | dashboard integration green |
| `TDD-13-1` | `shared-session-state` | `tests/shared-core/dashboardController.test.ts` | shared prompt / history が document/data をまたいで保持される | TEST_GREEN | shared shell green |
| `TDD-14-1` | `code-phase-gate-visible` | `tests/code-workspace/codeWorkspaceController.test.ts` | code target selection と read-only consultation response を保持できる | TEST_GREEN | code controller green |
| `TDD-14-2` | `code-phase-gate-visible` | `tests/shared-core/dashboardController.test.ts` | code consultation は phase gate により apply preview を出さない | TEST_GREEN | code shell green |
| `TDD-15-1` | `proposal-action-state` | `tests/shared-core/dashboardController.test.ts` | shared shell に proposal action と history が表示される | TEST_GREEN | proposal action green |
| `TDD-16-1` | `approval-first-apply` | `tests/shared-core/dashboardController.test.ts` | seed mode の document apply preview / approve が通る | TEST_GREEN | safe apply green |
| `TDD-17-1` | `pilot-end-to-end` | `npm test` `npm run build` | document/data/code consultation と shared shell が一貫して動く | VERIFIED | build + test green |
