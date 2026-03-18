# iClone

`iClone` は、mobile / PC のどちらからでもデータクローンを始められる local clone workspace project である。

- 文書入口: `iClone/docs/index.md`
- 開発入口: `iClone/develop/index.md`
- UX 手順: `iClone/docs/process/UX_check_work_flow.md`
- UX 自動検証: `iClone/docs/process/UX_auto_validation_report.md`

## 現在の起動

- PC:
  Desktop の `iClone Start`
- Android:
  `iClone Mobile`

## 現在の clone UX

- compact status:
  `Local` `PC` `PC synced`
- settings:
  `auto save` `auto sync`
  `realtime` `10s` `1m`
- actions:
  save
  sync now
  delete

## 現在の同期ルート

- 実装:
  `Android app local files -> adb bridge -> host records -> reverse sync`
- 将来の本命:
  `mDNS + MAC whitelist + Syncthing + Docker LLM`
