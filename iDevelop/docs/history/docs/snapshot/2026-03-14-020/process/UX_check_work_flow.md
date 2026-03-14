# UX Check Work Flow

## Purpose

`iDevelop` の dashboard を Windows 初心者でも確認できるようにし、change tracking line の到達条件を手順化する。

## Generic Setup

1. 対象 project の root path を決める
2. `config/project-manifest.json` に project root / documentRoots / dataRoots / codeRoots / ignoreGlobs / `readOnly: true` を設定する
3. `documentRoots` と `dataRoots` の directory が実在することを確認する

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
2. live source の文書一覧が出ることを確認する
3. `読み取り専用` 案内が出ていて、`編集` が出ないことを確認する

## Data Check

1. `データ` tab を開く
2. live source のデータ一覧と集計が出ることを確認する
3. `読み取り専用` 案内が出ていて、更新 input / button が出ないことを確認する

## Refresh / Stale Check

1. shell の status strip に `fresh` または `refreshed` が出ることを確認する
2. `再読み込み` を押す
3. source に差分がない場合は `unchanged` evidence が追加されることを確認する
4. source に差分がある状態で `再読み込み` すると `refreshed` / `changed` evidence が追加されることを確認する
5. 長時間放置後、status strip が `stale` 表示になることを確認する

## Code Check

1. `コード` tab を開く
2. read-only の確認対象が表示されることを確認する
3. live code/script browse は `MRL-8` で追加予定と理解する

## Stop

1. dashboard を開いている PowerShell に戻る
2. `Ctrl + C` を押して停止する

## Exit Criteria

- `npm test` が通る
- `npm run build` が通る
- `npm run dashboard` で dashboard が起動できる
- `fresh` / `refreshed` / `stale` の状態が shell 上で判別できる
- refresh evidence が UI 上で確認できる
- `文書` `データ` `コード` の 3 tab が開ける
