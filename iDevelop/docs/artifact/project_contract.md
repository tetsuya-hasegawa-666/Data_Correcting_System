# Project Contract

## Purpose

`iDevelop` は server-side frontend として、`iSensorium` の文書、session archive、export metadata、code browse を read-first で扱う。

## Live Manifest Contract

```json
{
  "projectId": "idevelop",
  "projectRoot": "C:/Users/tetsuya/playground/Data_Correcting_System",
  "documentRoots": ["iSensorium/docs", "iSensorium/develop"],
  "dataRoots": ["iSensorium/tmp", "iSensorium/develop/history/snapshot"],
  "codeRoots": ["iSensorium/app/src", "iSensorium/python"],
  "ignoreGlobs": ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/build/**", "**/docs/history/**"],
  "readOnly": true
}
```

## Session Archive Contract

- viewer が最低限読む field
  - `sessionId`
  - `recordingMode`
  - `requestedRoute`
  - `activeRoute`
  - `status`
  - `startedAt`
  - `finalizedAt`
  - `files`
- session directory は one-click download 対象として扱う
- single file export も同じ explorer / preview / download contract で扱う

## Download Contract

- download action は `/api/dashboard/download?path=...` を通す
- file はそのまま download する
- directory は zip 化して download する
- path は `projectRoot` 配下かつ configured roots 配下に限る

## Safety Boundary

- live source は read-only first
- source path が configured roots 外なら拒否する
- download source が存在しない場合は error state に落とす
- code workspace は read-only browse のまま維持する
