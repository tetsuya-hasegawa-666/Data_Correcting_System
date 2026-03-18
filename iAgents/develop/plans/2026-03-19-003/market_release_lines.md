# 2026-03-19-003 market release lines

## 位置づけ

この plan set は、`iAgents` の Excel Online Shadow Assistant に対して、UX 確認前の接続処理と実行環境の整合を総点検するための MRL 正本である。

`2026-03-18-005` は full implementation 本線の roadmap として保持する。
ただし UX 確認で見える失敗を正しく解釈するには、起動経路、local server、browser bridge、diagnostics、手順書の整合を先に閉じる必要がある。
そのため本 plan set を先行させる。

## Market Release Lines

| ID | status | name | initial plan set | latest touch | delivered value |
|---|---|---|---|---|---|
| MRL-28 | in_progress | launch and runtime route audit line | `2026-03-19-003` | `2026-03-19` | launcher、shortcut、local server、port、runtime path の監査を閉じる |
| MRL-29 | planned | browser bridge connection integrity line | `2026-03-19-003` | `2026-03-19` | extension、injection、state relay、manual bridge fallback の整合を閉じる |
| MRL-30 | planned | environment and diagnostics reconciliation line | `2026-03-19-003` | `2026-03-19` | browser、account、CORS、console、health、切り分け導線を統合する |
| MRL-31 | planned | UX gate readiness close line | `2026-03-19-003` | `2026-03-19` | UX 確認前提の手順、理由、判定観点、evidence close を揃える |
