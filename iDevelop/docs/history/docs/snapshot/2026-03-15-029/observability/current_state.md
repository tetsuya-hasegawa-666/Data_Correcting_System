# Current State

## Current Position

- current plan set: `2026-03-15-005`
- current market release: `MRL-17`
- current micro release: `completed`
- thread purpose: consultation workspace plan set `2026-03-15-005` を completed 状態で閉じる

## Completed

- `2026-03-14-004 / MRL-5` から `MRL-9` まで完了
- generic project contract
- live document/data read
- change tracking
- generic code entry
- integrated UX check flow
- interaction contract
- document consultation line
- data consultation line
- shared conversation shell line
- code consultation phase-gate line
- proposal-to-action line
- safe apply line
- pilot interaction line
- `npm test` green
- `npm run build` green

## Active Risks

- export / multi-user / deeper automation は未着手
- live read-only manifest を超える apply 範囲は未導入

## Pending Change Requests

- 次 plan set で export / multi-user / deeper automation の優先順を決める

## Next Validation Point

- 次 plan set を作成し、consultation workspace の completed baseline から次拡張 line を起動する

## Completion Note

- `2026-03-15-005` は completed である。
- 次の session では completed baseline を崩さず、新 plan set を追加して進める。

### Decisions Made

- `iDevelop` の中心価値を generic read-only dashboard ではなく consultation workspace として再定義する
- must scope は document / data を維持し、conversation shell を shared-core 拡張として扱う
- code は phase gate を維持しつつ、相談材料としての read-only 参照価値を高める
- consultation contract の最小 schema を `bundle` `summary` `evidence` `next_action` `approval state` に固定する
- code consultation の初期 approval state を `phase-gated-read-only` に固定する
- document consultation UI は bundle selection、focus input、response panel を最小形として固定する
- data consultation UI は dataset selection、focus input、response panel を最小形として固定する
- shared shell は prompt、bundle、summary、history、proposal action を共通で保持する
- safe apply は seed mode の document/data に限定し、code は phase gate を維持する

### Open Issues

- export / multi-user / deeper automation の優先順は未決定
- live read-only 以外の apply policy は未定義

### Next Actions

1. completed baseline を保ったまま次 plan set を起動する
2. export / multi-user / deeper automation のどれを先に進めるか決める

### Risks / Assumptions

- 現行 system は consultation workspace の最小 pilot として成立している
- interaction contract、shared shell、proposal action、safe apply の最小線は固定できた
