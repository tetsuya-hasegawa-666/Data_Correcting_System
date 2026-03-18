# UX確認ワークフロー

## 対象

`iClone` は、`Xperia 5 III` と Windows PC `Tezy-GT37` のあいだで、スマホメモを PC ワークスペースへコピーする UX を確認する。

## 事前に必要なもの

- Windows PC `Tezy-GT37`
- Docker Desktop
- PowerShell
- Python
- `adb`
- `Xperia 5 III`
- USB デバッグ許可済みの USB 接続

## エントリーポイント

- PC:
  Desktop の `iClone Start`
- Android:
  ホーム画面の `iClone Mobile`

## 現時点のテスト手順

### 1. Docker を起動していることを確認する

PowerShell で次を実行する。

```powershell
docker ps
```

container 一覧が出ればよい。エラーなら Docker Desktop を先に起動する。

### 2. Android 接続を確認する

```powershell
adb devices -l
```

`QV788MFJA6 device model:SO_53B` のように `Xperia 5 III` が `device` で見えていればよい。

### 3. PC を 1 回で起動する

Desktop の `iClone Start` をダブルクリックする。  
これで次を順に起動する。

- host stack
- adb bridge
- host app

### 4. PC 側 UI を開く

通常は自動で開く。開かない場合はブラウザで次を開く。

```text
http://127.0.0.1:8874/preview/index.html
```

応答確認は次で行う。

```powershell
curl.exe -I http://127.0.0.1:8874/preview/index.html
```

### 5. Android アプリを開く

Xperia 5 III で `iClone Mobile` を開く。

### 6. mobile UX を確認する

- 上部の主題が `その場で残す` になっている
- タブが `入力` `履歴` `ワークスペース` の 3 つである
- メモ欄の説明は短く、入力が主役になっている
- `次の質問` エリアは常に同じ高さで表示される
- 質問未到着時は中央に `PC 同期待ち` だけが出る
- 末尾の status は `Local` `PC` `PC synced` の 3 枚である

状態色の確認:

- `Local`
  `Local = 緑`
  `PC = 赤`
  `PC synced = 赤`
- `PC`
  `Local = グレー`
  `PC = 緑`
  `PC synced = 赤`
- `PC synced`
  `Local = グレー`
  `PC = グレー`
  `PC synced = 緑`

ボタンの確認:

- 入力だけで自動保存される
- `記録を確定` を押すと `記録しました。` が一時表示される
- ボタンを押さなくても entry が作られる

### 7. desktop UX を確認する

- 上部の主題が `コピーされたメモを使う` になっている
- `Local` `PC` `PC synced` の status rail が mobile と同じ語彙で出ている
- summary で `メモ` `写真` `次の質問` `逆同期` が読める
- `コピーされたメモ` と `次の質問` が同じ面で読める
- `PC に届いたメモ` と `添付ギャラリー` が end-user workspace として見える
- admin 向けの冗長説明や console 露出が前面に出ていない

## 現時点の最小確認手順

1. `iClone Start` をダブルクリックする
2. `iClone Mobile` を開く
3. 見出しと本文を入力する
4. 必要なら写真を 1 枚添付する
5. 数秒待つ
6. PC 側で最新メモと写真が出ることを確認する
7. Android 側で `PC` または `PC synced` に進むことを確認する

## 最終目標手順

1. ユーザーはスマホでメモするだけでよい
2. 入力は自動で local entry として保存される
3. 写真も同じ entry に添付される
4. PC ワークスペースへ自動でコピーされる
5. PC では最新メモ、写真、次の質問が一画面で読める
6. host 側で次の質問が生成される
7. Android 側に質問が戻り、`PC synced` で続きが読める
8. 利用者は CLI を意識せず、PC とスマホの両方をアイコンで扱える

## 問題があるときの確認

### Android 側 outbox を見る

```powershell
adb shell ls -R /sdcard/Android/data/com.iclone.mobile/files/iclone
```

### adb bridge の起動を確認する

```powershell
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*adb_bridge.py*' } | Select-Object ProcessId, CommandLine
```

### bridge log を見る

```powershell
Get-Content .\runtime\logs\adb_bridge.log -Tail 20
```

### observer log を見る

```powershell
Get-Content .\runtime\logs\observer.log -Tail 20
```

### records を見る

```powershell
Get-ChildItem -Recurse .\runtime\records
```

## 留意

- 現在の実装ルートは `USB / adb bridge`
- Syncthing は将来の本命ルートとして文書に保持している
- Docker Desktop 自動起動は未安定なので、必要なら先に手動起動する
