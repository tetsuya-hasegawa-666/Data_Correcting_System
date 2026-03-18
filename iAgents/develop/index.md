# develop インデックス

## 現在の plan set

- active dated plan set: `2026-03-18-003 Excel Online Shadow Assistant prototype delivery`
- latest completed plan set: `2026-03-18-003 Excel Online Shadow Assistant prototype delivery`
- active market release target: `なし`
- latest completed market release target: `MRL-9 semantic shadow assist prototype line`
- active micro release target: `なし`
- latest completed micro release target: `mRL-9-1 semantic intent assist prototype`

## 正本の参照

- 現在の MRL 正本は [develop/plans/2026-03-18-003/market_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iAgents/develop/plans/2026-03-18-003/market_release_lines.md) とする。
- 現在の mRL 正本は [develop/plans/2026-03-18-003/micro_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iAgents/develop/plans/2026-03-18-003/micro_release_lines.md) とする。

## 2026-03-18-003 の結果

- `MRL-5`
  - Shadow Bar web UI
  - local HTTP server
  - health endpoint
- `MRL-6`
  - Range Pilot prototype
  - Selection History
  - Smart Snap
- `MRL-7`
  - Clean Paste
  - Data Synthesizer
- `MRL-8`
  - Graph Suggestion
  - Mode Halo
- `MRL-9`
  - Intent Interpreter
  - CLI subcommands
  - Excel Online manual validation route

## 想定 evidence

- `python -m unittest discover -s tests`
- `python -m iagents serve --port 8765`
- `GET /api/health`
- `GET /`
