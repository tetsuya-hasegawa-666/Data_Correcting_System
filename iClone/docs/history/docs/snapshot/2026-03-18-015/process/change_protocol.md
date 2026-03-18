# 変更プロトコル

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 目的

project の価値定義、接続方式、YAML schema、推論設計を変更するときに、意味と履歴を失わないようにする。

## 対象の分割

- `docs/`:
  source-of-truth、価値、schema、運用ルール
- `develop/`:
  release line、task、履歴、snapshot
- `data/`:
  seed data、config sample、YAML sample

## 変更要求の最小セット

- change target
- reason
- keep
- discard allowed
- effective timing
- viewpoint

## Codex の応答形式

- interpreted meaning
- affected scope
- preserved items
- changed items
- next validation point
- certainty vs hypothesis

## 履歴規約

- `docs/` を更新したら `docs/history/docs/summary/summary.md` と `docs/history/docs/snapshot/` を対で更新する
- `develop/` を更新したら `develop/history/summary/summary.md` と `develop/history/snapshot/` を対で更新する
- `data/` の変更は develop snapshot に含める

