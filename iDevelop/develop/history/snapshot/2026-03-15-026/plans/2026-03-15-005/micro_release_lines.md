# Micro Release Line Plan

## Purpose

Break `2026-03-15-005` into BDD/TDD-sized slices.

## Current Progress

- completed: `MRL-10 / mRL-10-1` `mRL-10-2` `mRL-10-3`
- completed: `MRL-11 / mRL-11-1` `mRL-11-2` `mRL-11-3`
- completed: `MRL-12 / mRL-12-1` `mRL-12-2` `mRL-12-3`
- completed: `MRL-13 / mRL-13-1` `mRL-13-2` `mRL-13-3`
- completed: `MRL-14 / mRL-14-1` `mRL-14-2` `mRL-14-3`
- completed: `MRL-15 / mRL-15-1` `mRL-15-2` `mRL-15-3`
- completed: `MRL-16 / mRL-16-1` `mRL-16-2` `mRL-16-3`
- completed: `MRL-17 / mRL-17-1` `mRL-17-2` `mRL-17-3`
- completed: `MRL-18 / mRL-18-1` `mRL-18-2` `mRL-18-3`
- current target: `completed`

## Micro Release Lines

### MRL-18 Document Explorer Rebalance Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-18-1 | rebalance document layout into explorer 1/4 and preview 3/4 | explorer and preview panes render with the new ratio and tests go red then green |
| mRL-18-2 | move draft/unlock and consultation action split into preview | preview explains `相談` vs `Draft`, and read-only unlock lives in preview |
| mRL-18-3 | express search results as explorer tree with overflow-safe narrow pane | indented directory tree renders, nested paths stay readable, and horizontal overflow is handled |

## Continuation Rule

- once the active micro release is green, continue to the next micro release in the same MRL
- on MRL completion, update `current_state`, history summary, snapshot, commit, and push
