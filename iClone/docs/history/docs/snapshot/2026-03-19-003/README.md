# iClone

`iClone` は、mobile / PC のどちらからでもデータクローンを直感的に扱える local clone workspace project です。

- 文書入口: `iClone/docs/index.md`
- 開発入口: `iClone/develop/index.md`
- UX 手順: `iClone/docs/process/UX_check_work_flow.md`
- UX 自動検証: `iClone/docs/process/UX_auto_validation_report.md`

## 現在の clone UX

- 上部 status: `✓Mobile connector ✓/×Server`
- browser: `Memo Clone` `Photo Clone` の accordion
- delete: ごみ箱へ移動してから `完全消去` または `一括消去`
- settings: `auto save` `auto sync` と `realtime / 10s / 1m`

## 現在の実装ルート

- 実装: `Android app local files -> adb bridge -> host records -> reverse sync`
- 構想の将来像: `mDNS + MAC whitelist + Syncthing + Docker LLM`
