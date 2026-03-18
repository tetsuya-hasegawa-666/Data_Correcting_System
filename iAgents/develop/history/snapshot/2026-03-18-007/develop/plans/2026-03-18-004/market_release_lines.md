# 2026-03-18-004 market release lines

## 位置づけ

このファイルを `iAgents` の implementation roadmap 用 MRL 正本とする。  
`MRL-10` から `MRL-18` は、Excel Online を横に置いて使う companion scope で実装完了とする。

## Market Release Lines

| ID | status | name | initial plan set | latest touch | delivered value |
|---|---|---|---|---|---|
| MRL-10 | completed | shadow bar operationalization line | `2026-03-18-004` | `2026-03-18-008` | launcher、desktop shortcut、Excel Online 検知、companion open 導線を実装 |
| MRL-11 | completed | range pilot v2 implementation line | `2026-03-18-004` | `2026-03-18-008` | Range Pilot 候補表示、PiP 要約、現在位置維持前提の提案 UI を実装 |
| MRL-12 | completed | selection recovery and smart snap line | `2026-03-18-004` | `2026-03-18-008` | Selection Time Machine と Smart Snap preview を実装 |
| MRL-13 | completed | graph shadow editor implementation line | `2026-03-18-004` | `2026-03-18-008` | グラフ候補、設定ラベル、編集指針の提示を実装 |
| MRL-14 | completed | clean paste implementation line | `2026-03-18-004` | `2026-03-18-008` | Markdown / CSV / TSV / 複数ブロック text の正規化を実装 |
| MRL-15 | completed | data synthesizer implementation line | `2026-03-18-004` | `2026-03-18-008` | 列名ゆれ吸収つきの dataset 統合 preview を実装 |
| MRL-16 | completed | input mode halo implementation line | `2026-03-18-004` | `2026-03-18-008` | mode + IME 状態を companion app で可視化する Halo を実装 |
| MRL-17 | completed | semantic shadow assist implementation line | `2026-03-18-004` | `2026-03-18-008` | 合計、拡張、グラフ、貼り付け、統合、復元の意図解釈を実装 |
| MRL-18 | completed | integrated validation and evidence close line | `2026-03-18-004` | `2026-03-18-008` | unittest、CLI smoke、API smoke、UX check 導線を揃えた |

## Companion Scope Note

- この完了は外部 companion app scope での完了を意味する。
- Excel Online の DOM 自動読取や直接操作は、この plan set の完了条件には含めない。
