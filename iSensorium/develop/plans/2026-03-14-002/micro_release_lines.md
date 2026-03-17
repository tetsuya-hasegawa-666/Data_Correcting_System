# マイクリリースライン計画

## 目的

この文書は、各 Market Release Line を、開発者が実機スマホで体験し検証できる Micro Release Line へ分解する。

## 定義ルール

- 各 Micro Release は単独で体験可能であること。
- 各 Micro Release は実機確認行為を含むこと。
- 各 Micro Release は機能完成ではなく、体験可能な検証到達点として定義すること。
- 各 Micro Release は失敗時の次アクションを持つこと。

## Micro Release Lines

| ID | Parent | Developer Experience | Verification Method | Expected Result | Failure Split | Next Decomposition Target |
|---|---|---|---|---|---|---|
| mRL-0-1 | MRL-0 | アプリを起動し recording セッションを開始できる | Xperia 5 III で起動し開始操作を行う | セッション ID が発行される | UI 失敗 / permission 失敗 / session 初期化失敗 | session manager 骨格 |
| mRL-0-2 | MRL-0 | 疑似または実録画しつつ 1 センサログを保存できる | 録画開始後に保存ファイルを確認する | 少なくとも 1 ログファイルが保存される | camera 失敗 / sensor 失敗 / file I/O 失敗 | recorder + sensor collector 骨格 |
| mRL-0-3 | MRL-0 | 開発者が結果ファイルを読んで進行判断できる | 生成ファイル名、サイズ、時刻を確認する | 継続してよい判断ができる | ファイル構造不明 / timestamp 不整合 | session directory 設計 |
| mRL-1-1 | MRL-1 | 動画 + IMU を同時記録し同期キーを確認できる | 同時収集後に timestamp を比較する | 単調時刻基準で突合可能 | 動画時刻ズレ / IMU ドロップ | timestamp 正規化 |
| mRL-1-2 | MRL-1 | GNSS を併記し部分欠落でも session が壊れないことを確認する | 屋外で短時間歩行しログ確認 | GNSS 欠損時も session 継続 | location 権限 / raw 非対応 | GNSS fallback |
| mRL-1-3 | MRL-1 | BLE スキャンを録画中に継続できることを確認する | 周辺 BLE 環境で scan ログ確認 | RSSI と adv 要約が保存される | scan 不安定 / battery 負荷 | BLE scan policy |
| mRL-1-4 | MRL-1 | ARCore pose を併記し tracking 状態を記録できる | ARCore 対応環境で frame 取得を確認 | pose と tracking state が保存される | ARCore 初期化 / tracking failure | ARCore collector |
| mRL-2-1 | MRL-2 | 記録ファイルを Python で読んで再構成できる | 最小 parser で session 読み込み | session メタと stream の結合ができる | schema 不足 / key 不足 | upload/intermediate format |
| mRL-2-2 | MRL-2 | 圧縮後も後段利用に必要な情報が残ることを確認する | 圧縮前後で parser と統計を比較 | 主要指標が維持される | 過圧縮 / 復元不能 | stream 別圧縮方針 |
| mRL-2-3 | MRL-2 | 3DGS 系再利用に必要なメタデータ有無を確認する | frame pose と camera metadata を点検 | 再利用可否判断ができる | frame 情報不足 | metadata 拡張 |
| mRL-3-1 | MRL-3 | 15 分以上の記録で発熱と battery 消費を観測する | 実機連続動作試験 | 継続可能時間の基準が得られる | thermal throttling | 負荷優先順位 |
| mRL-3-2 | MRL-3 | 通信断状態でも session 回収できる | オフライン状態で記録して後確認 | local 保存で回収可能 | queue 不整合 / file flush 失敗 | uploader retry |
| mRL-3-3 | MRL-3 | 権限拒否や一部失敗でも部分取得 session が成立する | 権限を一部拒否して記録 | partial session が保存される | error propagation | fault-tolerant state |
| mRL-4-1 | MRL-4 | release line 変更要求を docs/develop へ反映できる | 変更要求を模擬投入し更新する | 変更の意味と影響が追跡される | 履歴漏れ / 境界混乱 | change operation |
| mRL-4-2 | MRL-4 | 開発履歴と変更文書 snapshot を対で残せる | develop 文書変更後に履歴確認 | 変更理由と対象文書が追える | snapshot 漏れ | develop history rule |
| mRL-4-3 | MRL-4 | 現在の到達点が次の体験へつながる | current release を更新し確認 | 次の最小検証単位が明確 | release 分解不足 | autonomous cycle |

## 現在の推奨順序

1. まず `mRL-0-1` から `mRL-0-3` を成立させる。
2. 次に `mRL-1-1` を最優先し、動画と IMU の同期から基盤を固める。
3. `mRL-4-1` と `mRL-4-2` は並走させ、変更追跡の規律を崩さない。
