# UX Check Work Flow

## 目的

`iDevelop` の dashboard を、Windows 初心者でもテスト実行、generic setup、体験確認まで進められるようにする。

## generic setup

1. 対象 project の root path を決める。
2. 次の manifest 情報を整理する。

```text
projectId
projectRoot
documentRoots
dataRoots
codeRoots
ignoreGlobs
readOnly=true
```

3. document / data / code の各 root は、子、孫、その先の directory まで再帰的に読む前提で整理する。
4. 存在しない root は missing root として扱い、停止条件にはしない。

## 事前準備

- `PowerShell` を使う。
- 作業場所は `C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop`。
- 初回だけ `npm install` が必要。

## 起動前チェック

1. PowerShell を開く。
2. 次を実行する。

```powershell
cd C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop
node --version
npm --version
```

3. まだ依存関係を入れていない場合は次を実行する。

```powershell
npm install
```

## 自動テスト

1. 次を実行する。

```powershell
npm test
```

2. `passed` が出れば成功。

## build 確認

1. 次を実行する。

```powershell
npm run build
```

2. build 完了メッセージが出れば成功。

## dashboard 起動

1. 次を実行する。

```powershell
npm run dashboard
```

2. PowerShell に `http://127.0.0.1:4173/` が出たら、そのまま起動した状態で待つ。
3. `Edge` か `Chrome` で次を開く。

```text
http://127.0.0.1:4173/
```

## 体験確認

### ドキュメント

1. 上部の `ドキュメント` を押す。
2. 検索欄に `調査` か `設計` を入れる。
3. 一覧から任意の文書を押してプレビューが変わることを確認する。
4. `編集` を押す。
5. 本文にダミー文を 1 行追加する。
6. `キャンセル` を押し、編集欄が閉じて保存されないことを確認する。
7. もう一度 `編集` を押し、本文を変えて `保存` を押す。
8. `保存しました` が表示されることを確認する。
9. 編集欄の外側をクリックするとキャンセル扱いで閉じることを確認する。

### データ

1. 上部の `データ` を押す。
2. 一覧の任意の行で `状態` を変える。
3. `レコード数` を適当な値に変える。
4. `更新` を押す。
5. `更新結果` に新しい履歴が増えることを確認する。

### コード

1. 上部の `コード` を押す。
2. 参照用ターゲットが一覧で見えることを確認する。
3. `参照専用です。プロセス接続、実行、編集はできません。` が表示されることを確認する。

## 終了方法

1. ブラウザを閉じる。
2. dashboard を起動している PowerShell に戻る。
3. `Ctrl + C` を押す。

## 記録すべき観点

- generic setup に必要な manifest 情報が揃っているか。
- `ドキュメント` `データ` `コード` の 3 tab が押せるか。
- `ドキュメント` で `保存` と `キャンセル`、外側クリックキャンセルが動くか。
- `データ` で仮更新結果が見えるか。
- `コード` が参照専用として読めるか。
