# 2026-03-17-006 micro release lines

## Current State

- all micro releases in this plan set are `completed`

## MRL-22 Archive Explorer Foundation Line

### mRL-22-1 session and export contract intake

- status: `completed`
- result:
  - live snapshot が `sessionId` `recordingMode` `requestedRoute` `activeRoute` `status` `startedAt` `finalizedAt` `files` を読めるようにした
  - `iSensorium` 側 session archive を `iDevelop` から読める manifest に更新した

### mRL-22-2 compact tree explorer definition

- status: `completed`
- result:
  - top directory ごとの compact archive explorer を実装した
  - `.md` directory compact selection の文書導線を整理した

### mRL-22-3 documentation and state alignment

- status: `completed`
- result:
  - current state / plan / history / UX workflow を archive explorer completed 状態へ更新した

## MRL-23 Retrieval And Download UX Line

### mRL-23-1 preview-centered retrieval flow

- status: `completed`
- result:
  - selected archive preview を右側で表示し、session contract と files を一括確認できるようにした

### mRL-23-2 one-click download rule

- status: `completed`
- result:
  - `/api/dashboard/download` endpoint を追加し、file / directory の one-click download を実装した

### mRL-23-3 japanese operator wording close

- status: `completed`
- result:
  - download / warning / empty / retry guidance を operator 向け日本語で整えた

## MRL-24 MVC And Resilient Operator Line

### mRL-24-1 viewer explorer download mvc split

- status: `completed`
- result:
  - data workspace controller が selection / consultation / issue 解決を持ち、view が描画に専念する構成へ整理した

### mRL-24-2 detailed error handling contract

- status: `completed`
- result:
  - missing file / download unavailable / empty archive の issue contract を固定した

### mRL-24-3 completion evidence rule close

- status: `completed`
- result:
  - `npm test`
  - `npm run build`
  - completion evidence rule と history を完了状態へ更新した
