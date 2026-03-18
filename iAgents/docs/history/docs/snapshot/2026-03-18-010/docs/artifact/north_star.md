# North Star

## Human Goal

Excel 利用者が、Excel 本体を壊さずに、選択、貼り付け、統合、グラフ、自然言語支援をほぼ無意識に受けられる状態を作る。  
最終的には、Excel Online 上の実際の状態を自動認識し、必要な提案や補助操作が自然につながることを目標とする。

## 一言でいうと

Excel は Excel のまま、ユーザーの能力だけを静かにブーストする。  
ただし、その実現は external companion app だけでは終わらない。最終目標は、Excel Online 上の状態認識と補助導線まで含めた本実装である。

## 原則

- 利用者は既存の Excel 操作を大きく変えない
- システムは勝手に書き換えるのではなく、まず提案と確認を返す
- 中間到達点は許容するが、最終目標を lower bar に落とさない
- external companion は一時的な到達目標であり、最終形そのものではない
- 最終的には Excel Online の実状態と結びついた支援が必要である

## 最終到達の定義

- Excel Online の実際の選択状態や文脈を取得できる
- Shadow Bar 相当の支援が作業中に自然に使える
- Range Pilot、Selection Time Machine、Smart Snap、Clean Paste、Data Synthesizer、Graph Shadow Editor、Input Mode Halo、Semantic Shadow Assist が実作業に接続される
- 利用者は外部メモに手入力しなくても、実際の workbook 文脈で支援を受けられる

## 中間到達点の扱い

- 現在の external companion app は有効な中間到達点である
- ただし、これは `本実装への足場` であって `最終目標の達成` ではない
- 文書と計画は、常に最終目標への未完了差分を見える形で保つ
