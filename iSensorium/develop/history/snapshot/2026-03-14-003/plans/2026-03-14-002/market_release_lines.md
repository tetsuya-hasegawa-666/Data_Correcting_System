# Market Release Line Plan

## Purpose

この文書は、`docs/` で定義された Human Goal と User Story Map を、外部価値として説明可能な Market Release Line へ具体化する。

## Planning Rules

- Market Release Line は外部価値の成立単位として定義する。
- 各 line は複数の Micro Release Line を持つ。
- line の再定義が必要になった場合は `docs/process/change_protocol.md` に従う。

## Market Release Lines

| ID | Name | Delivered Value | Entrance Criteria | Exit Criteria | Linked Micro Releases | Change Drivers |
|---|---|---|---|---|---|---|
| MRL-0 | 開発者体験成立ライン | 実機で起動、開始、保存、確認まで一連体験できる | アプリ起動、疑似または実録画、1 センサ保存の骨格方針がある | 開発者が結果ファイルを確認し、継続判断できる | mRL-0-1, mRL-0-2, mRL-0-3 | 端末制約、初期 UX 学習 |
| MRL-1 | 同期記録基盤成立ライン | 動画中心で IMU/GNSS/BLE/ARCore を破綻なく記録できる | session、timestamp、保存方針が定義済み | 複数ストリームの同時記録と部分欠落許容が実証される | mRL-1-1, mRL-1-2, mRL-1-3, mRL-1-4 | センサ可用性、発熱、権限制約 |
| MRL-2 | 後段再利用成立ライン | 軌跡解析、レビュー、3DGS 系に流しやすいデータ構造が成立する | 記録データに再利用用メタデータ設計が入っている | Python 側で復元・突合の最小パスが成立する | mRL-2-1, mRL-2-2, mRL-2-3 | 保存形式、圧縮率、再解析要件 |
| MRL-3 | 屋外運用成立ライン | 通信断、発熱、権限拒否、部分欠落下でもセッション回収できる | 例外系とフォールバック設計が一巡している | 30 分級運用で継続的に回収できる | mRL-3-1, mRL-3-2, mRL-3-3 | バッテリー、通信品質、OS 制約 |
| MRL-4 | Human + AI 継続研究成立ライン | release line 再編と変更追跡を保ちつつ研究開発を継続できる | docs/develop の境界と履歴規約が有効 | 変更要求が release line と検証計画へ反映され続ける | mRL-4-1, mRL-4-2, mRL-4-3 | 研究価値再定義、優先度変化 |

## Release Ordering

1. MRL-0 を最初に成立させる。
2. MRL-1 で同期記録基盤を成立させる。
3. MRL-2 と MRL-3 は並行可能だが、再利用性と運用性の両面から往復で改善する。
4. MRL-4 は常時並走し、他 line の変更を吸収する。

## Current Recommendation

- 最初の到達目標は `MRL-0`。
- その直後の主ラインは `MRL-1`。
- 圧縮や upload の最適化は `MRL-2` と `MRL-3` の評価結果で再調整する。
