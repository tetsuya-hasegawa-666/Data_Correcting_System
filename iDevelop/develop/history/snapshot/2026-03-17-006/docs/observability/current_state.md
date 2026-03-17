# 現在の状態

## 現在の実行対象

- current plan set: `2026-03-17-006`
- current market release: `MRL-22`
- current micro release: `mRL-22-1`
- thread purpose: session archive viewer、compact tree explorer、one-click download、詳細 error handling を consultation workspace に統合する

## 完了済み baseline

- generic project contract
- live document/data read
- change tracking
- generic code entry
- integrated UX check flow
- interaction contract
- document consultation line
- data consultation line
- shared conversation shell line
- code consultation phase-gate line
- proposal-to-action line
- safe apply line
- pilot interaction line
- document explorer rebalance line
- preview dual-column action line
- consultation-draft expression alignment line
- local draft unlock for read-only document/data sources
- consultation capability guidance in workspace views
- compact expandable header cards for status / contract / shell
- preview overflow fix for document and data layouts
- document explorer tree with preview-side action split
- dual-column preview that separates consultation work from draft work
- consultation and draft cards now share the same explanation structure
- shell header cards now expand by click and collapse on pointer leave
- explorer header, preview header, and consultation/draft local headers stay fixed while their bodies scroll
- consultation now opens through a dedicated action box with save/cancel controls
- draft unlock remains explicit in a paired action box that explains the local-draft consequence
- `npm test` green
- `npm run build` green

## 次 scope

- session archive viewer
- top directory compact tree explorer
- `.md` directory compact selection
- one-click download
- detailed operator-facing error handling
- viewer / explorer / download / consultation の MVC 境界整理

## 現在のリスク

- session/export contract が `iSensorium` 側とずれると viewer が曖昧になる
- compact tree の密度と可読性のバランス調整が必要
- download failure や missing source を個別 state として扱わないと operator が迷う

## 保留中の変更要求

- `iSensorium` の mode-aware session/export contract を viewer が読めるようにする
- 文書カテゴリを compact tree で見やすくする
- 1 操作 download と詳細 error handling を導入する

## 次の検証点

- plan set `2026-03-17-006` で `MRL-22` を開始し、archive contract、compact tree explorer、viewer UX を source-of-truth と develop に固定する

## 状態メモ

- `2026-03-15-005` remains completed through `MRL-21`
- `2026-03-17-006` is the next active plan set for archive viewer and retrieval UX

### 既定事項

- read-only document/data sources can be unlocked into a `local draft` overlay
- document search is now left-side explorer navigation rather than a stacked directory box list
- draft/unlock decisions and consultation actions belong in the preview pane, not the search pane
- preview actions are now split into dedicated `相談` and `Draft` columns for faster operation
- consultation and draft are now described with parallel labels for purpose, effect, and source impact
- unlocking clones the currently visible source into browser-local editable state
- original source remains unchanged until safe apply is explicitly advanced
- workspaces now explain what consultation returns: `Summary`, `Evidence`, `Next Action`
- header information is compressed into three cards and expands on click for detailed inspection
- preview and table containers must stay within viewport width and scroll internally when needed
- consultation and draft each own a dedicated header-like action box in the preview

### 継続課題

- external export/apply semantics are still future work
- multi-user conflict handling is still future work

### 次アクション

1. `MRL-22` で archive contract と compact tree explorer の前提を固定する。
2. `MRL-23` で preview / one-click download UX を定義する。
3. `MRL-24` で MVC と詳細 error handling、完了根拠ルールを閉じる。

### リスク / 仮説

- local draft unlock is sufficient for smoother consultation/editing within the current pilot scope
- compact header hover/focus expansion is acceptable as the primary desktop interaction pattern
