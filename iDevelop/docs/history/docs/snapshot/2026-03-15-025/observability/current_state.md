# Current State

## Current Position

- current plan set: `2026-03-15-005`
- current market release: `MRL-11`
- current micro release: `mRL-11-1`
- thread purpose: read-only dashboard から user-Codex consultation workspace への設計転換を文書化し、最初の interaction line に着手できる状態へ進める

## Completed

- `2026-03-14-004 / MRL-5` から `MRL-9` まで完了
- generic project contract
- live document/data read
- change tracking
- generic code entry
- integrated UX check flow
- interaction contract
- `npm test` green
- `npm run build` green

## Active Risks

- consultation contract が未定義のまま UI を先行すると再設計コストが高い
- write/apply を急ぐと safety boundary が崩れる
- data consultation と document consultation の bundle 粒度を揃えないと shared shell が不統一になる

## Pending Change Requests

- consultation-first な新 plan set を起動する
- 文書 / データ / コードを相談材料として扱う UX を整備する
- write / export / multi-user は consultation line 後の gate として扱う

## Next Validation Point

- `MRL-11` で document bundle selection、focus input、response panel を green にし、UX check と current_state を更新する

## Handoff Note

### Decisions Made

- `iDevelop` の中心価値を generic read-only dashboard ではなく consultation workspace として再定義する
- must scope は document / data を維持し、conversation shell を shared-core 拡張として扱う
- code は phase gate を維持しつつ、相談材料としての read-only 参照価値を高める
- consultation contract の最小 schema を `bundle` `summary` `evidence` `next_action` `approval state` に固定する
- code consultation の初期 approval state を `phase-gated-read-only` に固定する

### Open Issues

- document consultation UI は未実装
- apply approval flow の境界は未定義

### Next Actions

1. `2026-03-15-005 / MRL-11 / mRL-11-1` の failing test を文書 bundle selection から開始する
2. document consultation input / response panel を実装する

### Risks / Assumptions

- 現行 system は read-only dashboard としては成立している
- 次の開発は `2026-03-14-004` の completed artifact を土台に consultation 機能を重ねる
- interaction contract は fixed だが shared conversation shell の history shape は未確定
