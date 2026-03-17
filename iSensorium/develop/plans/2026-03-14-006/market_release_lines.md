# 市場リリースライン計画

## 目的

この文書は、次の実装セッション開始時点で迷いなく着手できるよう、`iSensorium` の Market Release Line を実装可能な順序へ再編した最新版である。

## 妥当性レビュー

現行見直しで修正した点は次のとおり。

- 旧 `MRL-1` は、同期 spine と全センサ統合を同時に背負っており広すぎた。
- 次セッションの最初の実装対象としては、Video + Session + Timestamp + IMU を先に成立させるほうが妥当である。
- GNSS、BLE、ARCore は同期 spine 成立後の拡張 release として分離したほうが、進捗判定と障害切り分けが容易である。

## ゲート状態

| RL | 状態 | 理由 |
|---|---|---|
| RL-0 | ready | 実装開始用の最小 spine が定義済み |
| RL-1 | ready_after_RL0 | 同期 spine は妥当だが、基礎記録体験成立が前提 |
| RL-2 | blocked | 拡張センサ統合は基礎同期成立前では広すぎる |
| RL-3 | blocked | 後段再利用性は基礎ログと同期キーの確定が先 |
| RL-4 | blocked | 長時間運用評価は基礎記録成立前では測れない |
| RL-5 | ready | 変更追跡と Human + AI 継続研究の運用は並走可能 |

## Market Release Lines

| ID | Name | Delivered Value | Entrance Criteria | Exit Criteria | Linked Micro Releases | Change Drivers |
|---|---|---|---|---|---|---|
| MRL-0 | 基礎記録体験成立ライン | 開発者が実機で「起動、開始、保存、確認」を一連体験できる | session、保存先、最小 UI 方針がある | 開発者が結果ファイルを見て継続判断できる | mRL-0-1, mRL-0-2, mRL-0-3 | 初期 UX 学習、権限導線 |
| MRL-1 | 同期 spine 成立ライン | 動画 + IMU + 共通 timestamp + session が破綻なく記録できる | MRL-0 成立 | 単調時刻基準で動画と IMU を確実に突合できる | mRL-1-1, mRL-1-2, mRL-1-3 | camera timestamp、IMU drop |
| MRL-2 | 拡張センサ統合ライン | GNSS、BLE、ARCore を session 破綻なしで段階統合できる | MRL-1 成立 | 各拡張センサが部分欠落許容で同じ session に載る | mRL-2-1, mRL-2-2, mRL-2-3, mRL-2-4 | センサ可用性、発熱、権限制約 |
| MRL-3 | 後段再利用データ成立ライン | Python 側で読め、軌跡解析や 3DGS 系判断に使えるデータ構造が成立する | MRL-1 と最低 1 つの拡張センサ成立 | parser、結合キー、主要メタデータの妥当性が確認される | mRL-3-1, mRL-3-2, mRL-3-3 | 保存形式、圧縮率、再解析要件 |
| MRL-4 | 屋外運用成立ライン | 通信断、発熱、権限拒否、部分欠落下でもセッション回収できる | MRL-1 成立 | 15 分級の連続記録で回収可能性と劣化条件が把握される | mRL-4-1, mRL-4-2, mRL-4-3 | バッテリー、通信品質、OS 制約 |
| MRL-5 | Human + AI 継続研究成立ライン | release line 再編と変更追跡を保ちつつ研究開発を継続できる | docs/develop 規約が有効 | 変更要求が line と検証計画へ継続反映される | mRL-5-1, mRL-5-2, mRL-5-3 | 研究価値再定義、優先度変化 |

## 推奨順序

1. 最初の実装セッションは `MRL-0` を完了し、そのまま `MRL-1` へ入る。
2. `MRL-2` は GNSS、BLE、ARCore を一括ではなく個別に開く。
3. `MRL-3` は `MRL-2` と往復しながら保存形式を固める。
4. `MRL-4` は `MRL-1` 成立直後から短時間試験で前倒し観測してよい。
5. `MRL-5` は常時並走させる。

## 次セッションの開始点

- start release line: `MRL-0`
- immediate target after first pass: `MRL-1`
- do not start with: 全センサ同時統合、圧縮最適化、長時間屋外試験
