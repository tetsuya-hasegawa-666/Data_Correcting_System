# Current State

## Current Position

- current plan set: `2026-03-14-004`
- current market release: `MRL-7`
- current micro release: `mRL-7-1`
- thread purpose: live read line を閉じ、change tracking line の最初の slice へ進める

## Completed

- `2026-03-14-004 / MRL-5` の generic project contract line を完了
- `2026-03-14-004 / MRL-6` の live document/data read line を完了
- project manifest `config/project-manifest.json` を追加
- Vite middleware から manifest ベースの live snapshot を返す read-only route `/api/dashboard/live-state` を追加
- document/data を recursive scan で読み込む node-side snapshot loader を追加
- dashboard 起動時に live snapshot を優先し、取得失敗時は seed + browser storage へ fallback する bootstrap を追加
- live source 接続時は document/data を read-only 表示に切り替え、`再読み込み` で refresh できるようにした
- `npm test` green
- `npm run build` green

## Active Risks

- refresh は現時点では full reload で、差分表示や stale indicator は未実装
- manifest path の妥当性確認は line 単位の contract に留まり、UI 側の詳細診断は未実装
- code/script の live read は未着手で、optional scope の read-only browse は `MRL-8` に残る

## Pending Change Requests

- refresh policy と stale indicator を定義する
- refresh 結果の evidence を UI と履歴に残す
- code/script roots の generic contract を live source へ広げる
- pilot setup / rollback / evidence log を本番仮運用手前まで整理する

## Next Validation Point

- `mRL-7-1` で refresh policy / stale contract を BDD/TDD で確定する

## Handoff Note

### Decisions Made

- `MRL-6` の live read は backend 常設ではなく、`npm run dashboard` の Vite middleware で read-only snapshot を返す形にした
- live source 接続時の document/data は read-only を優先し、編集・更新 UI は出さない
- refresh UX は `再読み込み` ボタンで full reload とし、差分検知は `MRL-7` に送った

### Open Issues

- stale indicator と diff evidence は未実装
- manifest 読み込み失敗時の UI 詳細診断は未実装

### Next Actions

1. `mRL-7-1` の stale / refresh policy を文書と failing test で固定する
2. `mRL-7-2` の stale indicator を controller/view に追加する
3. `mRL-7-3` で refresh evidence の最小ログを UX check に反映する

### Risks / Assumptions

- live connection は引き続き read-only first で扱う
- seed + browser storage fallback は exploratory check と build 用の補助導線として維持する
- code workspace は `MRL-8` まで static read-only のまま維持する
