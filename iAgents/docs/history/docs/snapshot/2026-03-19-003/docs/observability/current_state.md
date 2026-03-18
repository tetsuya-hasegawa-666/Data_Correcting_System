# Current State

## Active Plan Set

- `2026-03-19-003 connection and environment reconciliation roadmap`
- MRL 正本: [market_release_lines.md](C:/Users/tetsuya/playground/Data_Correcting_System/iAgents/develop/plans/2026-03-19-003/market_release_lines.md)
- mRL 正本: [micro_release_lines.md](C:/Users/tetsuya/playground/Data_Correcting_System/iAgents/develop/plans/2026-03-19-003/micro_release_lines.md)

## Active Market Release

- `MRL-28 launch and runtime route audit line`

## Active Micro Release

- `mRL-28-1 launcher and runtime path audit`

## Completed Evidence

- `MRL-19` の bridge scaffold、state store、`/api/bridge/assist` を実装済み
- selection history を bridge state に保存できる
- bridge 文脈を使う live intent、live graph suggestion、dataset handoff、action handoff を実装済み
- `python -m unittest discover -s tests` は 14 件成功している
- launcher、local server、desktop shortcut、browser bridge の最小導線は存在する

## Active Risks

- launcher、server、extension、browser session のどこで止まっているかを、現状の文書だけでは一目で切り分けにくい
- Excel Online 上の selection relay は実ブラウザ、実ログイン状態、実タブ状態に依存するため、CLI や unit test だけでは閉じない
- UX で見える「何も表示されない」は、接続失敗、注入失敗、polling 不足、手順不足のどれでも起こり得る
- そのため UX 確認の前に接続面と環境面の監査 line を完了させる必要がある

## Pending Change Requests

- 接続処理などの環境を見直す MRL / mRL を構築する
- 整合が取れているかを見直してから UX 確認に入る
- `UX_check_work_flow.md` に、UX でないと確認できない理由を追記する

## Next Validation Point

- launcher 起動、`/api/health` 応答、bridge state 反映、manual bridge POST、Excel Online 実タブでの relay の 5 点を同じ手順書で切り分けられる状態にする
