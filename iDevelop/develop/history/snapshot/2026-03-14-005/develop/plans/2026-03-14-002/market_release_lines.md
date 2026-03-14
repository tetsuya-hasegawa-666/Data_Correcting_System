# Market Release Line Plan

## Purpose

この文書は、`iDevelop` の実開発を次セッションで新規開始するための、pre-implementation release line を定義する。

## Planning Rules

- 現 plan set は実装済み機能の成立ではなく、実装開始条件の成立を release line として扱う。
- 文書画面とデータ画面は must scope とし、コード参照・デバッグ画面は optional scope の判定対象として扱う。
- 各 line は次セッションの着手順序と確認順序を示す。

## Market Release Lines

| ID | Name | Delivered Value | Entrance Criteria | Exit Criteria | Linked Micro Releases | Change Drivers |
|---|---|---|---|---|---|---|
| MRL-0 | 開発開始条件固定ライン | 次セッションで迷わず着手できる project 入口が揃う | `iDevelop` の project 境界と docs/develop 入口が存在する | 命名、境界、current state、active plan set が相互に一致する | mRL-0-1, mRL-0-2, mRL-0-3 | naming drift、防止したい再確認コスト |
| MRL-1 | アーキテクチャ着手準備ライン | shared-core と workspace 分割を実装に落とせる | MRL-0 が成立している | module 責務、拡張方針、技術選定論点が固定される | mRL-1-1, mRL-1-2, mRL-1-3 | OCP、MVC、軽量性 |
| MRL-2 | Must Scope ストーリー準備ライン | 文書画面とデータ画面の初回 BDD/TDD 着手点が揃う | MRL-1 が成立している | document/data の最初のストーリー、受け入れ条件、検証観点が揃う | mRL-2-1, mRL-2-2, mRL-2-3 | 要件分解、データ契約 |
| MRL-3 | Optional Scope 判定ライン | コード参照・デバッグ画面を次フェーズへ入れるか判断できる | MRL-2 が成立している | optional scope の採否条件と安全境界が明文化される | mRL-3-1, mRL-3-2 | 安全性、開発負荷 |
| MRL-4 | セッション引継ぎ成立ライン | 次セッションで最初の実装対象と停止条件を即決できる | MRL-0 から MRL-3 までの必要条件が揃っている | 最初の実装順序、確認ポイント、保留事項が handoff 可能な形で残る | mRL-4-1, mRL-4-2, mRL-4-3 | 実装開始速度、判断漏れ防止 |

## Current Recommendation

- `MRL-3` は、optional scope を今回のラインから外し、将来の read-only 導入条件だけを固定することで成立した。
- 次に着手する market release line は `MRL-4` であり、handoff 用の next slice と停止条件を整理する。
- この turn では `MRL-4` には入らず、phase gate 完了時点で停止する。
