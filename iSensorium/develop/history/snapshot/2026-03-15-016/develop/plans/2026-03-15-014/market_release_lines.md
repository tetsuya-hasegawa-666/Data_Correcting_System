# 2026-03-15-014 Market Release Lines

## active target

- market release id: `MRL-10`
- name: `guarded replacement preview MVP`
- status: `completed`

## purpose

- guarded replacement route の recording 成立と保存アウトプット整合を維持したまま、live preview を MVP として追加する
- shared camera capture session の target は増やさず、保存用フレーム複製から UI preview を作る

## entrance criteria

- `MRL-9` 完了状態が source-of-truth と develop に固定されている
- `Use guarded replacement route` の短間隔 toggle crash が解消している
- replacement route session の required artifact 8 点と manifest `files.sizeBytes` 整合が実機で確認済みである
- Xperia 5 III で preview surface を shared camera capture session に追加する案は `configuration failed` で不成立と確認済みである

## exit criteria

- replacement route recording 中に `640x480` 系 `5fps` 始動の preview が UI で更新される
- recording 開始、停止、`Refresh`、saved files、manifest 整合が維持される
- preview 系 failure が recorder / session finalize を巻き込まない
- docs / develop / history が preview MVP 完了状態へ更新される

## linked micro releases

- `mRL-10-1 recorder side preview tap`
- `mRL-10-2 guarded UI preview renderer`
- `mRL-10-3 device validation and documentation close`

## guardrails

- `iSensorium/` 配下のみ変更する
- shared camera capture session の app surface は増やさない
- session in/out contract と manifest schema は変えない
- rollback anchor `rollback-isensorium-pre-upstream-trial-2026-03-15-001` を崩さない
- preview は best-effort とし、録画と保存完了を優先する
