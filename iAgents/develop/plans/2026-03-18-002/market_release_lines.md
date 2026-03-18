# 2026-03-18-002 market release lines

## 目的

このファイルを `iAgents` の現行 MRL 正本とする。
bootstrap 期の `MRL-1` から `MRL-4` は履歴保持し、新しい Excel Shadow Assistant line は `MRL-5` から継続採番する。

## 運用ルール

- 新しい MRL を追加したら、この一覧へ必ず追記する。
- `status` は `completed` `in_progress` `planned` `blocked` を使う。
- `initial plan set` は最初に定義した dated plan set を示す。
- `latest touch` は最後に状態を更新した dated plan set を示す。

## Legacy Summary

- `MRL-1` から `MRL-4`:
  bootstrap / mock collaboration phase として completed 扱い。詳細は `2026-03-17-001` を参照する。

## Market Release Lines

| ID | status | name | initial plan set | latest touch | delivered value |
|---|---|---|---|---|---|
| MRL-5 | in_progress | shadow foundation and Windows sensing line | `2026-03-18-002` | `2026-03-18-002` | Excel 外部常駐の Shadow Bar と Windows sensing の土台を固定する |
| MRL-6 | planned | range rescue and smart selection line | `2026-03-18-002` | `2026-03-18-002` | Range Pilot、選択履歴、Smart Snap で巨大表選択 UX を改善する |
| MRL-7 | planned | clean paste and data synthesis line | `2026-03-18-002` | `2026-03-18-002` | 外部データ浄化と非破壊統合を実現する |
| MRL-8 | planned | graph editing and mode awareness line | `2026-03-18-002` | `2026-03-18-002` | グラフ編集導線と入力状態可視化を実装する |
| MRL-9 | planned | semantic shadow assist and safety line | `2026-03-18-002` | `2026-03-18-002` | 自然言語解釈、提案 safety、local model 接続を整備する |
