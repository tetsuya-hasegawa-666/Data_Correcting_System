# North Star

## Human Goal

Excel Online を使う人が、Excel 本体を改造せずに、外部の Shadow Assistant から選択、貼り付け、統合、グラフ、意図解釈の支援を受けられる状態を作る。

## 一言でいうと

Excel Online はそのまま、横にいる companion app が作業の詰まりを減らす。

## 価値

- add-in や browser extension を必須にせず、まずは side-by-side app として試せる
- 名前ボックス range、貼り付け候補、表データを人が受け渡すだけで支援を始められる
- ミスクリック、貼り付け崩れ、データ統合、グラフ迷子を低コストで軽減できる
- 自動確定より提案を優先し、心理的安全性を高く保てる

## 非交渉条件

- Excel Online の本体 DOM や保存形式を壊さない
- まずは外部 web companion app として成立させる
- 候補は preview と提案が中心で、自動実行は行わない
- prototype の各機能は local server と browser UI で再現できる

## UX 原則

1. 透明性
   ユーザーは「Excel が壊れた」と感じず、「横の道具が助けてくれる」と感じる。
2. 非侵襲
   Excel Online に依存しすぎず、別ウィンドウで運用できる。
3. 先回り補助
   Smart Snap、Clean Paste、Intent Assist がミスの前で支援する。
4. 視点維持
   Range Pilot と履歴で、今どこを見ていたかを失いにくくする。
5. 心理的安全性
   提案、履歴、非破壊統合、新ブック前提を守る。

## 今回の prototype 仮説

- Shadow Bar 風の外部 UI だけでも、心理的な入口として十分機能する
- Excel Online の名前ボックス range を手入力する運用でも、Range Pilot と Smart Snap の価値検証は可能
- Clean Paste、Data Synthesizer、Graph Suggestion、Intent Assist は browser companion app のみで成立する
