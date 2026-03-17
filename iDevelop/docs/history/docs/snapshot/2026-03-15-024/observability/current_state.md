# Current State

## Current Position

- current plan set: `2026-03-15-005`
- current market release: `MRL-10`
- current micro release: `mRL-10-1`
- thread purpose: read-only dashboard から user-Codex consultation workspace への設計転換を文書化し、最初の interaction line に着手できる状態へ進める

## Completed

- `2026-03-14-004 / MRL-5` から `MRL-9` まで完了
- generic project contract
- live document/data read
- change tracking
- generic code entry
- integrated UX check flow
- `npm test` green
- `npm run build` green

## Active Risks

- consultation contract が未定義のまま UI を先行すると再設計コストが高い
- write/apply を急ぐと safety boundary が崩れる
- data/code の相談粒度を揃えないと shared shell が不統一になる

## Pending Change Requests

- consultation-first な新 plan set を起動する
- 文書 / データ / コードを相談材料として扱う UX を整備する
- write / export / multi-user は consultation line 後の gate として扱う

## Next Validation Point

- `MRL-10` で consultation session contract、input bundle、response contract、approval state を source-of-truth に固定する

## Handoff Note

### Decisions Made

- `iDevelop` の中心価値を generic read-only dashboard ではなく consultation workspace として再定義する
- must scope は document / data を維持し、conversation shell を shared-core 拡張として扱う
- code は phase gate を維持しつつ、相談材料としての read-only 参照価値を高める

### Open Issues

- consultation contract の具体 schema は未定義
- apply approval flow の境界は未定義

### Next Actions

1. `2026-03-15-005 / MRL-10` の source-of-truth を具体化する
2. consultation contract に沿って micro release と TDD task を定義する

### Risks / Assumptions

- 現行 system は read-only dashboard としては成立している
- 次の開発は `2026-03-14-004` の completed artifact を土台に consultation 機能を重ねる
