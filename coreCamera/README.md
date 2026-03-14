# coreCamera

`iSensorium` 向けの、isolated な `Camera2 + ARCore Shared Camera` 置換カメラ project です。

- この project は意図的に `iSensorium/` と `iDevelop/` へ干渉しません。
- 開発は後続 session で開始します。
- `iSensorium/` への統合は、置換 stack が現在の in/out contract を証明するまで保留です。
- 再開時の入口順:
  1. `coreCamera/docs/index.md`
  2. `coreCamera/docs/observability/current_state.md`
  3. `coreCamera/docs/process/UX_check_work_flow.md`
  4. `coreCamera/SESSION_HANDOVER.md`
  5. `coreCamera/develop/index.md`
