# UX確認ワークフロー

## 利用者準備ノート

- この欄には Codex だけでは代行できない user action だけを書く
- 現在の外部準備:
  - Xperia 5 III を USB デバッグ許可付きで接続する

## 目的

manager が Android で断片メモを残し、PC 側で project 文脈付き record と KPI 候補まで確認できるかを検証する。
現行の検証対象は Xperia 5 III と Windows host `Tezy-GT37` の組み合わせとする。

## 現在の実行形態

- PC 側:
  native EXE ではなく local web app。Desktop shortcut `iClone Start` から 1 回のダブルクリックで stack と app をまとめて起動できる。
- Android 側:
  `iClone Mobile` という APK。Xperia 5 III に install するとホーム画面アイコンから起動できる。

## 最小確認手順

1. Xperia 5 III で `iClone Mobile` を開く
2. テキストまたは音声で 1 件メモする
3. 必要なら写真を追加する
4. PC 近接状態へ入る
5. `Tezy-GT37` 側で YAML record が project 文脈付きで整理されたことを確認する
6. AI の次問と KPI 候補が表示されることを確認する

## 最終目標手順

1. Xperia 5 III で `iClone Mobile` を開く
2. 一問一葉へ回答し、必要なら音声と写真を同じ入力文脈で追加する
3. 保存ボタン未押下でも Android 側で自動仮保存が維持される
4. `Tezy-GT37` が近接 host として自動発見され、追加ログインなしで同期が走る
5. PC 側 local web app に `inbox -> processing -> analyzed` の順で状態が見える
6. 同じ画面文脈で、元ログ、添付、transcript、次問、KPI 候補、採用 / 保留 / 棄却操作ができる

## 事前に起動しておくもの

- Windows PC `Tezy-GT37`
- Docker Desktop または WSL2 上で動く Docker
- PowerShell
- Python
- Xperia 5 III

## エントリーポイント

- project root:
  `C:\Users\tetsuya\playground\Data_Correcting_System\iClone`
- Windows shortcut 作成:
  `scripts/install_windows_shortcuts.ps1`
- PC 一括起動:
  `scripts/start_iclone.ps1`
- Android app build:
  `scripts/build_android_app.ps1`
- Android app install:
  `scripts/install_android_app.ps1`
- seed data の入口:
  `data/seed/manager_context/`

## 現時点のUXテストフロー

### 1. PowerShell を開く

1. Windows のスタートメニューを開く
2. `PowerShell` と入力して起動する
3. 次を貼り付けて Enter を押す

```powershell
cd C:\Users\tetsuya\playground\Data_Correcting_System\iClone
```

### 2. Windows shortcut を作る

1. 初回だけ次を実行する

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install_windows_shortcuts.ps1
```

2. Desktop に `iClone Start` と `iClone Host App Stop` ができる

### 3. Docker が起動しているか確認する

1. 画面右下に Docker Desktop のアイコンがあるか見る
2. ない場合は Docker Desktop を起動する
3. 起動後、PowerShell で次を実行する

```powershell
docker ps
```

4. エラーが出なければ先へ進む

### 4. PC を 1 回で起動する

1. Desktop の `iClone Start` をダブルクリックする
2. shortcut を使わない場合は次を実行する

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start_iclone.ps1
```

3. Docker Desktop の自動起動は現時点で未安定なので、まず Docker Desktop を手動で起動しておく
4. その後に Syncthing、Ollama、observer と PC app が順に起動する
5. 起動に失敗した場合は `runtime\logs\start_host_stack.log` を確認する

### 5. Android app を install する

1. Xperia 5 III を USB 接続した状態で次を実行する

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\install_android_app.ps1
```

2. install 後、Xperia 5 III のホーム画面に `iClone Mobile` アイコンが出る
3. 以後はそのアイコンから起動する

### 6. seed データを同期到着データとして置く

1. 次を実行する

```powershell
Copy-Item .\data\seed\manager_context\records\project-alpha\2026\03\session-20260317-090000\entries\entry-20260317-090512.yaml .\runtime\host-inbox\xperia5iii-edge-001\entry-20260317-090512.yaml -Force
```

2. observer が起動していれば、`host-inbox` の YAML が `runtime/records` `runtime/llm_inbox` `runtime/edge-outbox` に反映される

### 7. snapshot を生成する

1. 次を実行する

```powershell
python .\src\host\build_status_snapshot.py
python .\src\host\build_review_snapshot.py
```

2. `runtime\logs\status_snapshot.json` と `runtime\logs\review_snapshot.json` ができる
3. あわせて `runtime\logs\status_snapshot.js` と `runtime\logs\review_snapshot.js` もできる

### 8. PC 側 UX を見る

1. 基本は Desktop の `iClone Start` から開く
2. 直接見る場合は次を使う

```text
http://127.0.0.1:8874/preview/index.html
```

3. 次を確認する
   - Inbox
   - Records
   - LLM Inbox
   - Edge Outbox
   - Services
   - Health
   - Context Records

### 9. mobile 側 UX を見る

1. Xperia 5 III のホーム画面から `iClone Mobile` アイコンを開く
2. 次を確認する
   - 一問一葉の問いが 1 つだけ見えているか
   - `入力` `履歴` `ワークスペース` の 3 タブで画面移動しやすいか
   - メインの `入力` タブは現行トーン、`履歴` は薄い青、`ワークスペース` は薄い緑で見分けやすいか
   - 音声、写真、タグの追加導線がシンプルか
   - 入力や音声追加の直後に、自動仮保存済みとして扱える前提が UI 上で破綻していないか
   - 質問エリアの見出しが常に `次の質問` で統一されているか
   - 質問未到着時は、内容欄の中央に `PC 同期待ち` だけが出ているか
   - 下部領域の直下に `Local` `PC` `PC synced` の 3 ラベルが常時表示されているか
   - 各ラベルが緑 `✓` と赤 `×` で達成状態を表現できているか
   - `ワークスペース` タブで `新しい順` `古い順` `種別順` の sort が切り替えられるか
   - `履歴` タブから最近開いたメモに戻れる想定が自然か
   - 音声メモと画像メモに文字見出しが付き、一覧で判別できるか

## 現時点テストの見どころ

- PC 側は CLI 直打ちなしでも Desktop shortcut から local web app を開ける
- PC 側は `iClone Start` の 1 回のダブルクリックで stack と app をまとめて起動できる
- Android 側は preview ではなく `iClone Mobile` のアイコンから起動できる
- Docker と observer が起動していれば、seed YAML を置くだけで host 側 record が増える
- PC 側 app で `inbox -> analyzed` と reverse sync readiness が見える

## 観察点

- 入力開始まで迷わないか
- 同期状態が透過的か
- project 文脈が保たれているか
- 次問が自然か
- KPI 候補に根拠があるか
- Android 側で `Local` `PC` `PC synced` の 3 ラベルと `✓ / ×` だけで進行状態が直感的に分かるか
- Android 側で保存ボタン未押下の断片メモも失われない前提が自然か
- Android 側で一覧 sort と閲覧履歴が運用上役立つ粒度になっているか
- PC 側で `inbox -> processing -> analyzed` の状態遷移が追いやすいか
