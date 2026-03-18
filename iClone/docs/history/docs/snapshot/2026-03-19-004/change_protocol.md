# 変更プロトコル

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 目的

`iClone` の構想、設計、UX、検証結果を会話のたびに source-of-truth へ反映し、後から追跡できる状態を保つ。

## 更新対象

- `docs/`
  - 構想、設計、UX、現況、履歴
- `develop/`
  - `MRL`、`mRL`、snapshot
- `data/`
  - seed data、sample payload

## 変更時の必須更新

- UX を変えたら `docs/process/UX_check_work_flow.md` を更新する
- UX を変えたら `docs/process/UX_auto_validation_report.md` を更新する
- UX を変えたら `docs/process/UX_validation_trace.yaml` に 1 件追記する
- release line を変えたら `develop/plans/2026-03-17-001/market_release_lines.md` と `develop/plans/2026-03-17-001/micro_release_lines.md` を更新する
- docs を更新したら summary と snapshot を残す

## UX trace ルール

- 単一の検証データは `docs/process/UX_validation_trace.yaml` を使う
- 1 回の UX 変更につき 1 entry を追加する
- entry には `release_line`、`linked_docs`、`evidence`、`findings` を入れる
- `UX_auto_validation_report.md` は trace の人向け要約として扱う
