# iClone

マネージャーコンテキスト収集システムを、`Xperia 5 III` と Windows PC `Tezy-GT37` の組み合わせで先に実装している独立 project。

- 文書入口: `iClone/docs/index.md`
- 計画入口: `iClone/develop/index.md`
- UX 手順: `iClone/docs/process/UX_check_work_flow.md`

## 現在の起動形態

- PC 側:
  Desktop の `iClone Start` を 1 回ダブルクリックすると、host stack、adb bridge、PC UI が順に起動する
- Android 側:
  `iClone Mobile` APK を Xperia 5 III に install し、ホーム画面アイコンから起動する

## 実装済みの同期経路

- 将来の基本構想:
  `mDNS + MAC whitelist + Syncthing + Docker LLM`
- 現在の実働経路:
  `Xperia 5 III -> Android app local files -> adb bridge -> runtime/host-inbox -> observer -> runtime/records -> question reverse sync`

このため、現時点では USB 接続された Xperia 5 III と Windows の組み合わせで、テキストメモと写真添付の同期が動く。

## 主な起動コマンド

- 一括起動:
  `scripts/start_iclone.ps1`
- host stack:
  `scripts/start_host_stack.ps1`
- adb bridge:
  `scripts/start_adb_bridge.ps1`
- host app:
  `scripts/start_host_app.ps1`
- 一括停止:
  `scripts/stop_iclone.ps1`
- Android build:
  `scripts/build_android_app.ps1`
- Android install:
  `scripts/install_android_app.ps1`
