# Story Release Map

## 目的

Excel Online Shadow Assistant prototype を、体験価値と release line 単位で追跡できるようにする。

## Story 一覧

| Story | 価値 | 主機能 | prototype status | first release line |
|---|---|---|---|---|
| Story 1 | 現在地を失わずに範囲候補を見られる | Shadow Bar, Range Pilot, Smart Snap | completed | `MRL-5` |
| Story 2 | 選択ミスからすぐ戻れる | 選択履歴タイムマシン | completed | `MRL-6` |
| Story 3 | 貼り付けとデータ統合を整えられる | Clean Paste, Data Synthesizer | completed | `MRL-7` |
| Story 4 | グラフ候補と mode 可視化を見られる | Graph Shadow Editor, Input Mode Halo | completed | `MRL-8` |
| Story 5 | 自然言語から安全な候補を返せる | Semantic Shadow Assist | completed | `MRL-9` |

## Story 1

Excel Online を使う利用者として、名前ボックスの range を assistant に渡すだけで拡張候補を見たい。そうすれば、巨大表でも現在地を失いにくい。

- behavior leaves:
  - current range を入力すると Smart Snap 候補が返る
  - header 行を含む table guess が返る
  - Shadow Bar からこの機能へすぐ入れる
- acceptance:
  - `Sheet1!B3:D5` に対して候補 range が再現可能である

## Story 2

誤クリックが怖い利用者として、直近の range を最大 5 件まで保持したい。そうすれば、Excel Online で再入力しても戻りやすい。

- behavior leaves:
  - range を localStorage へ保存できる
  - 5 件まで保持する
  - 1 クリックで現在 range 入力欄へ戻せる

## Story 3

外部データを持ち込む利用者として、Markdown table や CSV を Excel Online 向けに浄化したい。そうすれば、貼り付け後の崩れを減らせる。

- behavior leaves:
  - Markdown table を TSV へ変換できる
  - single cell formula を返せる
  - 2 つの dataset を見出し union で統合できる

## Story 4

グラフ候補や入力状態で迷う利用者として、外部 assistant から候補だけ先に見たい。そうすれば、深い UI 迷子を減らせる。

- behavior leaves:
  - 数値列から chart family 候補を返せる
  - mode halo を外部 UI で可視化できる

## Story 5

自然言語だけで意図を伝えたい利用者として、「一番下まで」「売上を合計」を候補へ変換してほしい。そうすれば、操作を覚えずに支援を受けられる。

- behavior leaves:
  - 指示を action と details に解釈できる
  - range があれば target_range を返せる
  - safety note を常に返す
