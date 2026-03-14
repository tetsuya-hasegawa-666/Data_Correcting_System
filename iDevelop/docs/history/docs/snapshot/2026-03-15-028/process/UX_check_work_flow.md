# UX Check Work Flow

## Purpose

`iDevelop` 全体の UX を確認するための単一フロー。起動前確認、操作確認、refresh / stale 確認、evidence 記録、問題時の切り戻しまでをこの文書に統合する。

## Pre-Check

1. `config/project-manifest.json` の `projectRoot` `documentRoots` `dataRoots` `codeRoots` が対象 project と一致している
2. `readOnly` が `true` のままである
3. 次が通る

```powershell
cd C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop
npm install
npm test
npm run build
```

4. どれか 1 つでも失敗したら UX check を止める

## Start

```powershell
npm run dashboard
```

ブラウザで `http://127.0.0.1:4173/` を開く。

## Workspace Check

### Document

1. `文書` tab を開く
2. live source の文書一覧が出ることを確認する
3. 検索が効くことを確認する
4. directory group ごとに文書がまとまり、`相談対象に追加` / `相談対象から外す` が出ることを確認する
5. consultation bundle 件数が表示されることを確認する
6. focus input に相談の焦点を入力し、`相談する` を押す
7. response panel に `Summary` `Evidence` `Next Action` が表示されることを確認する
8. live source が read-only の場合は `編集` が出ないことを確認する

### Data

1. `データ` tab を開く
2. live source のデータ一覧と集計が出ることを確認する
3. `相談対象に追加` / `相談対象から外す` が出ることを確認する
4. consultation bundle 件数が表示されることを確認する
5. focus input に観点を入力し、`相談する` を押す
6. response panel に `Summary` `Evidence` `Next Action` が表示されることを確認する
7. live source が read-only の場合は更新 input / button が出ないことを確認する

### Code

1. `コード` tab を開く
2. manifest の `codeRoots` 配下から code / script browse target が出ることを確認する
3. path、種別、説明、更新日時が read-only で表示されることを確認する
4. `読み取り専用です。実行、attach、保存はできません。` が表示されることを確認する

## Refresh Check

1. status strip に `fresh` または `refreshed` が出ることを確認する
2. `再読み込み` を押す
3. source に差分がない場合は `unchanged` evidence が追加されることを確認する
4. source に差分がある場合は `refreshed` / `changed` evidence が追加されることを確認する
5. 長時間放置後に `stale` 表示へ切り替わることを確認する

## Evidence

1. 確認結果を [UX_evidence_log.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\observability\UX_evidence_log.md) に追記する
2. failure があれば rollback trigger と一緒に残す

## Rollback Rule

次のどれかなら UX check を中断して rollback とする。

- manifest path が誤っていて別 project を読んでいる
- read-only であるべき画面に編集導線が出る
- `再読み込み` で error banner が継続し、live source を再取得できない
- `npm test` または `npm run build` が失敗する

## Rollback Action

1. `Ctrl + C` で dashboard を停止する
2. `config/project-manifest.json` を最後に成功した設定へ戻す
3. `npm test` と `npm run build` を再実行する
4. failure を [UX_evidence_log.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\observability\UX_evidence_log.md) に記録する

## Exit Criteria

- `npm test` が通る
- `npm run build` が通る
- `npm run dashboard` で dashboard が起動できる
- `文書` `データ` `コード` の 3 tab が開ける
- `文書` tab で bundle selection、focus input、response panel が確認できる
- `データ` tab で bundle selection、focus input、response panel が確認できる
- `fresh` / `refreshed` / `stale` が判別できる
- refresh evidence が UI 上で確認できる
- `コード` tab で live code/script browse ができる
