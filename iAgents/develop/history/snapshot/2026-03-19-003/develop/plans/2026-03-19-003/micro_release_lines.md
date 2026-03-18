# 2026-03-19-003 micro release lines

## MRL-28

### mRL-28-1 launcher and runtime path audit

- parent: `MRL-28`
- status: `in_progress`
- initial plan set: `2026-03-19-003`
- latest touch: `2026-03-19`
- result: launcher、desktop shortcut、`PYTHONPATH`、entry point、表示経路の監査観点を固定する

### mRL-28-2 local server and port contract audit

- parent: `MRL-28`
- status: `planned`
- initial plan set: `2026-03-19-003`
- latest touch: `2026-03-19`
- result: `api/health`、`127.0.0.1:8765`、server 起動経路、ブラウザ open 導線を監査する

## MRL-29

### mRL-29-1 extension load and injection audit

- parent: `MRL-29`
- status: `planned`
- initial plan set: `2026-03-19-003`
- latest touch: `2026-03-19`
- result: unpacked extension 読み込み、対象 tab、再読み込み、注入成否の観点を固定する

### mRL-29-2 bridge relay and fallback audit

- parent: `MRL-29`
- status: `planned`
- initial plan set: `2026-03-19-003`
- latest touch: `2026-03-19`
- result: `Bridge State 更新`、`Live Assist 更新`、manual bridge POST、state relay の切り分け導線を固定する

## MRL-30

### mRL-30-1 environment matrix audit

- parent: `MRL-30`
- status: `planned`
- initial plan set: `2026-03-19-003`
- latest touch: `2026-03-19`
- result: Windows、browser、Microsoft account、network、拡張機能、権限の前提条件を明文化する

### mRL-30-2 diagnostics narrative audit

- parent: `MRL-30`
- status: `planned`
- initial plan set: `2026-03-19-003`
- latest touch: `2026-03-19`
- result: 失敗症状ごとの原因候補と次の確認点を一続きの手順で示す

## MRL-31

### mRL-31-1 UX-only validation rationale

- parent: `MRL-31`
- status: `planned`
- initial plan set: `2026-03-19-003`
- latest touch: `2026-03-19`
- result: なぜ自動テストだけでは閉じず、UX 手順でしか最終確認できないかを手順書に明記する

### mRL-31-2 UX gate readiness close

- parent: `MRL-31`
- status: `planned`
- initial plan set: `2026-03-19-003`
- latest touch: `2026-03-19`
- result: 接続監査完了後に、利用者がそのまま UX 確認へ入れる状態を整える
