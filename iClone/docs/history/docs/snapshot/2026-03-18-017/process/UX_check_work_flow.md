# UX確認ワークフロー

## 対象

`iClone` は、現時点では `Xperia 5 III` と Windows PC `Tezy-GT37` を対象に、スマホで残したメモを PC ワークスペースへ同期する UX を確認する。

## 事前に必要なもの

- Windows PC `Tezy-GT37`
- Docker Desktop
- PowerShell
- Python
- `adb` が使えること
- Xperia 5 III
- USB デバッグ許可済みの USB 接続

## エントリーポイント

- PC:
  Desktop の `iClone Start`
- Android:
  ホーム画面の `iClone Mobile`

## 現時点の最小確認手順

### 1. Docker を起動する

1. Windows で Docker Desktop を起動する
2. PowerShell を開く
3. 次を実行する

```powershell
docker ps
```

4. エラーが出なければ次へ進む

### 2. Android 接続を確認する

1. PowerShell で次を実行する

```powershell
adb devices -l
```

2. `QV788MFJA6 device model:SO_53B` のように Xperia 5 III が `device` で見えていることを確認する

### 3. PC を 1 回で起動する

1. Desktop の `iClone Start` をダブルクリックする
2. 内部では次が順に起動する
   - host stack
   - adb bridge
   - host app
3. URL を直接確認したい場合は次を開く

```text
http://127.0.0.1:8874/preview/index.html
```

4. 応答確認だけなら次を実行する

```powershell
curl.exe -I http://127.0.0.1:8874/preview/index.html
```

### 4. Android アプリを起動する

1. Xperia 5 III で `iClone Mobile` を開く
2. 画面上部にメモ欄があることを確認する
3. `入力` `履歴` `ワークスペース` の 3 タブがあることを確認する

### 5. mobile UX を確認する

- 保存ボタンを押す前でも、自動仮保存の文言が見えるか
- `Local` `PC` `PC synced` が常時表示され、`✓ / ×` で段階が分かるか
- `次の質問` エリアの見出しは固定で、質問未到着時は中央に `PC 同期待ち` だけが出るか
- `ワークスペース` タブでメモ一覧を `新しい順` `古い順` `種別順` に並び替えられるか
- `履歴` タブに見返したメモが入る設計になっているか

### 6. PC UX を確認する

- user-facing の画面になっているか
- 受信メモ数、写真添付数、次の質問件数が上部で読めるか
- 最新メモ、次の質問、写真ギャラリー、同期状態が 1 画面で追えるか
- records 配下の添付写真がそのまま表示されるか

## 実同期確認手順

### A. Android 実 UI から確認する理想手順

1. `iClone Mobile` で見出しと本文を入力する
2. 必要なら `写真を添付` を押して画像を選ぶ
3. `記録を確定` を押す
4. 数秒待つ
5. PC 側の `iClone Workspace` を開き直す
6. 新しいメモと写真が出ることを確認する
7. Android 側に戻り、`PC` または `PC synced` が進むことを確認する

### B. 現時点での技術確認手順

Android 実 UI の最終自動確認が未完了な場合でも、device filesystem を直接見ることで同期を確認できる。

1. Android 側 outbox の存在確認

```powershell
adb shell ls -R /sdcard/Android/data/com.iclone.mobile/files/iclone
```

2. adb bridge が起動しているか確認

```powershell
Get-CimInstance Win32_Process | Where-Object { $_.CommandLine -like '*adb_bridge.py*' } | Select-Object ProcessId, CommandLine
```

3. bridge log を見る

```powershell
Get-Content .\runtime\logs\adb_bridge.log -Tail 20
```

4. host observer log を見る

```powershell
Get-Content .\runtime\logs\observer.log -Tail 20
```

5. records 側の反映を見る

```powershell
Get-ChildItem -Recurse .\runtime\records
```

## 最終目標手順

1. ユーザーは Desktop の `iClone Start` を 1 回ダブルクリックする
2. ユーザーは Xperia 5 III の `iClone Mobile` を開く
3. メモと写真を追加し、保存操作を意識せずに端末へ残せる
4. PC が近くにあり、同期条件を満たすと PC ワークスペースへ自然に反映される
5. PC 側では最新メモ、写真、次の質問、同期状態が end-user 画面としてまとまって読める
6. Android 側へ次の質問が戻り、`PC synced` として読める
7. 利用者は CLI を意識せず、PC もスマホもアイコンだけで操作できる

## 補足

- 現在の実働経路は `USB / adb bridge` である
- Syncthing は将来の多端末・多 OS 経路として source-of-truth に残している
- Docker Desktop 自動起動は未安定のため、現時点では先に Docker Desktop を起動しておく前提で確認する
