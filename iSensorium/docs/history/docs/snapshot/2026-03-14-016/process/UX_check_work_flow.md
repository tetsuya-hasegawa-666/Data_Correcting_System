# UX Check Work Flow

## Purpose

この手順は、Windows 初心者でも `iSensorium` の recording session を自分で体験し、結果を見て UX 観点で評価できるようにするためのワークフローです。

## まず結論

一番簡単な体験ルートは次の 8 手順です。

1. Xperia 5 III を USB で Windows PC に接続する
2. スマホで `iSensorium` を開く
3. 権限ダイアログが出たら `許可` を押す
4. `Start Session` を押す
5. 5 秒から 10 秒、スマホを軽く動かしながら撮影する
6. `Stop Session` を押す
7. `Refresh` を押す
8. 画面に `Session:`、`Directory:`、ファイル一覧が出たら成功

## 必要なもの

- Windows PC 1 台
- Xperia 5 III 1 台
- USB ケーブル 1 本
- `iSensorium` アプリ
- できれば `C:\Android\platform-tools\adb.exe`

## 体験前の準備

### A. アプリが既に入っているか確認する

1. スマホのホーム画面で `iSensorium` を探します。
2. 見つかれば、そのまま次へ進んでください。

### B. アプリが入っていない場合

1. Windows で PowerShell を開きます。
2. 次を 1 行ずつ貼り付けて Enter を押します。

```powershell
cd C:\Users\tetsuya\playground\Data_Correcting_System\iSensorium
.\gradlew.bat assembleDebug
C:\Android\platform-tools\adb.exe install -r .\app\build\outputs\apk\debug\app-debug.apk
```

3. スマホ側で USB デバッグ許可が出たら `許可` を押します。

## 体験テスト 1: 画面操作だけで試す

### 1. アプリを開く

1. スマホで `iSensorium` を開きます。
2. カメラ preview が見えます。
3. 上に状態メッセージ、下に `Start Session` と `Refresh` が見えます。

### 2. session を開始する

1. `Start Session` を押します。
2. 初回は権限確認が出ます。
3. `カメラ` と `マイク` は必ず許可してください。
4. `位置情報` と `Bluetooth` は許可すると追加データも入ります。

### 3. recording する

1. 5 秒から 10 秒そのまま待ちます。
2. その間、スマホを少し動かすと IMU と video の変化が分かりやすくなります。
3. ARCore の確認をしたいときは、床や机など模様のある場所を映してください。

### 4. session を停止する

1. `Stop Session` を押します。
2. 2 秒ほど待ちます。
3. `Refresh` を押します。

## 成功したときに見る場所

画面の `Session:` と `Directory:` の表示を見ます。次のようなファイルが並べば正常です。

- `video.mp4`
- `imu.csv`
- `session_manifest.json`
- `video_frame_timestamps.csv`
- `video_events.jsonl`

権限や環境によって、次も増えます。

- `gnss.csv`
- `ble_scan.jsonl`
- `arcore_pose.jsonl`

## 体験テスト 2: Windows から session を見る

### 一番簡単な確認方法

アプリ画面の `Directory:` に表示された path を見ます。通常は次の形です。

```text
/storage/emulated/0/Android/data/com.isensorium.app/files/Documents/sessions/session-YYYYMMDD-HHMMSS
```

### Windows のエクスプローラーで見る方法

1. スマホを USB 接続したままにします。
2. スマホ側で USB 接続モードを `ファイル転送` にします。
3. Windows のエクスプローラーを開きます。
4. スマホを開きます。
5. 次へ進みます。

```text
内部共有ストレージ
  Android
    data
      com.isensorium.app
        files
          Documents
            sessions
```

6. 一番新しい `session-...` フォルダを開きます。
7. `video.mp4` をダブルクリックすると動画確認ができます。

### PowerShell で見る方法

1. PowerShell を開きます。
2. 次を 1 行ずつ実行します。

```powershell
C:\Android\platform-tools\adb.exe devices
C:\Android\platform-tools\adb.exe shell ls /sdcard/Android/data/com.isensorium.app/files/Documents/sessions
```

3. 一番新しい session 名を確認します。
4. その session の中を見るには、`session-...` の部分を実際の名前に変えて次を実行します。

```powershell
C:\Android\platform-tools\adb.exe shell ls /sdcard/Android/data/com.isensorium.app/files/Documents/sessions/session-YYYYMMDD-HHMMSS
```

## 体験テスト 3: 自動で 3 回試す

短時間テストを自動で回したい場合は、次を使います。

```powershell
cd C:\Users\tetsuya\playground\Data_Correcting_System\iSensorium
powershell -ExecutionPolicy Bypass -File .\scripts\run_short_session_harness.ps1
```

期待結果:

- アプリが起動する
- 録画開始と停止が 3 回繰り返される
- 最後に recent sessions が表示される

## 評価ポイント

体験ベースでは、次の 5 点を見ると判断しやすいです。

1. `Start Session` と `Stop Session` が迷わず押せるか
2. `Refresh` で session 情報が理解できるか
3. session directory を見て、継続して使えそうか判断できるか
4. `video.mp4` と `imu.csv` が同じ session に入っているか
5. optional permission を許可したときに `gnss.csv`、`ble_scan.jsonl`、`arcore_pose.jsonl` が増えるか

## うまくいかないとき

### アプリが起動しない

- もう一度 APK を install してください
- スマホ側で `iSensorium` アイコンがあるか確認してください

### `Start Session` を押しても始まらない

- カメラとマイク permission を許可してください
- 一度アプリを閉じて、再起動してください

### session file が少ない

- まず `video.mp4` と `imu.csv` があるか見てください
- `gnss.csv`、`ble_scan.jsonl`、`arcore_pose.jsonl` は permission や環境依存です

### Windows からフォルダが見えない

- USB モードが `充電のみ` になっていないか確認してください
- `ファイル転送` に切り替えてください
- だめなら adb の方法を使ってください

## このワークフローの読了後にやること

体験したら、次の 3 つをメモすると評価しやすいです。

- どの操作で迷ったか
- どの画面表示が分かりにくかったか
- どの session file まで確認できたか
