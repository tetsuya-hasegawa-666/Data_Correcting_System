# UX確認ワークフロー

## 対象

`iClone` の mobile / desktop 両方で、clone-first UX と trash-first delete UX が成立しているかを確認する。

## エントリーポイント

- PC: Desktop の `iClone Start`
- Android: `iClone Mobile`

## 事前条件

- Docker Desktop が起動している
- `adb devices -l` で `Xperia 5 III` が `device` として見える
- host app が `http://127.0.0.1:8874/preview/index.html` で開ける

## 今回の確認観点

1. 上部 status が `✓Mobile connector ✓/×Server` の 3 要素だけで読める
2. 同期中 `<--->` のときは `Mobile` `connector` `Server` がすべて緑
3. 同期準備中 `- - - -` のときは `Mobile = 緑`、`connector = 黄`、`Server = 黄`
4. 圏外 / docker 停止時 `--×--` のときは `Mobile = 緑`、`connector = 赤`、`Server = 赤`
5. `Memo Clone` `Photo Clone` が折りたたみで開き、sticky close でいつでも閉じられる
6. ごみ箱は clone browser の直下に bar で置かれ、そこから hard delete と一括消去ができる
7. delete は即消去ではなく、ごみ箱へ移動する
8. counts は footer の小表示に収まっている

## PC側の確認

1. `iClone Start` を起動する
2. browser で `http://127.0.0.1:8874/preview/index.html` を開く
3. 上部 status の色ルールを確認する
4. `Memo Clone` を開き、scroll 中も `閉じる` が追従することを確認する
5. `Photo Clone` を開き、写真付き entry が見えることを確認する
6. entry の delete でごみ箱へ移ることを確認する
7. ごみ箱を開き、`完全消去` と `一括消去` を確認する

## mobile側の確認

1. `iClone Mobile` を起動する
2. 上部 status の色ルールを確認する
3. `Memo Clone` `Photo Clone` の折りたたみを確認する
4. scroll 中も `閉じる` が追従することを確認する
5. delete でごみ箱へ移ることを確認する
6. ごみ箱から `完全消去` と `一括消去` を確認する

## 最小確認手順

1. Docker Desktop を起動する
2. `iClone Start` を起動する
3. `iClone Mobile` を起動する
4. 上部 status を確認する
5. mobile から 1 件メモを入れて `今すぐコピー` を押す
6. PC 側 `Memo Clone` に反映されることを確認する
7. その entry を delete して、ごみ箱へ移ることを確認する

## 最終目標手順

1. Docker 起動あり / なしの両方で status の色を見比べる
2. `Memo Clone` `Photo Clone` の両方にデータが入ることを確認する
3. accordion の `閉じる` が scroll 中も押せることを確認する
4. mobile / desktop の両方から delete して、ごみ箱へ移ることを確認する
5. ごみ箱から `完全消去` と `一括消去` を確認する
6. `auto sync realtime` `10s` `1m` を切り替えて `次同期` 表示を確認する

## 関連文書

- 自動検証レポート: `docs/process/UX_auto_validation_report.md`
