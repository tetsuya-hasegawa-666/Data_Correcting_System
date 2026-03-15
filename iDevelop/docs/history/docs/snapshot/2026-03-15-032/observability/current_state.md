# Current State

## Current Position

- current plan set: `2026-03-15-005`
- current market release: `MRL-19`
- current micro release: `completed`
- thread purpose: completed consultation workspace baseline with post-completion UX clarification

## Completed

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
- local draft unlock for read-only document/data sources
- consultation capability guidance in workspace views
- compact expandable header cards for status / contract / shell
- preview overflow fix for document and data layouts
- document explorer tree with preview-side action split
- dual-column preview that separates consultation work from draft work
- `npm test` green
- `npm run build` green

## Active Risks

- export / multi-user / deeper automation remain out of scope
- local draft unlock is session-local and does not yet persist to external source files

## Pending Change Requests

- next plan set should decide whether local draft can graduate to explicit external apply policy

## Next Validation Point

- manual UX check should confirm compact header expansion, local draft unlock wording, and non-overflow preview on desktop/mobile

## Completion Note

- `2026-03-15-005` remains completed through `MRL-19`
- this session added post-completion UX clarification without reopening the release line

### Decisions Made

- read-only document/data sources can be unlocked into a `local draft` overlay
- document search is now left-side explorer navigation rather than a stacked directory box list
- draft/unlock decisions and consultation actions belong in the preview pane, not the search pane
- preview actions are now split into dedicated `相談` and `Draft` columns for faster operation
- unlocking clones the currently visible source into browser-local editable state
- original source remains unchanged until safe apply is explicitly advanced
- workspaces now explain what consultation returns: `Summary`, `Evidence`, `Next Action`
- header information is compressed into three cards and expands on hover/focus for detailed inspection
- preview and table containers must stay within viewport width and scroll internally when needed

### Open Issues

- external export/apply semantics are still future work
- multi-user conflict handling is still future work

### Next Actions

1. Run the manual UX checklist for local draft unlock and compact header behavior.
2. Carry forward export / multi-user / deeper automation as the next planning theme.

### Risks / Assumptions

- local draft unlock is sufficient for smoother consultation/editing within the current pilot scope
- compact header hover/focus expansion is acceptable as the primary desktop interaction pattern
