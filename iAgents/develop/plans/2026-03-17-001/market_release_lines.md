# 2026-03-17-001 market release lines

## 目的

このファイルを `iAgents` の MRL 正本とする。

## 運用ルール

- 新しい MRL を追加したら、この一覧へ必ず追記する。
- `status` は `completed` `in_progress` `planned` `blocked` を使う。
- `initial plan set` は最初に定義した dated plan set を示す。
- `latest touch` は最後に状態を更新した dated plan set を示す。

## Market Release Lines

| ID | status | name | initial plan set | latest touch | delivered value |
|---|---|---|---|---|---|
| MRL-1 | in_progress | bootstrap and mock collaboration line | `2026-03-17-001` | `2026-03-17-001` | docs と最小 CLI を揃え、複数 role の mock 協働を実行できる |
| MRL-2 | planned | provider adapter connection line | `2026-03-17-001` | `2026-03-17-001` | lightweight model provider へ差し替え可能な adapter を整備する |
| MRL-3 | planned | evaluation and tuning line | `2026-03-17-001` | `2026-03-17-001` | 複数 brief に対する比較評価と role tuning を可能にする |
| MRL-4 | planned | operational hardening line | `2026-03-17-001` | `2026-03-17-001` | 出力保存、retry、evidence 管理を整備する |
