# develop インデックス

## 現在の plan set

- active dated plan set: `2026-03-17-001 iAgents bootstrap and mock collaboration foundation`
- latest completed plan set: `なし`
- active market release target: `MRL-1 bootstrap and mock collaboration line`
- latest completed market release target: `なし`
- active micro release target: `mRL-1-2 CLI execution and evidence baseline`
- latest completed micro release target: `mRL-1-1 docs and structure bootstrap`

## 正本の参照

- 現在の MRL 正本は [develop/plans/2026-03-17-001/market_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iAgents/develop/plans/2026-03-17-001/market_release_lines.md) とする。
- 現在の mRL 正本は [develop/plans/2026-03-17-001/micro_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iAgents/develop/plans/2026-03-17-001/micro_release_lines.md) とする。

## 2026-03-17-001 の重点

- `MRL-1`
  - docs / develop / data / src / tests の bootstrap
  - mock collaboration CLI
  - seed brief 実行と最小 evidence
- `MRL-2`
  - provider adapter seam
  - local or API lightweight model 接続
  - config 拡張
- `MRL-3`
  - multi-brief evaluation
  - role tuning
  - round / output quality 比較

## 想定 evidence

- `python -m unittest discover -s tests`
- `python -m iagents.cli --brief-file data/seed/session/brief.md`
