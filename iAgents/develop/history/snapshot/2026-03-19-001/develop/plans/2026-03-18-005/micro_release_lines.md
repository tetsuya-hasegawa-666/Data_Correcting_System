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
- status: `in_progress`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-19`
- result: 受け取った workbook state を保持し、`/api/bridge/assist` で Range / Snap / Halo へ接続する

## MRL-20

### mRL-20-1 live range capture

- parent: `MRL-20`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 実選択範囲を取得する

### mRL-20-2 live smart snap hookup

- parent: `MRL-20`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 実選択から Range Pilot / Smart Snap 候補を返す

## MRL-21

### mRL-21-1 selection event capture

- parent: `MRL-21`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 選択変更イベントを履歴へ送る

### mRL-21-2 restore assist

- parent: `MRL-21`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 実履歴ベースの復元補助を返す

## MRL-22

### mRL-22-1 clean paste handoff

- parent: `MRL-22`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 正規化データを workbook 作業へ渡す導線を作る

### mRL-22-2 synthesizer workbook prep

- parent: `MRL-22`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 統合 preview を workbook 文脈へつなぐ

## MRL-23

### mRL-23-1 live graph source sensing

- parent: `MRL-23`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 実表データから graph 候補を返す

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
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 実文脈つき意図解釈を返す

### mRL-25-2 safety gating

- parent: `MRL-25`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 安全な提案ルートを固定する

## MRL-26

### mRL-26-1 action handoff contract

- parent: `MRL-26`
- status: `planned`
- initial plan set: `2026-03-18-005`
- latest touch: `2026-03-18-005`
- result: 提案結果をユーザー作業へ返す contract を定める

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
