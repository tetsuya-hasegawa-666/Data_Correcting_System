# 2026-03-17-016 market release lines

## 目的

このファイルを `iSensorium` の MRL 正本とする。
旧 capture research line の履歴を保持したまま、manager context collection system の line を `MRL-14` から継続採番する。

## 運用ルール

- 新しい MRL を追加したら、この一覧へ必ず追記する。
- `status` は `completed` `in_progress` `planned` `blocked` を使う。
- `initial plan set` は最初に定義した dated plan set を示す。
- `latest touch` は最後に状態を更新した dated plan set を示す。

## Market Release Lines

| ID | status | name | initial plan set | latest touch | delivered value |
|---|---|---|---|---|---|
| MRL-0 | completed | session bootstrap baseline line | `2026-03-14-002` | `2026-03-17-015` | capture research line の session bootstrap を確立 |
| MRL-1 | completed | recording spine line | `2026-03-14-002` | `2026-03-17-015` | capture research line の recording spine を確立 |
| MRL-2 | completed | sensor expansion line | `2026-03-14-002` | `2026-03-17-015` | capture research line の sensor 拡張を完了 |
| MRL-3 | completed | analysis export line | `2026-03-14-002` | `2026-03-17-015` | capture research line の parser / export contract を確立 |
| MRL-4 | completed | resilient operation line | `2026-03-14-002` | `2026-03-17-015` | capture research line の運用耐性観点を整理 |
| MRL-5 | completed | docs and develop discipline line | `2026-03-14-006` | `2026-03-17-015` | docs / develop discipline を固定 |
| MRL-6 | completed | guarded upstream trial line | `2026-03-15-004` | `2026-03-17-015` | guarded seam と additive metadata を導入 |
| MRL-7 | completed | guarded replacement runtime wiring | `2026-03-15-009` | `2026-03-17-015` | replacement runtime を guarded route として配線 |
| MRL-8 | completed | guarded upstream stabilization | `2026-03-15-009` | `2026-03-17-015` | lifecycle / refresh / rollback を安定化 |
| MRL-9 | completed | user UX check ready | `2026-03-15-009` | `2026-03-17-015` | user UX check ready 文書を整備 |
| MRL-10 | completed | guarded replacement preview MVP | `2026-03-15-014` | `2026-03-17-015` | preview MVP を実装 |
| MRL-11 | completed | capture mode and contract line | `2026-03-17-015` | `2026-03-17-015` | mode-aware recording contract を確立 |
| MRL-12 | completed | mobile MVC and Japanese UX line | `2026-03-17-015` | `2026-03-17-015` | 日本語 UI と MVC を整備 |
| MRL-13 | completed | robust recording and error handling line | `2026-03-17-015` | `2026-03-17-015` | 詳細 error handling と completion evidence を整備 |
| MRL-14 | in_progress | manager context collection foundation line | `2026-03-17-016` | `2026-03-17-016` | manager context system の north star、schema、seed data、context contract を固定 |
| MRL-15 | planned | proximity auth and local sync line | `2026-03-17-016` | `2026-03-17-016` | MAC whitelist、peer key、Syncthing folder contract を成立させる |
| MRL-16 | planned | multimodal memo and one-question UX line | `2026-03-17-016` | `2026-03-17-016` | text / voice / photo と一問一葉 UX を edge に実装する |
| MRL-17 | planned | local intelligence and KPI discovery line | `2026-03-17-016` | `2026-03-17-016` | Whisper、質問生成、KPI candidate 提案を Docker 内で完結させる |
| MRL-18 | planned | review surface and operational hardening line | `2026-03-17-016` | `2026-03-17-016` | review 導線、security hardening、retry / evidence を整備する |

## 新しい line の要約

### MRL-14

- north star を manager context collection へ pivot
- YAML canonical contract
- project context と seed data
- host / edge / intelligence の責務境界

### MRL-15

- MAC whitelist
- Syncthing peer contract
- local-only attachment sync

### MRL-16

- one-question entry UX
- multimodal capture
- Android quick memo orchestration

### MRL-17

- local Whisper transcription
- context extraction
- KPI candidate suggestion

### MRL-18

- manager review surface
- adoption / hold / reject workflow
- security と evidence hardening
