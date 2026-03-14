# Develop Index

`coreCamera/` は `iSensorium` と同じ release-line の作業様式に従うが、replacement readiness が証明されるまで isolated のまま保つ。

## Active Plan Set

- current: `develop/plans/2026-03-14-001/`
- status: `mRL-5-1` まで進行済み
- rule: この thread では `iSensorium/` へ統合しない
- supporting handover files:
  - `coreCamera/docs/observability/current_state.md`
  - `coreCamera/USER_PREPARATION.md`
  - `coreCamera/SESSION_HANDOVER.md`

## Development Rule

- replacement 実装は `coreCamera/` 配下に isolated のまま保つ
- 現在の `iSensorium` in/out contract を維持する
- 既に `iSensorium` で使っている release-line の進め方を維持する
- 現在の完了順: `mRL-0-1 -> mRL-0-2 -> mRL-0-3 -> mRL-1-1 -> mRL-1-2 -> mRL-2-1 -> mRL-2-2 -> mRL-2-3 -> mRL-3-1 -> mRL-3-2 -> mRL-3-3 -> mRL-4-1 -> mRL-4-2 -> mRL-5-1`
- active な market release line がある場合、15 分前後で区切らず、user block または 6 時間上限に達するまで同一 session で exit criteria 到達まで継続する

## Restart Order

1. `coreCamera/docs/index.md`
2. `coreCamera/docs/observability/current_state.md`
3. `coreCamera/USER_PREPARATION.md`
4. `coreCamera/SESSION_HANDOVER.md`
5. `coreCamera/develop/index.md`
6. `coreCamera/develop/plans/2026-03-14-001/`
