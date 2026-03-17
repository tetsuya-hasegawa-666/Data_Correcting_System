# 2026-03-17-015 market release lines

## 目的

このファイルを `iSensorium` の MRL 正本とする。初版 `MRL-0` から最新の `MRL-13` までを累積で記載し、レビュー時はこのファイルだけで全体像を追える状態を維持する。

## 運用ルール

- 新しい MRL を追加したら、この一覧へ必ず追記する。
- 過去 dated plan set の `market_release_lines.md` は履歴として残すが、主参照はこのファイルとする。
- `status` は `completed` `in_progress` `planned` `blocked` のいずれかを使う。
- `initial plan set` は最初に定義した dated plan set を示す。
- `latest touch` は最後に状態を更新した dated plan set を示す。

## Market Release Lines

| ID | status | name | initial plan set | latest touch | delivered value |
|---|---|---|---|---|---|
| MRL-0 | completed | session bootstrap baseline line | `2026-03-14-002` | `2026-03-17-015` | recording session の起動、単一ログ保存、session directory 基準を確立 |
| MRL-1 | completed | recording spine line | `2026-03-14-002` | `2026-03-17-015` | video / timestamp / IMU を同一 session で記録できる spine を確立 |
| MRL-2 | completed | sensor expansion line | `2026-03-14-002` | `2026-03-17-015` | GNSS / BLE / ARCore を session contract に統合 |
| MRL-3 | completed | analysis export line | `2026-03-14-002` | `2026-03-17-015` | parser と分析向け metadata contract を確立 |
| MRL-4 | completed | resilient operation line | `2026-03-14-002` | `2026-03-17-015` | 長めの運用、offline、部分失敗への耐性を整理 |
| MRL-5 | completed | docs and develop discipline line | `2026-03-14-006` | `2026-03-17-015` | docs / develop / history discipline を正本運用へ固定 |
| MRL-6 | completed | guarded upstream trial line | `2026-03-15-004` | `2026-03-17-015` | frozen route を保持したまま guarded seam と additive metadata を導入 |
| MRL-7 | completed | guarded replacement runtime wiring | `2026-03-15-009` | `2026-03-17-015` | replacement runtime を guarded route として実配線 |
| MRL-8 | completed | guarded upstream stabilization | `2026-03-15-009` | `2026-03-17-015` | lifecycle / refresh / rollback を guarded 条件で安定化 |
| MRL-9 | completed | user UX check ready | `2026-03-15-009` | `2026-03-17-015` | user UX check 実行前提の文書、導線、確認観点を整備 |
| MRL-10 | completed | guarded replacement preview MVP | `2026-03-15-014` | `2026-03-17-015` | guarded replacement route の live preview MVP を実装 |
| MRL-11 | completed | capture mode and contract line | `2026-03-17-015` | `2026-03-17-015` | 通常計測 / ポケット収納計測 mode と export contract を確立 |
| MRL-12 | completed | mobile MVC and Japanese UX line | `2026-03-17-015` | `2026-03-17-015` | Android UI 日本語化と mode selection UI、MVC 境界を整備 |
| MRL-13 | completed | robust recording and error handling line | `2026-03-17-015` | `2026-03-17-015` | 詳細 error handling、pocket mode fallback、再テスト evidence を整備 |

## 各 line の要約

### MRL-0

- session 起動確認
- 1 センサーログ保存
- session directory contract の固定

### MRL-1

- video / timestamp / IMU の spine 確立
- 同一 session への時系列収集
- timestamp basis の整備

### MRL-2

- GNSS / BLE / ARCore 追加
- 多センサー session の failure split 明確化
- sensor prioritization の下地整備

### MRL-3

- Python parser contract
- join key / metadata basis
- 分析利用のための export shape 固定

### MRL-4

- battery / offline / partial failure 観点の整理
- longer run を見据えた運用性整備

### MRL-5

- docs と develop の正本ルール
- snapshot / history discipline
- 自律継続作業の記録基盤

### MRL-6

- `shared-camera-session-adapter` seam 導入
- additive metadata
- reversible cutover gate

### MRL-7

- guarded replacement runtime 実配線
- required artifact contract 維持
- frozen route fallback の維持

### MRL-8

- start / stop / failure / shutdown / refresh の安定化
- rollback drill と parser regression

### MRL-9

- user UX check ready 文書
- release handoff 用の確認導線整備

### MRL-10

- live preview MVP
- shared camera capture session を壊さない preview 表示

### MRL-11

- `standard_handheld` / `pocket_recording`
- `recordingMode` / `recordingModeLabel` / `modeBehavior`

### MRL-12

- 日本語 UI
- mode selection UI
- `MainActivity` と `MainScreenController` の責務分離

### MRL-13

- preview / start / refresh / finalize の error handling
- pocket mode 自動低頻度化と warning / guidance
- Codex retest と user validation 例外ルールの明文化
