# Develop Index

## 現在の plan set

- active dated plan set: `none`
- latest completed plan set: `2026-03-17-006 archive explorer, retrieval UX, and resilient operator flow`
- active market release target: `none`
- latest completed market release target: `MRL-24 MVC and resilient operator line`
- active micro release target: `none`
- latest completed micro release target: `mRL-24-3 completion evidence rule close`

## 2026-03-17-006 の完了内容

- `MRL-22`
  - `iSensorium` session/export contract intake
  - top directory compact archive explorer
  - `.md` directory compact selection の文書整合
- `MRL-23`
  - preview-centered retrieval flow
  - one-click download
  - 日本語 operator wording
- `MRL-24`
  - viewer / explorer / download / consultation の MVC 整理
  - detailed error handling contract
  - completion evidence ルールと history close

## 完了 evidence

- `npm test`
- `npm run build`
- live snapshot / archive contract は `vitest` で再確認済み
- completion evidence は既定で `Codex retest`
- ユーザーが検証できた旨を明示した場合は `user validation` も採用可能
