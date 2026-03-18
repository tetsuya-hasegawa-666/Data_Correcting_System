# UX自動検証レポート

## 目的

clone-first workspace の使い勝手が、今回の意図どおりに動いているかを Codex が短く評価する。

## 評価結果

### 1. クローン操作が主役になっている

- result:
  `pass`
- reason:
  mobile / desktop ともに、editor、manual sync、workspace list が main area にあり、status と counts は小さい要素へ退避した
- evidence:
  `preview/index.html` `preview/styles.css` `preview/mobile_quick_capture.html`

### 2. compact status で同期状況を判断できる

- result:
  `pass`
- reason:
  `Local / PC / PC synced` を小さい inline label とし、check / x と color で区別できる
- evidence:
  `preview/app.js` の `renderStatusRail`
  `preview/mobile_quick_capture.html` 内 script の `renderStatus`

### 3. counts が邪魔をしない

- result:
  `pass`
- reason:
  count は footer に集約し、workspace 操作領域の外へ移した
- evidence:
  `preview/index.html` footer
  `preview/mobile_quick_capture.html` footer

### 4. PC から clone data を作成できる

- result:
  `pass`
- reason:
  host app API で entry create が成功し、records と question が生成された
- evidence:
  `POST /api/workspace/entries` 実行結果で `entry-desktop-20260319-042430` を作成
  `savedPath` が `runtime/records/.../entry-desktop-20260319-042430.yaml`

### 5. PC から settings を変更できる

- result:
  `pass`
- reason:
  host app API で `autoSaveInterval=10s` `autoSyncInterval=1m` に更新され、bootstrap の `nextSyncText` が `1分後` を返した
- evidence:
  `POST /api/workspace/settings`
  `GET /api/workspace/bootstrap`

### 6. PC から delete できる

- result:
  `pass`
- reason:
  host app API で delete が成功し、records count が 5 から 4 に戻った
- evidence:
  `DELETE /api/workspace/entries/entry-desktop-20260319-042430`
  直後の `GET /api/workspace/bootstrap`

### 7. mobile で clone workspace を起動できる

- result:
  `pass`
- reason:
  Android asset を同期し、APK build / install / launch を確認した
- evidence:
  `scripts/sync_android_assets.ps1`
  `scripts/build_android_app.ps1`
  `scripts/install_android_app.ps1`
  `adb shell monkey -p com.iclone.mobile ...`

### 8. mobile / PC の両方で settings を持てる

- result:
  `pass`
- reason:
  mobile bridge に `saveSettings` があり、host 側は `/api/workspace/settings` と `edge-outbox/settings/` を持つ
- evidence:
  `android/app/src/main/java/com/iclone/mobile/MainActivity.kt`
  `src/host/run_host_app.py`
  `src/host/adb_bridge.py`

### 9. mobile / PC の両方で delete を持てる

- result:
  `pass`
- reason:
  mobile bridge に `deleteEntry`、host 側に `DELETE /api/workspace/entries/{entryId}` と `edge-outbox/deletes/` がある
- evidence:
  `MainActivity.kt`
  `workspace_api.py`
  `adb_bridge.py`

### 10. realtime / 10秒 / 1分の不安低減 UX がある

- result:
  `pass`
- reason:
  両 UI とも settings で interval を選べ、次回予定表示を持つ
- evidence:
  `preview/app.js`
  `preview/mobile_quick_capture.html`
  `bootstrap.nextSyncText`

## 残る注意

- 実機で mobile の create / delete / settings を人手で一通り触る確認はまだ残る
- Docker Desktop 自動起動は別件として未安定
