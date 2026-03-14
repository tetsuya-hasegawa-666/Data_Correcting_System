# Change Protocol

Any meaningful `coreCamera/` change must update:

1. `docs/observability/current_state.md`
2. `USER_PREPARATION.md` when a real user-side blocker appears or is cleared
2. `docs/history/docs/summary/summary.md`
3. `develop/history/summary/summary.md`
4. paired snapshot directories in `docs/history/docs/snapshot/` and `develop/history/snapshot/`

## Pairing Rule

- every docs/develop change should be explainable from one dated summary entry
- snapshots should always be created as a pair
- if implementation has not started yet, decision and planning changes still count as meaningful changes
- do not write speculative user tasks into `USER_PREPARATION.md`; only add items that truly block progress without user action
