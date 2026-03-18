# current state

## 現在の状態

- active plan set: `2026-03-17-001 manager context collection foundation`
- active market release: `none`
- active micro release: `none`
- latest completed release: `MRL-7 sync-first copy experience line`
- current target pair: `Xperia 5 III + Windows Tezy-GT37`
- current PC entrypoint: `Desktop shortcut iClone Start`
- current Android entrypoint: `iClone Mobile`

## 現在できていること

- PC 側 end-user workspace UI を `preview/index.html` で提供している
- Android 側 end-user memo UI を `preview/mobile_quick_capture.html` と APK asset に同期している
- mobile / desktop の両方で `Local` `PC` `PC synced` を同じ意味で表示している
- Android 側で headline / body / photo を auto-save entry として保存できる
- Android 側で `入力` `履歴` `ワークスペース` の 3 タブを使える
- `adb_bridge.py` が `Xperia 5 III` の `sync-outbox` から host inbox へ pull する
- `observer.py` が YAML と写真を records 側へコピーする
- host 側で question / KPI candidate / transcript を生成し、reverse sync する
- `run_host_app.py` が runtime 配下を serve し、PC UI から records と images を読める

## 確認済み

- `adb devices` で Xperia 5 III `QV788MFJA6` を確認
- Android APK build / install 成功
- host app は `http://127.0.0.1:8874/preview/index.html` で応答する
- sample photo memo で `device -> host -> reverse sync` の流れを確認済み
- `sync-inbox/acks` と `sync-inbox/questions` に reverse sync 生成を確認済み

## 未解決

- Docker Desktop 自動起動は未安定
- 実ユーザー操作で連続入力した際の long-session 検証は未完了
- 音声メモの本格 UI と Whisper 実連携はまだ preview / pipeline レベル

## 次に見る点

- Xperia 5 III 実機で auto-save entry が意図どおり増え続けるか
- PC workspace の copy-first レイアウトで、最新メモと次の質問が十分に読みやすいか
- 写真付き entry が連続しても gallery と records が破綻しないか
