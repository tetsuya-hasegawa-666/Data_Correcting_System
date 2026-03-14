# System Blueprint For Documentation

## Purpose

この文書は、実装対象をどう文書化するかの骨格を定義する。
技術内容そのものの最終版ではなく、どの論点をどの章に収めるかを固定する。

## Required Chapters For Implementation Thread

次スレッドでは、以下をこの順で埋める。

1. 前提整理
2. 推奨アーキテクチャ
3. データモデル
4. 取得方式
5. 圧縮・通信量削減
6. 同期設計
7. フォールバック
8. Android 実装方針
9. 実装順序
10. 検証計画
11. Kotlin コード骨格
12. 最終推奨構成
13. User Story Map
14. Market Release Line
15. 開発マイルストーン
16. Human + AI 開発プロセス
17. 進捗可視化方法
18. 長時間継続研究プロセス
19. Micro Release Line
20. 開発者体験駆動の検証計画
21. Micro Release を含む Mermaid 可視化
22. 変更可能な Release Line 運用設計
23. 人と Codex の変更時意思疎通ルール
24. 変更履歴と意味追跡ルール

## Content Allocation

| Topic | Primary Home | Why |
|---|---|---|
| Android 構成、API 選定、保存方式、同期、圧縮、フォールバック | 実装スレッドの本文 | 技術決定は一体で比較する必要がある |
| Goal、不変条件、前提 | `north_star.md` | 後から見ても意味がぶれないようにするため |
| Story、release、Mermaid、change point | `story_release_map.md` | 価値構造を一箇所に集約するため |
| 変更要求、衝突処理、意味確認、履歴 | `change_protocol.md` | 更新フローを一箇所に閉じるため |
| task state、研究サイクル、AI 自律継続ルール | `research_operation.md` | 実行管理の規律を固定するため |
| 現在の進捗、現在の micro release、保留事項 | `current_state.md` | ライブ状態だけを薄く持つため |

## Structure Constraints

- 技術仕様書と運用ルールを同じファイルに混在させない。
- release line の意味定義と週次進捗ログを混在させない。
- 実装の章立ては固定し、各章の中身だけ差し替える。
- 追加要求は新ファイル化より既存章への編入を優先する。

## Recommended Future Expansion

実装スレッドで技術詳細が固まったら、必要に応じて以下を追加できる。

- `docs/artifact/decision_log.md`
- `docs/reference/device_constraints.md`
- `docs/reference/storage_format_tradeoffs.md`

ただし初期構築段階では作らない。
