# iAgents

Excel Online の横で動く Shadow Assistant prototype を試す独立実験 project。

## 入口

- 文書正本: `docs/index.md`
- 開発計画: `develop/index.md`
- 実行入口: `python -m iagents app`

## 現在の構成

- `src/iagents/`
  Windows launcher、Excel Online 検知、local HTTP server、analysis API、Shadow Assistant UI
- `data/seed/`
  scenario と検証用 seed
- `tests/`
  range suggestion、paste cleaning、data synthesis、intent 解釈の回帰確認

## ねらい

- Excel を改造せず、Excel Online と並べて使える外部支援 app を成立させる
- 普段の起動は Windows launcher から行い、必要なら Excel Online 検知で companion を自動で開く
- Range Pilot、Selection History、Clean Paste、Data Synthesizer、Intent Assist を prototype として一通り触れる
- 将来の local model / API model 接続点を semantic assist に集約する
