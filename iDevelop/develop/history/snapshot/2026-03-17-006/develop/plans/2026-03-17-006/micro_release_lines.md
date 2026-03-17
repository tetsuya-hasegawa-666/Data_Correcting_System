# マイクリリースライン計画

## 現在の進捗

- active: `MRL-22 / mRL-22-1`
- pending: `MRL-22 / mRL-22-2` `mRL-22-3`
- pending: `MRL-23 / mRL-23-1` `mRL-23-2` `mRL-23-3`
- pending: `MRL-24 / mRL-24-1` `mRL-24-2` `mRL-24-3`

## MRL-22 Archive Explorer Foundation Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-22-1 | session and export contract intake | viewer が読む `sessionId` `recordingMode` `requestedRoute` `activeRoute` `status` `startedAt` `finalizedAt` `files` を docs / develop で固定する |
| mRL-22-2 | compact tree explorer definition | top directory ごとの compact tree と `.md` directory selectable rule を docs / UX workflow で固定する |
| mRL-22-3 | documentation and state alignment | current state、plan、history、UX workflow が archive explorer 前提へ更新される |

## MRL-23 Retrieval And Download UX Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-23-1 | preview-centered retrieval flow | session/data preview と document preview から retrieval できる operator flow が fixed になる |
| mRL-23-2 | one-click download rule | one-click download と failure state の扱いが docs / contract で固定される |
| mRL-23-3 | japanese operator wording close | download、warning、empty、retry の operator-facing wording が日本語前提で固定される |

## MRL-24 MVC And Resilient Operator Line

| ID | Goal | Exit Criteria |
|---|---|---|
| mRL-24-1 | viewer/explorer/download MVC split | viewer、explorer、download、consultation の責務境界が docs / blueprint / plan で固定される |
| mRL-24-2 | detailed error handling contract | missing file、source mismatch、download failure、empty state、retry state を個別に扱う契約が fixed になる |
| mRL-24-3 | completion evidence rule close | `Codex retest` または `user validation` の採用根拠を current state / history に残す運用が fixed になる |
