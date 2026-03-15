# マイクリリースライン計画

## 目的

`MRL-8 guarded upstream stabilization` と `MRL-9 user UX check ready` を、小さな差分と rollback 可能性を維持したまま閉じる。

## Micro Release Lines

| ID | 親 | 体験内容 | 検証方法 | 期待結果 | 失敗時の切分け | 次の分解対象 |
|---|---|---|---|---|---|---|
| mRL-8-1 | MRL-8 | replacement route の start / stop / failure / shutdown が frozen preview 復帰込みで安定する | unit test、build、コード inspection | trial runtime の停止・失敗・終了で rollback 導線が崩れず、preview と status が回復する | lifecycle state mismatch / resource leak / preview 再初期化 failure | refresh と UX 観察点 |
| mRL-8-2 | MRL-8 | `Refresh` と latest session 表示が replacement route の manifest / file shape を理解しやすく示す | unit test、manual-read 用 UI 文字列確認、parser regression | guarded route 情報、fallback 有無、required artifact が評価しやすい | metadata drift / refresh confusion | rollback drill と UX 文書 |
| mRL-8-3 | MRL-8 | rollback と failure split が code / docs 両方で説明可能になる | build、parser regression、current state 更新 | `MRL-8` が blocker なしで閉じ、`MRL-9` へ渡せる | error path ambiguity / docs lag | user UX check ready |
| mRL-9-1 | MRL-9 | `UX_check_work_flow.md` が replacement route 前提の観察点と判断点を含む | 文書読解確認 | 利用者が route、fallback、session 保存結果、refresh 反映を観察できる | user step 漏れ / rollback 手順不明瞭 | current state と history |
| mRL-9-2 | MRL-9 | current state / release map / develop が user UX check ready 状態を示す | docs/develop 整合確認 | live 文書を読めば次が利用者 UX 確認だと分かる | source-of-truth と develop の不整合 | final handoff |
| mRL-9-3 | MRL-9 | 利用者 UX 確認後の採用 / guarded 継続 / rollback 分岐が明示される | 文書読解確認 | 実 UX 確認の出口条件が曖昧でない | decision branch 不足 | user UX check execution |

## 現在の順序

1. `mRL-8-1` completed
2. `mRL-8-2` completed
3. `mRL-8-3` completed
4. `mRL-9-1` completed
5. `mRL-9-2` completed
6. `mRL-9-3` completed

## 完了メモ

- `mRL-8-1`: replacement route の stop / failure / shutdown 終端で frozen preview 復帰、resource cleanup、error-aware finalize を揃えた。
- `mRL-8-2`: `Refresh` と session summary に route / guard / file 情報を再表示し、replacement route 観察をしやすくした。
- `mRL-8-3`: `./gradlew.bat clean assembleDebug testDebugUnitTest` と `python -m unittest python.test_session_parser` を再通過し、stabilization の出口条件を閉じた。
- `mRL-9-1`: `Use guarded replacement route` switch と対応 UX 文書を追加し、利用者が replacement route を選べるようにした。
- `mRL-9-2`: current state / release map / develop / system blueprint を user UX check ready 状態へ更新した。
- `mRL-9-3`: `UX_check_work_flow.md` に採用 / guarded 継続 / rollback の分岐と replacement route 観察点を明記した。

## 対象ガード

- 変更は `iSensorium/` 配下のみで行う。
- `coreCamera/` 側コードは参照のみとし、直接編集しない。
- default route は引き続き `frozen_camerax_arcore` を維持する。
- rollback anchor `rollback-isensorium-pre-upstream-trial-2026-03-15-001` を崩さない。
- long duration / thermal endurance は今回の plan set に含めない。
