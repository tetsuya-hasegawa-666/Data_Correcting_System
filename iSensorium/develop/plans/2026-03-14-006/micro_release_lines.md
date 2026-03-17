# マイクリリースライン計画

## 目的

この文書は、最新版 Market Release Line を、次セッションでそのまま実装着手できる Micro Release Line に分解したものである。

## 定義ルール

- 各 Micro Release は単独で体験可能であること。
- 各 Micro Release は実機確認行為を含むこと。
- 各 Micro Release は失敗時の次アクションを持つこと。
- 次セッションの初手は 1 セッション内で完了可否が判断できる粒度に限定する。

## Micro Release Lines

| ID | Parent | Developer Experience | Verification Method | Expected Result | Failure Split | Next Decomposition Target |
|---|---|---|---|---|---|---|
| mRL-0-1 | MRL-0 | アプリを起動し recording session を開始できる | Xperia 5 III で開始操作を行う | session id が発行される | UI / permission / session init | session manager |
| mRL-0-2 | MRL-0 | 疑似または実録画しつつ 1 センサを保存できる | 録画開始後にファイルを確認する | 少なくとも 1 ログが保存される | camera / sensor / file I/O | recorder + sensor collector |
| mRL-0-3 | MRL-0 | 開発者が session directory を見て継続判断できる | 出力ファイル名、サイズ、時刻を確認する | 継続可否が判断できる | directory 不明 / naming 不整合 | session directory contract |
| mRL-1-1 | MRL-1 | 動画 + IMU を同時記録できる | 同時収集後に両ログを確認する | 動画と IMU が同一 session に載る | recorder drift / IMU drop | session timestamp capture |
| mRL-1-2 | MRL-1 | 共通 timestamp 基準で動画と IMU を突合できる | monotonic time と frame time を比較する | 後段で突合可能なキーが得られる | timestamp offset / frame key 不足 | timestamp normalization |
| mRL-1-3 | MRL-1 | 5 分未満の短時間記録を安定完了できる | 実機短時間試験を 3 回行う | 連続で session 完了する | thermal / permission regression | short stability harness |
| mRL-2-1 | MRL-2 | GNSS を追加して部分欠落でも session が壊れない | 屋外で短時間歩行して確認 | GNSS 欠損時も session 継続 | location permission / raw unsupported | GNSS fallback |
| mRL-2-2 | MRL-2 | BLE scan を録画中に継続できる | BLE 環境で adv 要約を確認 | RSSI と adv summary が保存される | scan instability / battery load | BLE scan policy |
| mRL-2-3 | MRL-2 | ARCore pose を記録できる | ARCore 対応環境で frame を確認 | pose と tracking state が保存される | init / tracking failure | ARCore collector |
| mRL-2-4 | MRL-2 | 3 センサ以上同時でも session が破綻しない | 複合構成で短時間試験 | partial failure 許容で継続 | resource contention | sensor prioritization |
| mRL-3-1 | MRL-3 | Python で session を読み込める | 最小 parser で 1 session 読み込み | metadata と stream が読める | schema 不足 / file naming | parser contract |
| mRL-3-2 | MRL-3 | 動画とセンサの結合キーが妥当と判断できる | parser で join を試す | join 成功 | key 不足 / timestamp mismatch | join key revision |
| mRL-3-3 | MRL-3 | 圧縮前に必要メタが揃っているか判断できる | 3DGS 系再利用観点で点検 | 圧縮前の必須項目が確定 | metadata gap | compression boundary |
| mRL-4-1 | MRL-4 | 15 分未満で発熱と battery 傾向を観測する | 実機連続記録試験 | 継続可能時間の目安が得られる | thermal throttling | load prioritization |
| mRL-4-2 | MRL-4 | 通信断でも local 回収できる | offline 状態で記録し確認 | local 保存で回収可能 | flush failure / queue mismatch | uploader retry contract |
| mRL-4-3 | MRL-4 | 権限拒否や一部失敗でも partial session が残る | 一部 permission 拒否で試験 | partial session 保存 | error propagation | fault-tolerant state |
| mRL-5-1 | MRL-5 | release line 変更要求を docs/develop へ反映できる | 変更要求を模擬投入し更新 | line 変更の意味と影響が追跡される | history miss / boundary confusion | change operation |
| mRL-5-2 | MRL-5 | develop 履歴と snapshot を対で残せる | plan 更新後に履歴確認 | 変更理由と対象文書が追える | snapshot miss | history discipline |
| mRL-5-3 | MRL-5 | 次の最小検証単位が常に明確である | current target を更新し確認 | 次アクションが明確 | decomposition too large | autonomous cycle |

## 直近の開始順序

1. `mRL-0-1`
2. `mRL-0-2`
3. `mRL-0-3`
4. `mRL-1-1`
5. `mRL-1-2`

## 初手にしない項目

- `mRL-2-4`
- `mRL-3-3`
- `mRL-4-1`

これらは基礎同期 spine が成立してから着手する。
