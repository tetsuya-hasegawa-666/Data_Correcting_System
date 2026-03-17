# マイクリリースライン計画

## 目的

この dated micro plan は、`MRL-6 guarded upstream trial` を `iSensorium` 内の rollback-safe な手順へ分解する。

## Micro Release Lines

| ID | 親 | 開発者体験 | 検証方法 | 期待結果 | 失敗時の分岐 | 次の分解対象 |
|---|---|---|---|---|---|---|
| mRL-6-1 | MRL-6 | 外側の session operation を public call surface を変えずに `shared-camera-session-adapter` 経由へ通せる | route resolution metadata に対する local code inspection と unit test | `startSession`、`stopSession`、`findLatestSession` は upstream から見て不変のまま、内部に seam が存在する | seam が upstream へ挙動漏れする / fallback logic が不明瞭 | manifest metadata と guarded route reporting |
| mRL-6-2 | MRL-6 | additive な guarded-trial metadata を出しても frozen session contract が安定したまま維持される | manifest shape と required file names に対する parser-facing sanity check を走らせる | downstream reader から見える required file set と timestamp basis が不変のまま保たれる | additive field が parser assumption を壊す / file set が drift する | reversible cutover gate の定義 |
| mRL-6-3 | MRL-6 | real runtime wiring 前でも replacement route が明示的に guarded かつ reversible のまま維持される | rollback anchor、requested-route と active-route の reporting、activation conditions を確認する | `corecamera_shared_camera_trial` を要求しても active frozen route が暗黙に置換されない | accidental cutover / rollback ambiguity | explicit acceptance 後にだけ real runtime wiring へ進む |

## 現在の順序

1. `mRL-6-1`
2. `mRL-6-2`
3. `mRL-6-3`

## 対象ガード

- `coreCamera/` は編集しない。
- 既存の session file 名は変更しない。
- parser-visible な manifest field を削除したり rename したりしない。
- default route を `frozen_camerax_arcore` から切り替えない。
