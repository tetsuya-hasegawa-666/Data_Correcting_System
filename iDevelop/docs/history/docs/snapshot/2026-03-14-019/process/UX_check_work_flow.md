# UX Check Work Flow

## Purpose

`iDevelop` の dashboard を Windows 初心者でも確認できるようにし、live read line の到達条件を手順化する。

## Generic Setup

1. 対象 project の root path を決める
2. `config/project-manifest.json` に次を設定する

```json
{
  "projectId": "sample-project",
  "projectRoot": "C:/path/to/project",
  "documentRoots": ["docs", "develop"],
  "dataRoots": ["data"],
  "codeRoots": ["src"],
  "ignoreGlobs": ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/build/**"],
  "readOnly": true
}
```

3. `documentRoots` と `dataRoots` にある directory が実在することを確認する
4. live read 中は `readOnly` を `true` のままにする

## Start Up

```powershell
cd C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop
npm install
npm test
npm run build
npm run dashboard
```

ブラウザで `http://127.0.0.1:4173/` を開く。

## Document Check

1. `文書` tab を開く
2. manifest の `documentRoots` から読まれた文書が並ぶことを確認する
3. 検索欄に path / title / tag / 本文の語を入れて絞り込みできることを確認する
4. 文書を選ぶとプレビューと path が更新されることを確認する
5. `読み取り専用` の案内が出ていて、live source 接続時は `編集` ボタンが出ないことを確認する

## Data Check

1. `データ` tab を開く
2. manifest の `dataRoots` から読まれた file が一覧に出ることを確認する
3. 総データセット数、総レコード数、状態 chart が表示されることを確認する
4. live source 接続時は `読み取り専用` の案内が出て、更新 input / button が出ないことを確認する

## Refresh Check

1. shell の `再読み込み` を押す
2. 画面が再読込され、document/data が live source から再取得されることを確認する
3. 読み込み失敗時は seed fallback へ戻る可能性があるため、source policy 表示を確認する

## Code Check

1. `コード` tab を開く
2. read-only の確認対象が表示されることを確認する
3. code workspace は `MRL-8` まで static browse のままであることを理解する

## Stop

1. dashboard を開いている PowerShell に戻る
2. `Ctrl + C` を押して停止する

## Exit Criteria

- `npm test` が通る
- `npm run build` が通る
- `npm run dashboard` で dashboard が起動できる
- `文書` `データ` `コード` の 3 tab が開ける
- live source 接続時の `文書` `データ` が read-only で表示される
- `再読み込み` が押せる
