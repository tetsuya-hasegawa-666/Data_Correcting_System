# iClone

`iClone` は、`Xperia 5 III` と Windows PC `Tezy-GT37` のあいだで、マネージャーの現場メモをローカルにコピーし続ける独立 project です。

- 文書入口: `iClone/docs/index.md`
- 開発入口: `iClone/develop/index.md`
- MRL 正本: `iClone/develop/plans/2026-03-17-001/market_release_lines.md`
- mRL 正本: `iClone/develop/plans/2026-03-17-001/micro_release_lines.md`
- UX 手順: `iClone/docs/process/UX_check_work_flow.md`

## 現在の起動形

- PC 側:
  Desktop の `iClone Start` を 1 回ダブルクリックすると、host stack、adb bridge、host app を順に立ち上げる
- Android 側:
  `iClone Mobile` APK を `Xperia 5 III` に install して、ホーム画面アイコンから起動する

## 現在の同期ルート

- 将来の基準ルート:
  `mDNS + MAC whitelist + Syncthing + Docker LLM`
- 現在の実装ルート:
  `Xperia 5 III -> Android app local files -> adb bridge -> runtime/host-inbox -> observer -> runtime/records -> reverse sync`

## UX の軸

- mobile:
  `その場で残す`
- desktop:
  `コピーされたメモを使う`
- shared labels:
  `Local` `PC` `PC synced`

この 3 ラベルは mobile / desktop の両方で同じ意味を持つ。

- `Local`:
  スマホだけでメモできる
- `PC`:
  PC ワークスペースへコピー済み
- `PC synced`:
  質問まで返ってきている

## 主なコマンド

- 一括起動:
  `scripts/start_iclone.ps1`
- 一括停止:
  `scripts/stop_iclone.ps1`
- Android build:
  `scripts/build_android_app.ps1`
- Android install:
  `scripts/install_android_app.ps1`
- snapshot 更新:
  `python .\src\host\build_status_snapshot.py`
  `python .\src\host\build_review_snapshot.py`
