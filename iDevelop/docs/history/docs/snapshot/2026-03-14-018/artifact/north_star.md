# North Star

## Human Goal

Codex と人間の協働で、document、data、code を 1 つの dashboard から扱える運用基盤を作る。
最初は dummy data で UX を固め、その後は実体 project に接続し、変化し続ける対象にも追従しながら本番仮運用まで持っていく。

## Scope Boundary

- この project の変更対象は `iDevelop/` 配下だけとする。
- companion project `iSensorium/` には境界ルール変更時だけ反映する。
- dashboard は Codex による継続開発を前提にする。

## Non-Negotiables

- MVC を崩さない。
- BDD でストーリーを定義し、TDD で実装を進める。
- must scope は document / data を先に成立させる。
- code workspace は optional scope とし、最初の live connection でも read-only を守る。
- release line と plan set は、ユーザーが別指定しない限り連番で追加する。
- 一度採用した記載データ、ID、名称、状態名、成果物名は、明示変更がない限り継続利用する。

## Reuse Direction

- 他 project にコピーして使える project contract を持つ。
- project ごとの path 差異は manifest で吸収する。
- document / data / code の読込は recursive read を基本とする。
- 最初の live connection は read-first と safety-first を守る。

## Success Criteria For The Current Phase

- generic project contract が source-of-truth に固定されている。
- recursive read rule が明文化されている。
- generic setup 手順が `UX_check_work_flow.md` に反映されている。
