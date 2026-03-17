# System Blueprint

## Module Structure

- `shared-core`
  - workspace shell
  - refresh
  - shared conversation
- `document-workspace`
  - compact tree explorer
  - preview-side consultation / draft
- `data-workspace`
  - archive explorer
  - session preview
  - one-click download
- `code-workspace`
  - read-only code browse
- `tools/liveProjectSnapshot.ts`
  - live manifest read
  - session archive discovery
  - download target resolution

## MVC Boundary

- Model
  - repository
  - manifest contract
  - session/export contract
  - download contract
- Controller
  - selection
  - bundle orchestration
  - issue resolution
  - operator flow control
- View
  - explorer
  - preview
  - warning / error / empty state
  - Japanese operator wording

## Archive / Download Flow

1. live snapshot が configured roots を recursive read する
2. session directory に `session_manifest.json` があれば session archive dataset として扱う
3. explorer で top directory ごとに compact 表示する
4. preview で session contract と files を表示する
5. download は file または directory zip として 1 ボタンで実行する

## Error Handling Contract

- empty archive
  - archive が 0 件なら warning state を出す
- missing file
  - file list に `present: false` があれば warning state を出す
- download unavailable
  - download contract 不在なら error state を出す
- refresh failure
  - header evidence に `failed` を残す

## Current Focus

- session archive viewer
- top directory compact explorer
- one-click download
- operator-facing detailed error handling
