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
| MRL-20 | Consultation-Draft Expression Alignment Line | consultation and draft cards share a clearer, parallel information design | completed |
| MRL-21 | Header And Action Box Stabilization Line | click-controlled shell headers, sticky explorer/preview sections, and paired consultation/draft action boxes | completed |

## Exit View

- `MRL-21` closes the current shell and document action stabilization line
- header cards now expand by click and collapse on pointer leave without hover flicker
- document preview now treats consultation and draft as paired action boxes with sticky local headers

## Current Recommendation

- `2026-03-15-005` is completed through `MRL-21`
- next plan set should evaluate export, multi-user handling, and deeper automation
