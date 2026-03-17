# develop インデックス

## 現在の plan set

- active dated plan set: `2026-03-17-016 manager context collection system foundation`
- latest completed plan set: `2026-03-17-015 capture mode, japanese UX, and resilient recording`
- active market release target: `MRL-14 manager context collection foundation line`
- latest completed market release target: `MRL-13 robust recording and error handling line`
- active micro release target: `mRL-14-3 connectivity contract and local sync scaffold`
- latest completed micro release target: `mRL-13-3 completion evidence rule close`

## 正本の参照

- 現在の MRL 正本は [develop/plans/2026-03-17-016/market_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iSensorium/develop/plans/2026-03-17-016/market_release_lines.md) とする。
- 現在の mRL 正本は [develop/plans/2026-03-17-016/micro_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iSensorium/develop/plans/2026-03-17-016/micro_release_lines.md) とする。
- 旧 dated plan set の release 文書は履歴であり、active judgment には使わない。

## 2026-03-17-016 の重点

- `MRL-14`
  - manager context collection の north star 固定
  - YAML canonical contract と seed data
  - connectivity contract の土台
- `MRL-15`
  - proximity auth
  - Syncthing P2P sync
  - attachment folder discipline
- `MRL-16`
  - one-question UX
  - multimodal capture
  - Android quick memo flow
- `MRL-17`
  - local transcription
  - question generation
  - KPI candidate analysis
- `MRL-18`
  - review surface
  - security hardening
  - completion evidence

## 想定 evidence

- schema validation
- Syncthing folder dry-run
- Docker compose / container smoke
- sample YAML parser / normalizer test
- Android quick memo UX check

## 補足

- `MRL-0` から `MRL-13` は旧 capture research line として履歴保持する。
- manager context collection system は `MRL-14` から継続採番する。
