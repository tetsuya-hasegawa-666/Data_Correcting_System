# 変更プロトコル

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 原則

project の価値、設計、UX、schema、運用ルールを変えるなら、chat だけで終わらせず source-of-truth を同じターンで更新する。

## 対象

- `docs/`
  背景、設計、UX 手順、検証レポート
- `develop/`
  MRL、mRL、履歴、snapshot
- `data/`
  seed data、sample payload

## 今回からの固定ルール

- UX を変えたら `docs/process/UX_check_work_flow.md` を更新する
- UX を変えたら `docs/process/UX_auto_validation_report.md` も更新する
- release line を変えたら `market_release_lines.md` と `micro_release_lines.md` を更新する
- docs を更新したら summary と snapshot を残す

## Codex が必ず残すもの

- interpreted change
- affected source-of-truth
- validation evidence
- remaining risk
