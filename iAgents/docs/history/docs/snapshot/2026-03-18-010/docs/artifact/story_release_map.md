# Story Release Map

## 位置づけ

この文書は、ユーザーストーリーと release line の対応を示す。  
story の終点は companion app の完成ではなく、Excel Online 実文脈で機能が使える状態である。

## Story 一覧

| Story | 価値 | 主機能 | 現在地 | 最終完了条件 |
|---|---|---|---|---|
| Story 1 | 遠方を見失わずに選択できる | Shadow Bar, Range Pilot, Smart Snap | logic 実装済み | 実選択を読んで候補を返せる |
| Story 2 | 誤クリックからすぐ戻れる | Selection Time Machine | history UI 実装済み | 実選択履歴ベースで復元できる |
| Story 3 | 汚いデータをそのまま使わなくてよい | Clean Paste, Data Synthesizer | preview 実装済み | workbook 文脈へ直接つなげられる |
| Story 4 | グラフと入力状態を迷わず扱える | Graph Shadow Editor, Input Mode Halo | suggestion 実装済み | 実表 / 実入力状態に接続される |
| Story 5 | 自然言語で安全に次の行動を決められる | Semantic Shadow Assist | heuristic 実装済み | 実文脈つきで提案できる |

## Release Mapping

| target | release line |
|---|---|
| companion foundation 完了 | `2026-03-18-004 / MRL-10` から `MRL-18` |
| workbook bridge foundation | `2026-03-18-005 / MRL-19` |
| live range and state sensing | `2026-03-18-005 / MRL-20` から `MRL-22` |
| direct assist integration | `2026-03-18-005 / MRL-23` から `MRL-26` |
| final close | `2026-03-18-005 / MRL-27` |
