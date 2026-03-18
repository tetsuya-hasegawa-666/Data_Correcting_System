# iClone

`iClone` は、mobile / PC のどちらからでもデータクローンを残して使う local clone workspace project です。

- 文書入口: `iClone/docs/index.md`
- 開発入口: `iClone/develop/index.md`
- UX 手順: `iClone/docs/process/UX_check_work_flow.md`
- UX 要約レポート: `iClone/docs/process/UX_auto_validation_report.md`
- UX 検証トレース: `iClone/docs/process/UX_validation_trace.yaml`

## 現在の UX

- 上段 status: `✓Mobile connector ✓/×Server`
- reconnect: mobile / desktop の両方から `Serverを起こす` `再接続`
- browser: `Memo Clone` `Photo Clone` の accordion
- delete: まずごみ箱へ移し、完全消去はごみ箱からだけ行う
- settings: `auto save` `auto sync` と `realtime / 10s / 1m`

## 現在の構成

- route: `Android app local files -> adb bridge -> host records -> reverse sync`
- future route: `mDNS + MAC whitelist + Syncthing + Docker LLM`
