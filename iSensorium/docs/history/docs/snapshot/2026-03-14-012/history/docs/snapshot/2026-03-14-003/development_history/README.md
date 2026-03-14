# Development History

## Purpose

このディレクトリは、実開発における変更の意図と背景を残す専用履歴である。
単なる作業記録ではなく、「何の振る舞いを、なぜ、どう変えたか」を短く追える形で保持する。

## Policy

- 拡張的変更にオープン:
  新機能、新観点、新検証、新設計意図を追加できる。
- 修正的変更にクローズ:
  既存変更の意味を上書きせず、各変更を独立履歴として残す。

## Required Template

```md
# Development Change

- date:
- target_behavior:
- intended_change:
- background_reason:
- change_summary:
- affected_documents:
- expected_effect:
```

## Naming

- `YYYY-MM-DD-XXX-<short-name>.md`
