# Current State

## Active Plan Set

- `2026-03-18-004 Excel Online Shadow Assistant implementation roadmap`
- MRL 正本: [market_release_lines.md](C:/Users/tetsuya/playground/Data_Correcting_System/iAgents/develop/plans/2026-03-18-004/market_release_lines.md)
- mRL 正本: [micro_release_lines.md](C:/Users/tetsuya/playground/Data_Correcting_System/iAgents/develop/plans/2026-03-18-004/micro_release_lines.md)

## Active Market Release

- `MRL-10 shadow bar operationalization line`

## Active Micro Release

- `mRL-10-1 launcher, shortcut, and auto-open stabilization`

## Completed Evidence

- Excel Online 向け Shadow Assistant prototype を local server + web UI + logic API として実装した。
- Windows launcher と desktop shortcut を追加した。
- `python -m unittest discover -s tests` が成功した。
- `python -m iagents range ...` と `python -m iagents intent ...` の CLI 検証が成功した。
- local server の `GET /api/health` と `GET /` の smoke が成功した。
- launcher の server 起動と desktop shortcut 起動を確認した。
- completion evidence: `Codex retest`

## Active Risks

- Excel Online は companion app として扱っており、DOM 連携による自動認識は未実装。
- OCR と実モデル接続は未実装。
- Graph Shadow Editor は提案補助までで、Excel 側の直接操作は未実装。

## Pending Change Requests

- なし

## Next Validation Point

- desktop shortcut からの起動確認
- Excel Online 実画面で `MRL-10` の companion open 確認
- `MRL-11` の本実装 line 着手
