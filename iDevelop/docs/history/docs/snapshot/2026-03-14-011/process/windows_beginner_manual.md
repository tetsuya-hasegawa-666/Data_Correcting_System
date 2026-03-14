# Windows Beginner Manual

## Purpose

この文書は、Windows 初心者でも `iDevelop` の dashboard を起動し、テストし、実際に画面を触って確認できるようにするための実行マニュアルである。

## Before You Start

- Windows の `PowerShell` を使う。
- 最初の 1 回だけ internet 接続が必要になることがある。
- dashboard は `iDevelop/` 配下だけで動かす。

## 1. PowerShell を開く

1. `スタート` を押す。
2. `PowerShell` と入力する。
3. `Windows PowerShell` または `PowerShell` を開く。

## 2. 作業フォルダへ移動する

PowerShell に次を貼り付けて Enter を押す。

```powershell
cd C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop
```

## 3. Node.js が使えるか確認する

次を実行する。

```powershell
node --version
npm --version
```

- 数字が表示されれば次へ進む。
- `node` が見つからない場合は Node.js のインストールが必要。

## 4. 最初の 1 回だけ依存関係を入れる

```powershell
npm install
```

- 2 回目以降は、`package.json` が変わっていなければ通常不要。

## 5. 自動テストを実行する

```powershell
npm test
```

- `passed` と表示されれば正常。
- 失敗したら、そのままログを保存して共有する。

## 6. build を確認する

```powershell
npm run build
```

- `built` と表示されれば正常。
- ここで失敗したら dashboard 起動前に修正が必要。

## 7. dashboard を起動する

```powershell
npm run dashboard
```

- `http://127.0.0.1:4173/` と表示されたら起動成功。
- PowerShell は閉じずにそのままにする。

## 8. ブラウザで dashboard を開く

1. `Edge` や `Chrome` を開く。
2. アドレス欄へ次を入力する。

```text
http://127.0.0.1:4173/
```

## 9. 体験操作する

### Document Tab

1. `Document` タブを開く。
2. 検索欄に `bdd` と入れる。
3. 文書が絞り込まれることを確認する。
4. `Edit` を押す。
5. テキストを少し変える。
6. `Save` を押す。
7. `Saved` と表示されることを確認する。

### Data Tab

1. `Data` タブを開く。
2. 任意の dataset の `Status` を変える。
3. `Records` の数値を変える。
4. `Update` を押す。
5. `Recent Results` に更新内容が追加されることを確認する。

### Code Tab

1. `Code` タブを開く。
2. read-only の target list が表示されることを確認する。
3. 実行ボタンや編集 UI がないことを確認する。

## 10. 画面を閉じる

- ブラウザを閉じてもよい。
- 起動中の PowerShell に戻り、`Ctrl + C` を押す。
- `Terminate batch job` のような表示が出たら `Y` を押して Enter。

## 11. よくある見方

- `Document`:
  文書の検索、閲覧、簡易編集
- `Data`:
  dataset の状態変更、集計、更新結果の確認
- `Code`:
  read-only の参照入口

## 12. 困ったとき

- 画面が開かない:
  `npm run dashboard` 実行後に URL が表示されたか確認する。
- command が見つからない:
  `cd` で `iDevelop` に入れているか確認する。
- 保存した内容が消えた:
  現在は browser の localStorage を使っているため、別 browser や private window では共有されない。
- 途中で止めたい:
  `Ctrl + C` で安全に止められる。
