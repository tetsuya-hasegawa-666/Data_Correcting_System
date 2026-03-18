# 2026-03-17-001 micro release lines

## MRL-0
- mRL-0-1 directory and docs setup: `completed`
- mRL-0-2 architecture and schema baseline: `completed`

## MRL-1
- mRL-1-1 host stack and runtime contract: `completed`
- mRL-1-2 known device anchor: `completed`
- mRL-1-3 future connectivity route: `completed`

## MRL-2
- mRL-2-1 mobile capture contract: `completed`
- mRL-2-2 mobile auto-save and list browse: `completed`
- mRL-2-3 Android app shell: `completed`
- mRL-2-4 Android local persistence: `completed`

## MRL-3
- mRL-3-1 PC workspace UI: `completed`
- mRL-3-2 image-capable review snapshot: `completed`
- mRL-3-3 one-click launcher: `completed`

## MRL-4
- mRL-4-1 transcript generation: `completed`
- mRL-4-2 next question generation: `completed`
- mRL-4-3 KPI candidate generation: `completed`

## MRL-5
- mRL-5-1 adb pull bridge: `completed`
- mRL-5-2 attachment-aware observer: `completed`
- mRL-5-3 reverse sync to device: `completed`

## MRL-6
- mRL-6-1 host app file serving: `completed`
- mRL-6-2 validation evidence: `completed`
- mRL-6-3 operational docs sync: `completed`

## MRL-7
- mRL-7-1 shared visual language: `completed`
- mRL-7-2 mobile copy-first capture: `completed`
- mRL-7-3 desktop copy-first workspace: `completed`
- mRL-7-4 docs and release sync: `completed`

## MRL-8
- mRL-8-1 clone-first priority rewrite: `completed`
- mRL-8-2 compact status and footer counts: `completed`
- mRL-8-3 bidirectional clone settings: `completed`
- mRL-8-4 delete and manual sync controls: `completed`
- mRL-8-5 UX auto validation report: `completed`

## MRL-9
- mRL-9-1 mobile-server connector status: `completed`
- mRL-9-2 docker-down visibility: `completed`
- mRL-9-3 compact settings rewrite: `completed`
- mRL-9-4 docs and validation sync: `completed`

## MRL-10
- mRL-10-1 status color refinement: `completed`
  - `✓Mobile` `connector` `✓/×Server` の green / yellow / red を揃えた
- mRL-10-2 clone accordion browser: `completed`
  - `Memo Clone` `Photo Clone` を折りたたみ browser にし、sticky close を入れた
- mRL-10-3 trash-first delete model: `completed`
  - delete は soft delete でごみ箱へ移し、hard delete と一括消去はごみ箱からだけ行う
- mRL-10-4 docs and validation sync: `completed`
  - release lines、UX 手順、UX 自動検証、現況を更新した

## MRL-11
- mRL-11-1 reconnect controls on desktop: `completed`
  - desktop から `Server再起動` `再接続` を実行できる
- mRL-11-2 reconnect controls on mobile: `completed`
  - mobile から `Server再起動` `再接続` を実行できる
- mRL-11-3 reconnect state visibility: `completed`
  - 再接続中は `✓Mobile - - - - ✓Server` を黄色点滅で示す
- mRL-11-4 grouped status layout: `completed`
  - status と reconnect 操作を分離し、誤タップしにくい配置に揃えた
- mRL-11-5 single UX validation trace: `completed`
  - `docs/process/UX_validation_trace.yaml` に検証記録を追記する運用へ変更した
