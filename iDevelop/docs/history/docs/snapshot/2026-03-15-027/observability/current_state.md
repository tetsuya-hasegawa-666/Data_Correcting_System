# Current State

## Current Position

- current plan set: `2026-03-15-005`
- current market release: `MRL-12`
- current micro release: `mRL-12-1`
- thread purpose: document consultation line を閉じ、data consultation line の入口を固定する

## Completed

- `2026-03-14-004 / MRL-5` から `MRL-9` まで完了
- generic project contract
- live document/data read
- change tracking
- generic code entry
- integrated UX check flow
- interaction contract
- document consultation line
- `npm test` green
- `npm run build` green

## Active Risks

- write/apply を急ぐと safety boundary が崩れる
- data consultation と document consultation の bundle 粒度を揃えないと shared shell が不統一になる
- document response と data response の evidence 粒度を揃えないと cross-workspace shell が崩れる

## Pending Change Requests

- データ consultation line を document line と同じ contract で接続する
- write / export / multi-user は consultation line 後の gate として扱う

## Next Validation Point

- `MRL-12` の `mRL-12-1` 完了後は、block がなければ同じ session のまま `mRL-12-2` と `mRL-12-3` へ進み、data consultation line を閉じる

## Continuation Note

- この欄は停止指示ではなく、継続実装中の現在地共有である。
- user 操作待ち、追加データ待ち、承認待ちがない限り、active な `MRL-12` を閉じるまで同一 session で進める。
- session 継続上限は 6 時間であり、15 分前後で区切る前提は置かない。

### Decisions Made

- `iDevelop` の中心価値を generic read-only dashboard ではなく consultation workspace として再定義する
- must scope は document / data を維持し、conversation shell を shared-core 拡張として扱う
- code は phase gate を維持しつつ、相談材料としての read-only 参照価値を高める
- consultation contract の最小 schema を `bundle` `summary` `evidence` `next_action` `approval state` に固定する
- code consultation の初期 approval state を `phase-gated-read-only` に固定する
- document consultation UI は bundle selection、focus input、response panel を最小形として固定する

### Open Issues

- data consultation UI は未実装
- apply approval flow の境界は未定義

### Next Actions

1. `2026-03-15-005 / MRL-12 / mRL-12-1` の failing test を dataset selection から開始する
2. data consultation input / response panel を実装する

### Risks / Assumptions

- 現行 system は read-only dashboard としては成立している
- 次の開発は `2026-03-14-004` の completed artifact を土台に consultation 機能を重ねる
- interaction contract は fixed だが shared conversation shell の history shape は未確定
