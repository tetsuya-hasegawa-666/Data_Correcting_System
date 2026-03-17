# 2026-03-17-006 market release lines

## Purpose

`2026-03-17-006` は、consultation workspace baseline の上に session archive viewer、compact tree explorer、one-click download、detailed error handling を構築する plan set とする。

## Market Release Lines

| ID | name | delivered value | status |
|---|---|---|---|
| MRL-22 | archive explorer foundation line | session/export contract intake と top directory compact explorer を確立 | completed |
| MRL-23 | retrieval and download UX line | preview-centered retrieval と one-click download を確立 | completed |
| MRL-24 | MVC and resilient operator line | MVC hardening と operator-facing error handling を確立 | completed |

## Completion Notes

- `MRL-22` は live manifest を workspace root 前提へ切り替え、`iSensorium` session archive を読めるようにした。
- `MRL-23` は archive preview と download endpoint を導入し、one-click download を実装した。
- `MRL-24` は controller / view / model の責務を整理し、warning / error / empty state を固定した。
