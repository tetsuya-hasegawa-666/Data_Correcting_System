# 2026-03-17-015 マイクリリースライン計画

## mRL-11-1 standard and pocket mode definition

- parent: `MRL-11`
- status: `active`
- developer experience:
  - `standard_handheld` と `pocket_recording` を同一命名規則で定義する
  - mode の意味を UI、manifest、viewer 導線で共有できるようにする
- verification method:
  - docs / develop / current_state の名称一致確認
  - mode ごとの利用者価値と観測点の確認
- expected result:
  - mode 名称と用途が揺れず、以後の実装と viewer 連携の基準になる
- failure split:
  - mode 定義が曖昧なら利用者アクティビティへ戻って再定義する
  - viewer 側で使えない粒度なら `mRL-11-2` 前に contract を絞り直す
- next decomposition target:
  - `mRL-11-2 mode metadata and export contract`

## mRL-11-2 mode metadata and export contract

- parent: `MRL-11`
- status: `pending`
- developer experience:
  - session manifest と export 契約に mode-aware field を追加する
  - `iDevelop` 側 viewer が必要とする最小項目を固定する
- verification method:
  - parser-visible additive metadata の整合確認
  - viewer 連携観点の項目確認
- expected result:
  - mode 差分を後段で UI 表示できる session/export contract が定義される
- failure split:
  - parser 互換性を壊すなら additive field に限定し直す
  - viewer 要件が過大なら最小項目へ再圧縮する
- next decomposition target:
  - `mRL-11-3 documentation and state alignment`

## mRL-11-3 documentation and state alignment

- parent: `MRL-11`
- status: `pending`
- developer experience:
  - docs / current_state / develop / history を mode 契約前提へ更新する
- verification method:
  - source-of-truth と plan の参照整合確認
- expected result:
  - `MRL-11` が次段実装の基準として読める
- failure split:
  - 命名ずれが残るなら `mRL-11-1` へ戻る
  - contract 記載漏れがあれば `mRL-11-2` を再度補完する
- next decomposition target:
  - `mRL-12-1 japanese UI scope definition`

## mRL-12-1 japanese UI scope definition

- parent: `MRL-12`
- status: `pending`
- developer experience:
  - 日本語化可能箇所とアルファベット維持箇所を仕分ける
- verification method:
  - UI 文言一覧と識別子一覧の境界確認
- expected result:
  - 日本語 UI 方針が曖昧さなく固定される
- failure split:
  - 命名衝突があれば相談対象として明示する
- next decomposition target:
  - `mRL-12-2 mode selection UI and controller split`

## mRL-12-2 mode selection UI and controller split

- parent: `MRL-12`
- status: `pending`
- developer experience:
  - mode selection UI と controller 責務を切り分ける
- verification method:
  - MVC 観点の責務表確認
- expected result:
  - mode 選択導線と recording 制御が読みやすい構造になる
- failure split:
  - UI と controller が混線するなら責務を再分解する
- next decomposition target:
  - `mRL-12-3 mvc boundary and retest policy close`

## mRL-12-3 mvc boundary and retest policy close

- parent: `MRL-12`
- status: `pending`
- developer experience:
  - View / Controller / Model の責務整理と再テスト条件を固定する
- verification method:
  - docs / plan / UX workflow の整合確認
- expected result:
  - 次段の実装が MVC と再テスト方針を前提に開始できる
- failure split:
  - 境界が曖昧なら `mRL-12-2` へ戻る
- next decomposition target:
  - `mRL-13-1 recorder and session error handling`

## mRL-13-1 recorder and session error handling

- parent: `MRL-13`
- status: `pending`
- developer experience:
  - recorder、session、permission、preview、export の error class を分ける
- verification method:
  - error state の一覧と回復導線確認
- expected result:
  - 失敗しても次 action が判断しやすい
- failure split:
  - 巻き込み範囲が大きいなら failure class を再分解する
- next decomposition target:
  - `mRL-13-2 pocket mode fallback and warning flow`

## mRL-13-2 pocket mode fallback and warning flow

- parent: `MRL-13`
- status: `pending`
- developer experience:
  - pocket mode の warning、fallback、retry を整理する
- verification method:
  - user action 要否と fallback 表示の確認
- expected result:
  - 収納時前提の運用でも迷いにくい
- failure split:
  - fallback が不明瞭なら warning 文言と状態分離を見直す
- next decomposition target:
  - `mRL-13-3 completion evidence rule close`

## mRL-13-3 completion evidence rule close

- parent: `MRL-13`
- status: `pending`
- developer experience:
  - `Codex retest` と `user validation` の採用条件を current state と history に残せるようにする
- verification method:
  - 完了根拠の記載位置と表記確認
- expected result:
  - 完了判定の根拠が後から追跡できる
- failure split:
  - 根拠の記録先が曖昧なら process 文書へ戻って補強する
- next decomposition target:
  - 次の dated plan set
