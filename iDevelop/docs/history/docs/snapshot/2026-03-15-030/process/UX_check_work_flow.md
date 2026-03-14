# UX Check Work Flow

## Purpose

Validate the consultation workspace as a completed baseline, including the post-completion UX clarifications for local draft unlock, consultation guidance, compact header cards, and overflow-safe preview layout.

## Pre-Check

1. Confirm `config/project-manifest.json` points to the intended project roots.
2. Run:

```powershell
cd C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop
npm install
npm test
npm run build
```

3. Stop if either command fails.

## Start

```powershell
npm run dashboard
```

Open `http://127.0.0.1:4173/`.

## Header Check

1. Confirm the top area is compressed into three cards: `Refresh`, `Consultation Contract`, `Shared Conversation`.
2. Confirm the compact cards fit in about the top sixth of the screen on desktop.
3. Hover or focus each card and confirm it expands full width.
4. Move the pointer away and confirm the card returns to compact form.

## Document Check

1. Open the `文書` tab.
2. Confirm grouped directory boxes are visible.
3. If the source is read-only, confirm `local draft` unlock guidance explains:
   - unlock condition
   - source is cloned into editable draft state
   - original source remains unchanged until safe apply
4. Start `local draft` and confirm edit controls become available.
5. Confirm the selected document preview stays within the viewport and does not overflow right.
6. Confirm the consultation panel explains `Summary`, `Evidence`, and `Next Action`.
7. Run a consultation and confirm those three fields appear in the response panel.

## Data Check

1. Open the `データ` tab.
2. If the source is read-only, confirm `local draft` unlock guidance explains:
   - unlock condition
   - dataset list is cloned into editable draft state
   - safe apply is still required before source change
3. Start `local draft` and confirm status/count editing becomes available.
4. Confirm the dataset table stays within the viewport and scrolls horizontally if needed.
5. Confirm the consultation panel explains `Summary`, `Evidence`, and `Next Action`.
6. Run a consultation and confirm those three fields appear in the response panel.

## Code Check

1. Open the `コード` tab.
2. Confirm code targets remain read-only.
3. Confirm approval state is `phase-gated-read-only`.
4. Confirm `Apply Request` does not produce an apply preview.

## Shared Shell Check

1. Run one document consultation.
2. Run one data consultation.
3. Confirm the shared shell shows prompt, bundle, summary, approval, and history.
4. Confirm proposal actions are visible after a consultation response exists.

## Safe Apply Check

1. In editable or unlocked local draft document mode, run a consultation.
2. Click `Apply Request` and confirm preview appears.
3. Approve and confirm `[Applied Consultation]` is appended in document preview.
4. In code workspace, confirm the same action remains blocked by the phase gate.

## Refresh Check

1. Confirm refresh evidence appears in the `Refresh` header card.
2. Trigger refresh and confirm `fresh`, `refreshed`, or `stale` updates appropriately.

## Evidence

1. Record UX evidence in [UX_evidence_log.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\observability\UX_evidence_log.md).
2. If a failure occurs, note the rollback trigger and visible symptom.

## Rollback Rule

Rollback if any of the following occurs:

- local draft unlock edits the original source immediately
- consultation guidance becomes misleading or missing
- header expansion hides essential controls or does not collapse back
- preview or table content overflows the right edge
- `npm test` or `npm run build` fails

## Rollback Action

1. Stop the dashboard.
2. Restore the last known-good implementation.
3. Re-run `npm test` and `npm run build`.
4. Log the failure in [UX_evidence_log.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\observability\UX_evidence_log.md).

## Exit Criteria

- `npm test` passes
- `npm run build` passes
- header cards compact and expand as designed
- document local draft unlock is understandable and usable
- data local draft unlock is understandable and usable
- consultation capability guidance is visible in document and data workspaces
- preview and table layouts do not overflow right
- code workspace remains phase-gated read-only
