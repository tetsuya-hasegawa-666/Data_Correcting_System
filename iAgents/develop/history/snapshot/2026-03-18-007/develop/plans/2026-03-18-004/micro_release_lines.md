# 2026-03-18-004 micro release lines

## 位置づけ

このファイルを `iAgents` の implementation roadmap 用 mRL 正本とする。  
各 mRL は companion scope の実装と確認により completed とする。

## MRL-10

### mRL-10-1 launcher, shortcut, and auto-open stabilization

- parent: `MRL-10`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: 1 click 起動、前面表示、Excel Online 検知、companion open を実装

### mRL-10-2 startup diagnostics and fallback route

- parent: `MRL-10`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: debug launcher、health check、fallback open 導線を追加

## MRL-11

### mRL-11-1 range pilot interaction model

- parent: `MRL-11`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: Range Pilot の入力 contract、候補範囲、PiP preview を実装

### mRL-11-2 range pilot confirmation run

- parent: `MRL-11`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: CLI と web UI で候補生成の確認導線を整備

## MRL-12

### mRL-12-1 selection history recovery flow

- parent: `MRL-12`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: 直前 5 件の履歴保持と復元候補 UI を実装

### mRL-12-2 smart snap confidence tuning

- parent: `MRL-12`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: header、右端列、下端行の不足推定と confidence 算出を実装

## MRL-13

### mRL-13-1 graph recommendation enrichment

- parent: `MRL-13`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: bar / line / combo 系の graph suggestion と設定ラベルを実装

### mRL-13-2 graph ux validation

- parent: `MRL-13`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: companion app 上でグラフ候補比較の確認導線を整備

## MRL-14

### mRL-14-1 clean paste normalization hardening

- parent: `MRL-14`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: Markdown、CSV、TSV、複数ブロック text の正規化を実装

### mRL-14-2 clean paste confirmation set

- parent: `MRL-14`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: 1 セル式と TSV 出力の両方を確認できるようにした

## MRL-15

### mRL-15-1 synthesizer schema matching

- parent: `MRL-15`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: 列名ゆれを吸収する canonical header matching を実装

### mRL-15-2 synthesizer confirmation run

- parent: `MRL-15`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: dataset 統合 preview と列対応 report を実装

## MRL-16

### mRL-16-1 halo state model

- parent: `MRL-16`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: input、edit、formula、selection と IME 状態をモデル化

### mRL-16-2 halo usefulness validation

- parent: `MRL-16`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: launcher と web UI の両方から Halo 表示を確認可能にした

## MRL-17

### mRL-17-1 semantic command coverage expansion

- parent: `MRL-17`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: 合計、拡張、グラフ、貼り付け、統合、復元の command coverage を実装

### mRL-17-2 semantic safety guard tuning

- parent: `MRL-17`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: 自動実行せず提案のみ返す safety note を統一

## MRL-18

### mRL-18-1 end-to-end manual ux check

- parent: `MRL-18`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: launcher から companion app までの確認手順を整備

### mRL-18-2 completion evidence close

- parent: `MRL-18`
- status: `completed`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-008`
- result: unittest、CLI smoke、API smoke を evidence として反映
