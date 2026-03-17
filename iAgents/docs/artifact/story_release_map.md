# Story Release Map

## 目的

軽量 multi-agent 協働実験を、価値単位と release line 単位で追跡できるようにする。

## Story

### Story 1

1 件の brief から、複数 agent が異なる観点を返し、統合案を出せる。

- value:
  単観点の見落としを減らす
- first release line:
  `MRL-1`

### Story 2

mock から本物の lightweight model provider へ置き換えても、協働ループを保てる。

- value:
  実験から実用へ移る差し替えコストを下げる
- first release line:
  `MRL-2`

### Story 3

複数の brief で比較評価し、役割や round 数の妥当性を検証できる。

- value:
  協働設計の再現性を判断できる
- first release line:
  `MRL-3`
