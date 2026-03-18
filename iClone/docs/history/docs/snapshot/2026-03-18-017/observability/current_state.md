# current state

## 現在の状態

- active plan set: `2026-03-17-001 manager context collection foundation`
- active market release: `none`
- active micro release: `none`
- current target pair: `Xperia 5 III + Windows Tezy-GT37`
- current PC entrypoint: `Desktop shortcut iClone Start`
- current Android entrypoint: `iClone Mobile`

## 実装済み

- PC 側 end-user workspace UI を `preview/index.html` に実装
- Android 側 end-user memo UI を `preview/mobile_quick_capture.html` と APK asset に実装
- Android 側で自動仮保存、確定保存、端末ワークスペース、閲覧履歴の骨格を実装
- Android 側で写真添付付きメモを app private storage に保存する実装を追加
- `adb_bridge.py` により、Xperia 5 III の `sync-outbox` から host inbox への pull を実装
- `observer.py` により、YAML だけでなく添付写真を records 側へコピーする処理を追加
- host 側で question / KPI candidate / transcript を生成し、edge へ reverse sync する閉ループを維持
- `sync-inbox/questions` と `sync-inbox/acks` を Android 側 UI が読める形に実装
- `run_host_app.py` を動的 file serve 対応にし、records 配下の添付画像を PC UI から表示可能にした

## 実機確認済み

- `adb devices` で Xperia 5 III `QV788MFJA6` を認識
- Android APK build / install 成功
- host app は `http://127.0.0.1:8874/preview/index.html` で応答
- sample photo memo を device filesystem に投入し、`adb bridge -> host-inbox -> observer -> records -> reverse sync` が通ることを確認
- device 側 `sync-inbox/acks/ack-entry-manual-001.json` と `sync-inbox/questions/question-manual-001.json` の生成を確認

## 未解決

- Docker Desktop の自動起動は未安定
- Android 実 UI 上でユーザー操作から保存したメモを、手動操作なしで end-to-end 検証する最終実機確認は未完了
- 音声メモの実録音と Whisper 連携はまだ preview / pipeline 前提で、Android 実録音 UI は未実装
- Syncthing を使った Android 実機同期は将来経路として残しており、現行実装は USB / adb bridge 優先

## 次の確認点

- Xperia 5 III 実 UI からテキストメモと写真メモを保存し、PC 側 workspace にそのまま反映されるか
- `iClone Start` 1 回で user 目線の操作フローが崩れないか
- question reverse sync を Android 画面上で自然に読めるか
