# 2026-03-15-014 Micro Release Lines

## mRL-10-1 recorder side preview tap

- parent: `MRL-10`
- status: `active`
- developer experience:
  - `TrialCpuImageVideoRecorder` に preview tap を追加し、保存経路を変えずに latest-only preview bus を作る
  - preview は `640x480` 系、`5fps` 始動、drop 前提とする
- verification method:
  - unit / local build で recorder 経路が維持されることを確認する
  - shared camera capture session の surface 構成を増やしていないことを確認する
- expected result:
  - recorder は録画を継続しつつ、preview 用最新フレームを別経路へ公開できる
- failure split:
  - preview tap が encode 遅延を増やすなら間引き頻度を下げる
  - preview tap が録画成立を壊すなら tap を guarded flag で無効化して復旧する
- next decomposition target:
  - `mRL-10-2 guarded UI preview renderer`

## mRL-10-2 guarded UI preview renderer

- parent: `MRL-10`
- status: `pending`
- developer experience:
  - replacement route recording 中だけ latest frame を UI に表示する
  - frozen route 復帰時は従来 preview へ戻す
- verification method:
  - 実機で recording 中に preview が静止ではなく更新されるかを見る
  - stop / failure / shutdown で preview renderer が録画を巻き込まないことを確認する
- expected result:
  - 保存アウトプットを崩さず、UX 上の「撮れている」確認が可能になる
- failure split:
  - UI renderer が不安定なら frame rate を下げる
  - main thread 負荷が高いなら latest-only / lower-resolution に戻す
- next decomposition target:
  - `mRL-10-3 device validation and documentation close`

## mRL-10-3 device validation and documentation close

- parent: `MRL-10`
- status: `pending`
- developer experience:
  - Xperia 5 III で `Use guarded replacement route` ON、`Start Session`、5 秒前後 recording、`Stop Session`、`Refresh` を通す
  - docs / develop / history を preview MVP 完了状態へ更新する
- verification method:
  - 実機観察
  - `required artifact 8 点` と manifest 整合の再確認
- expected result:
  - preview 更新あり、recording 成立、保存整合維持で `MRL-10` を閉じられる
- failure split:
  - preview 更新のみ失敗なら `mRL-10-2` へ戻して renderer 経路を見直す
  - recording / finalize が壊れるなら `mRL-10-1` まで rollback して tap を再設計する
- next decomposition target:
  - preview MVP 完了後の次 dated plan set
