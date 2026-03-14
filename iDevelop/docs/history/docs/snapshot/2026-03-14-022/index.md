# Documentation Index

この subproject では、`docs/` を source-of-truth とし、`develop/` を実装計画と履歴の管理場所とする。新しい ad hoc 文書は増やさず、必要な更新は既存レイヤへ集約し、変更後は履歴とスナップショットを対で残す。

## Governance Principle

この dashboard project では、情報更新に open であり、その表現更新に closed であることを基本原則とする。

- 情報更新に open:
  画面実装、仕様更新、表示確認、実行ポイント更新を必要最小レイヤへ反映できる。
- 表現更新に closed:
  既存の意味を無言で上書きせず、必要なレイヤでのみ更新し、履歴とスナップショットを対で残す。
- 採番は連番維持:
  plan set と release line は、ユーザーが別指定しない限り次の連番を使う。
- 記載データは継続利用:
  ID、名称、状態名、成果物名、データ名は、明示変更がない限り既存表記を使う。

## Scope Boundary

- `docs/`
  artifact、process、observability の source-of-truth
- `develop/`
  実装計画、release line、変更履歴、snapshot
- `src/`
  dashboard 実装コード
- `data/`
  sample seed data

## Source-of-Truth Layout

| Layer | File | Purpose |
|---|---|---|
| Artifact | `docs/artifact/north_star.md` | 目的、非機能条件、原則 |
| Artifact | `docs/artifact/project_contract.md` | generic project contract |
| Artifact | `docs/artifact/system_blueprint.md` | module 境界と live 接続戦略 |
| Process | `docs/process/research_operation.md` | BDD/TDD と change operation |
| Process | `docs/process/UX_check_work_flow.md` | 起動、UX check、exit criteria |
| Process | `docs/process/pilot_setup_checklist.md` | pilot 前 checklist |
| Process | `docs/process/pilot_runbook.md` | pilot 実行手順 |
| Process | `docs/process/rollback_note.md` | pilot 失敗時の切り戻し |
| Process | `docs/process/pilot_handoff.md` | pilot 完了時の handoff |
| Observability | `docs/observability/current_state.md` | active state と next action |
| Observability | `docs/observability/pilot_evidence_log.md` | pilot evidence |
| History | `docs/history/docs/summary/summary.md` | docs 変更履歴 |
| Snapshot | `docs/history/docs/snapshot/README.md` | docs snapshot |
