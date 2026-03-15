# Market Release Line Plan

## Purpose

`2026-03-15-005` evolves `iDevelop` into a consultation workspace with explicit editing safety, explorer navigation, and preview-centered action UX.

## Planning Rules

- work only inside `iDevelop/`
- preserve MVC boundaries
- derive each slice from BDD and validate through TDD
- keep must scope on `document` and `data`
- keep `code` as phase-gated consultation material
- reflect UX exit criteria in `docs/process/UX_check_work_flow.md`

## Market Release Lines

| ID | Name | Delivered Value | Status |
|---|---|---|---|
| MRL-10 | Interaction Contract Line | consultation session, bundle, response contract, approval state | completed |
| MRL-11 | Document Consultation Line | document bundle selection, focus input, grounded response | completed |
| MRL-12 | Data Consultation Line | dataset bundle selection, focus input, grounded response | completed |
| MRL-13 | Shared Conversation Shell Line | shared prompt, bundle, summary, history shell | completed |
| MRL-14 | Code Consultation Phase-Gate Line | read-only code consultation with explicit phase gate | completed |
| MRL-15 | Proposal-To-Action Line | keep / discard / task proposal actions | completed |
| MRL-16 | Safe Apply Line | preview and approval-first apply flow for document/data | completed |
| MRL-17 | Pilot Interaction Line | end-to-end consultation pilot baseline | completed |
| MRL-18 | Document Explorer Rebalance Line | explorer-style search pane, preview-side draft/consultation controls, explicit action split | completed |
| MRL-19 | Preview Dual-Column Action Line | preview split into dedicated consultation and draft columns for easier operation | completed |

## Exit View

- `MRL-19` closes the current document preview action refinement line
- the preview now separates consultation work from draft work in parallel columns
- read-only unlock remains explicit and now lives only in the draft column

## Current Recommendation

- `2026-03-15-005` is completed through `MRL-19`
- next plan set should evaluate export, multi-user handling, and deeper automation
