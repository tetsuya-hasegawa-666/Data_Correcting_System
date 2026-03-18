# develop インデックス

## 現在の plan set

- active dated plan set: `2026-03-19-003 connection and environment reconciliation roadmap`
- latest completed plan set: `2026-03-18-004 Excel Online companion foundation roadmap`
- active market release target: `MRL-28 launch and runtime route audit line`
- latest completed market release target: `MRL-19 workbook bridge foundation line`
- active micro release target: `mRL-28-1 launcher and runtime path audit`
- latest completed micro release target: `mRL-19-2 bridge state store`

## 正本の場所

- 現在の MRL 正本は [market_release_lines.md](C:/Users/tetsuya/playground/Data_Correcting_System/iAgents/develop/plans/2026-03-19-003/market_release_lines.md) とする
- 現在の mRL 正本は [micro_release_lines.md](C:/Users/tetsuya/playground/Data_Correcting_System/iAgents/develop/plans/2026-03-19-003/micro_release_lines.md) とする

## 運用メモ

- `2026-03-18-005` は full implementation 本線の plan set として保持する
- ただし UX 確認で見える失敗を正しく解釈するには、起動経路、local server、browser bridge、diagnostics、手順書の整合を先に閉じる必要がある
- そのため `2026-03-19-003` を先行させ、ここで接続面と環境面の不整合を潰してから full implementation の実 UX 確認へ戻す
- 実 blocker がない限り、active MRL の最後まで継続する

## 2026-03-19-003 の構成

- `MRL-28`
  launch and runtime route audit
- `MRL-29`
  browser bridge connection integrity
- `MRL-30`
  environment and diagnostics reconciliation
- `MRL-31`
  UX gate readiness close
