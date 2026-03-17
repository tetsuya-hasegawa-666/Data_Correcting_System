# 市場リリースライン計画

## 目的

この文書は、`iDevelop/` を companion project として分離配置するための、`iSensorium` 側 bootstrap 計画を定義する。

## 計画ルール

- ルート側では subproject 境界と初期化だけを扱う。
- ダッシュボード機能そのものの詳細計画は `iDevelop/develop/` に委譲する。
- line の再定義が必要になった場合は `docs/process/change_protocol.md` に従う。

## Market Release Lines

| ID | Name | Delivered Value | Entrance Criteria | Exit Criteria | Linked Micro Releases | Change Drivers |
|---|---|---|---|---|---|---|
| MRL-0 | 分離ワークスペース成立ライン | `iDevelop/` が `iSensorium` と分離した companion 作業面として存在する | companion project 名称が確定している | ルート直下に専用ディレクトリと局所入口が配置される | mRL-0-1, mRL-0-2 | 作業混線防止、探索コスト低減 |
| MRL-1 | ローカル規約成立ライン | companion project 内部で docs/develop 規約に従って作業できる | `iDevelop/` のディレクトリが存在する | ローカル `AGENTS.md`, `docs/index.md`, `develop/index.md` が揃う | mRL-1-1, mRL-1-2 | 運用一貫性、履歴追跡 |
| MRL-2 | 実装着手準備ライン | 次スレッドからダッシュボード設計と実装を始められる | ローカル規約が成立している | 初期 release line 計画と現況がサブプロジェクト側に置かれる | mRL-2-1, mRL-2-2 | BDD/TDD 準備、拡張方針明確化 |

## 現在の推奨順序

- 最初に `MRL-0` を成立させる。
- 次に `MRL-1` でローカル規約を固定する。
- ダッシュボード実装の詳細は `MRL-2` 以降を `iDevelop/` 側で継続する。
