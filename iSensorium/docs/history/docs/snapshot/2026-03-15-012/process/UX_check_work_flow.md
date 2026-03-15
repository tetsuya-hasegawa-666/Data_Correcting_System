# UX確認ワークフロー

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 利用者準備ノート

- この欄には、Codex だけでは代行できない user action や外部 device access だけを書く
- 実際に blocker が発生していない限り、推測の user task は書かない
- 現在の外部準備:
  - なし
- 解消済み事項:
  - 2026-03-14 に Xperia 5 III (`QV788MFJA6`) の `adb` 認可は完了している

> [!IMPORTANT]
> **Rollback 注意: 次の upstream trial で `iSensorium/` を編集する前に rollback anchor を固定済み**
> 理由: `coreCamera` 側で guarded upstream trial に必要な package まで揃い、次セッションでは `iSensorium/` 実装変更の可能性があるためです。現在の `iSensorium/` implementation-only snapshot は `rollback-isensorium-pre-upstream-trial-2026-03-15-001` に固定しました。実装相当は約 `4.54 MiB` で、`app/build/` や `.gradle/` を含めると約 `82.33 MiB` まで増えるため、rollback 基準は生成物ではなく tag を使います。
>
> **Rollback 指示方法**
>
> ```powershell
> cd C:\Users\tetsuya\playground\Data_Correcting_System\iSensorium
> git fetch origin --tags
> git switch <戻したいブランチ名>
> git reset --hard rollback-isensorium-pre-upstream-trial-2026-03-15-001
> git clean -fd
> ```
>
> **remote 側も戻す必要がある場合**
>
> ```powershell
> git push --force-with-lease origin <戻したいブランチ名>
> ```
>
> anchor commit: `c5656973ee190e2bb1e99d3cd806f813d4b7ce7a`

## 目的

この手順は、Windows 初心者でも `iSensorium` の recording session を自分で体験し、結果を見て UX 観点で評価できるようにするためのワークフローです。
利用者準備が必要な場合は、この文書冒頭の `利用者準備ノート` を先に確認する。

## まず結論

一番簡単な体験ルートは次の 8 手順です。

1. Xperia 5 III を USB で Windows PC に接続する
2. スマホで `iSensorium` を開く
3. `Use guarded replacement route` を ON にする
4. 権限ダイアログが出たら `許可` を押す
5. 5 秒から 10 秒、スマホを軽く動かしながら撮影する
6. `Stop Session` を押す
7. `Refresh` を押す
8. 画面に `Camera route: requested=corecamera_shared_camera_trial, active=corecamera_shared_camera_trial` とファイル一覧が出たら成功

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
4. `Use guarded replacement route` switch が見えたら、guarded replacement route を試すときは ON にします。

### 2. session を開始する

1. replacement route を確認したい場合は `Use guarded replacement route` を ON にします。
2. `Start Session` を押します。
3. 初回は権限確認が出ます。
4. `カメラ` と `マイク` は必ず許可してください。
5. `位置情報` と `Bluetooth` は許可すると追加データも入ります。

### 3. recording する

1. 5 秒から 10 秒そのまま待ちます。
2. その間、スマホを少し動かすと IMU と video の変化が分かりやすくなります。
3. ARCore の確認をしたいときは、床や机など模様のある場所を映してください。

### 4. session を停止する

1. `Stop Session` を押します。
2. 2 秒ほど待ちます。
3. `Refresh` を押します。

## 成功したときに見る場所

画面の `Session:` と `Directory:` の表示を見ます。replacement route のときは `Camera route:` 行も確認します。次のようなファイルが並べば正常です。

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

## replacement route 観察点

guarded replacement route を試すときは、次の 5 点を追加で見ます。

1. `Use guarded replacement route` を ON にしたあと、`Mode:` の route 表示が `corecamera_shared_camera_trial` になるか
2. recording 後の `Session:` 表示に `Camera route: requested=corecamera_shared_camera_trial, active=corecamera_shared_camera_trial` が出るか
3. `Guard:` 行が空で、fallback 理由が出ていないか
4. `Stop Session` 後に idle preview が frozen route と同様に戻るか
5. `Refresh` 後も latest session の route と files が再表示されるか

## 2026-03-15 現在の確認済み事項

- replacement route session で required artifact 8 点が実際に保存されることは確認済み
- `session_manifest.json` の `files.sizeBytes` は実ファイルサイズと一致するところまで確認済み
- 現在の未解決 UX blocker は次の 2 件
  - `Use guarded replacement route` switch 操作時に app が落ちることがある
  - replacement route recording 中に preview が動かない

## 評価ポイント

体験ベースでは、次の 5 点を見ると判断しやすいです。

1. `Start Session` と `Stop Session` が迷わず押せるか
2. `Refresh` で session 情報が理解できるか
3. session directory を見て、継続して使えそうか判断できるか
4. `video.mp4` と `imu.csv` が同じ session に入っているか
5. optional permission を許可したときに `gnss.csv`、`ble_scan.jsonl`、`arcore_pose.jsonl` が増えるか
6. guarded replacement route を ON にしたとき、route 表示と actual saved files が一致しているか

## うまくいかないとき

### アプリが起動しない

- もう一度 APK を install してください
- スマホ側で `iSensorium` アイコンがあるか確認してください

### `Start Session` を押しても始まらない

- カメラとマイク permission を許可してください
- 一度アプリを閉じて、再起動してください
- guarded replacement route で不安定な場合は `Use guarded replacement route` を OFF に戻し、frozen route でも同症状か確認してください

### session file が少ない

- まず `video.mp4` と `imu.csv` があるか見てください
- `gnss.csv`、`ble_scan.jsonl`、`arcore_pose.jsonl` は permission や環境依存です

### replacement route のはずなのに active route が frozen のまま

- `Use guarded replacement route` が ON か確認してください
- それでも `active=frozen_camerax_arcore` なら、その session の `Guard:` 行をメモしてください
- その場合は guarded fallback として扱い、rollback ではなくまず現象を記録します

### Windows からフォルダが見えない

- USB モードが `充電のみ` になっていないか確認してください
- `ファイル転送` に切り替えてください
- だめなら adb の方法を使ってください

## このワークフローの読了後にやること

体験したら、次の 3 つをメモすると評価しやすいです。

- どの操作で迷ったか
- どの画面表示が分かりにくかったか
- どの session file まで確認できたか
- replacement route を ON にしたか / `Camera route` 行がどう表示されたか

## UX check 後の分岐

次の 3 分岐だけを使います。

1. 採用
   `Use guarded replacement route` を ON にした状態で UX が十分安定し、`active=corecamera_shared_camera_trial` と required artifact が揃う
2. guarded 継続
   replacement route は動くが、表現や手順の改善を追加してもう 1 回 UX check したい
3. rollback
   replacement route で致命的な退行があり、直ちに frozen route 基準へ戻したい
# 2026-03-14-018 Addendum

- Base route is now `video + IMU + GNSS`.
- `BLE` and `ARCore` are enabled by default as low-rate confirmation streams.
- You can change sampling interval on the main screen before pressing `Start Session`.
- Default values:
- `Video timestamp log = 100 ms`
- `IMU log = 20 ms`
- `GNSS log = 1000 ms`
- `BLE log = 2000 ms`
- `ARCore log = 2000 ms`
- For the easiest test, leave the defaults unchanged and press `Start Session`.

# 2026-03-14-019 Addendum

- While idle, the preview should remain visible behind the bottom settings card.
- After `Start Session`, the settings card should disappear and only a small recording overlay with `Stop Session` should remain.
- Pressing `Refresh` should now show visible completion feedback even if the latest session did not change.
