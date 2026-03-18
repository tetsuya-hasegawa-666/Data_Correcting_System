# UX確認ワークフロー

## 利用者準備ノート

- この欄には Codex だけでは代行できない user action だけを書く
- 現在の外部準備:
  - なし

## 目的

manager が Android で断片メモを残し、PC 側で project 文脈付き record と KPI 候補まで確認できるかを検証する。
現行の検証対象は Xperia 5 III と Windows host `Tezy-GT37` の組み合わせとする。

## 最小確認手順

1. Xperia 5 III で一問一葉 UI を開く
2. テキストまたは音声で 1 件メモする
3. 必要なら写真を追加する
4. PC 近接状態へ入る
5. `Tezy-GT37` 側で YAML record が project 文脈付きで整理されたことを確認する
6. AI の次問と KPI 候補が表示されることを確認する

## 最終目標手順

1. Xperia 5 III で実アプリを開く
2. 一問一葉へ回答し、必要なら音声と写真を同じ入力文脈で追加する
3. 保存直後に Android 側で `saved` から `synced` へ自然に遷移する
4. `Tezy-GT37` が近接 host として自動発見され、追加ログインなしで同期が走る
5. PC 側 review surface に `inbox -> processing -> analyzed` の順で状態が見える
6. 同じ画面文脈で、元ログ、添付、次問、KPI 候補、採用 / 保留 / 棄却操作ができる

## 現時点でのテスト前提

現時点では Xperia 5 III 実アプリは未完成である。
そのため、今すぐ試せる UX テストは次の 2 本立てで行う。

- Android 側:
  mobile preview HTML と seed data で画面導線を確認する
- PC 側:
  host stack、observer、status snapshot、review snapshot を使って同期後 UX を確認する

### 事前に起動しておくもの

- Windows PC `Tezy-GT37`
- PowerShell
- ブラウザ
- Python
- Docker Desktop または WSL2 上で動く Docker

### エントリーポイント

- project root:
  `C:\Users\tetsuya\playground\Data_Correcting_System\iClone`
- host stack 起動:
  `scripts/start_host_stack.ps1`
- PC 側 preview:
  `preview/index.html`
- mobile 側 preview:
  `preview/mobile_quick_capture.html`
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

### 2. Docker が起動しているか確認する

1. 画面右下に Docker Desktop のアイコンがあるか見る
2. ない場合は Docker Desktop を起動する
3. 起動後、PowerShell で次を実行する

```powershell
docker ps
```

4. エラーが出なければ先へ進む

### 3. host stack を起動する

1. PowerShell で次を実行する

```powershell
powershell -ExecutionPolicy Bypass -File .\scripts\start_host_stack.ps1
```

2. これで Syncthing、Ollama、observer の骨格が起動する

### 4. seed データを同期到着データとして置く

1. 次を実行する

```powershell
Copy-Item .\data\seed\manager_context\records\project-alpha\2026\03\session-20260317-090000\entries\entry-20260317-090512.yaml .\runtime\host-inbox\xperia5iii-edge-001\entry-20260317-090512.yaml -Force
Copy-Item .\data\seed\manager_context\records\project-alpha\2026\03\session-20260317-090000\entries\question-20260317-091000.yaml .\runtime\records\project-alpha\2026\03\session-20260317-090000\question-20260317-091000.yaml -Force
Copy-Item .\data\seed\manager_context\records\project-alpha\2026\03\session-20260317-090000\derived\kpi-candidate-20260317-091500.yaml .\runtime\records\project-alpha\2026\03\session-20260317-090000\kpi-candidate-20260317-091500.yaml -Force
```

2. observer が起動していれば、`host-inbox` の YAML が `runtime/records` と `runtime/llm_inbox` に反映される

### 5. snapshot を生成する

1. 次を実行する

```powershell
python .\src\host\build_status_snapshot.py
python .\src\host\build_review_snapshot.py
```

2. `runtime\logs\status_snapshot.json` と `runtime\logs\review_snapshot.json` ができる
3. あわせて `runtime\logs\status_snapshot.js` と `runtime\logs\review_snapshot.js` もできる
4. PC preview はこの `.js` を読むので、preview を開く前にこの 2 コマンドを必ず実行する

### 6. PC 側 UX を見る

1. エクスプローラーで次を開く

```text
C:\Users\tetsuya\playground\Data_Correcting_System\iClone\preview\index.html
```

2. ブラウザで開く
3. 次を確認する
   - Inbox
   - Records
   - LLM Inbox
   - Services
   - Context Records

### 7. mobile 側 UX を見る

1. エクスプローラーで次を開く

```text
C:\Users\tetsuya\playground\Data_Correcting_System\iClone\preview\mobile_quick_capture.html
```

2. ブラウザで開く
3. 次を確認する
   - 一問一葉の問いが 1 つだけ見えているか
   - 音声、写真、タグの追加導線がシンプルか
   - `Local`、`PC`、`PC synced` の 3 ラベルが常時表示されているか
   - 各ラベルが緑 `✓` と赤 `×` で達成状態を表現できているか
   - ラベル直下の説明文で、それぞれの状態意味が自然に分かるか
   - `Local` でも画面下部の領域サイズが変わらず、PC 同期待ちの表現が出るか
   - `PC` では質問生成待ちの空状態が出るか
   - `PC synced` では次の一問が表示されるか

## 現時点テストの見どころ

- Docker と observer が起動していれば、seed YAML を置くだけで host 側 record が増える
- PC 側 preview で `inbox -> analyzed` 相当の導線が見える
- mobile 側 preview で一問一葉と sync status の基調体験が見える
- 実アプリ未完成でも、現在の UX 設計と host stack の接続点を確認できる

## 観察点

- 入力開始まで迷わないか
- 同期状態が透過的か
- project 文脈が保たれているか
- 次問が自然か
- KPI 候補に根拠があるか
- Android 側で `Local`、`PC`、`PC synced` の 3 ラベルと `✓ / ×` だけで進行状態が直感的に分かるか
- PC 側で `inbox -> processing -> analyzed` の状態遷移が追いやすいか
