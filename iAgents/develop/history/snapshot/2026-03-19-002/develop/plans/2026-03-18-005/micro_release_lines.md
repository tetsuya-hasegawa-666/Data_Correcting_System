# 2026-03-18-005 micro release lines

## MRL-19

### mRL-19-1 bridge transport scaffold

- parent: `MRL-19`
- status: `completed`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: browser bridge scaffold、`/api/bridge/state` endpoint、CORS 許可を実装した

### mRL-19-2 bridge state store

- parent: `MRL-19`
- status: `completed`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: 受け取った workbook state を保持し、`/api/bridge/assist` で Range / Snap / Halo へ接続した

## MRL-20

### mRL-20-1 live range capture

- parent: `MRL-20`
- status: `in_progress`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: browser bridge から selection candidate を取得し live assist へ反映する

### mRL-20-2 live smart snap hookup

- parent: `MRL-20`
- status: `in_progress`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: bridge selection から Range Pilot / Smart Snap 候補を返す

## MRL-21

### mRL-21-1 selection event capture

- parent: `MRL-21`
- status: `completed`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: bridge state store で selection history を保持する

### mRL-21-2 restore assist

- parent: `MRL-21`
- status: `in_progress`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: live assist に restore offer を返す

## MRL-22

### mRL-22-1 clean paste handoff

- parent: `MRL-22`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 正規化データを workbook 作業へ渡す導線を作る

### mRL-22-2 synthesizer workbook prep

- parent: `MRL-22`
- status: `in_progress`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: dataset handoff checklist を返す

## MRL-23

### mRL-23-1 live graph source sensing

- parent: `MRL-23`
- status: `in_progress`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: bridge table preview から graph 候補を返す

### mRL-23-2 graph edit assist

- parent: `MRL-23`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 設定補助を実作業へ接続する

## MRL-24

### mRL-24-1 live mode sensing

- parent: `MRL-24`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 実入力状態と IME 状態を取得する

### mRL-24-2 halo projection

- parent: `MRL-24`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 取得状態を Halo として返す

## MRL-25

### mRL-25-1 context-aware intent

- parent: `MRL-25`
- status: `completed`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: bridge selection と workbook 名を使う live intent 解釈を返す

### mRL-25-2 safety gating

- parent: `MRL-25`
- status: `in_progress`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: 文脈つき handoff checklist と提案限定ルールを返す

## MRL-26

### mRL-26-1 action handoff contract

- parent: `MRL-26`
- status: `in_progress`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: range / intent / graph / dataset 用の handoff checklist を返す

### mRL-26-2 assisted completion flow

- parent: `MRL-26`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 支援提案から作業完了までの流れを固める

## MRL-27

### mRL-27-1 end-to-end full implementation check

- parent: `MRL-27`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 全機能本実装の通し確認を行う

### mRL-27-2 full evidence close

- parent: `MRL-27`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 完了証跡を揃えて close する
