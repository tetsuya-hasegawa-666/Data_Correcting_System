# UX確認ワークフロー

## 目的

`iClone` の mobile / desktop で、clone-first UX、再接続 UX、ごみ箱 UX が意図どおりに動くかを確認する。

## エントリーポイント

- PC: Desktop の `iClone Start`
- Android: `iClone Mobile`

## 事前条件

- Docker Desktop が起動している
- `adb devices -l` で `Xperia 5 III` が `device` として見える
- host app が `http://127.0.0.1:8874/preview/index.html` で開ける

## 上段 status の見方

- 平常同期
  - `✓Mobile <---> ✓Server`
  - 3 要素とも緑
- 同期準備中
  - `✓Mobile - - - - ✓Server`
  - `Mobile = 緑` `connector = 黄` `Server = 黄`
- 圏外 / docker 停止
  - `✓Mobile --×-- ×Server`
  - `Mobile = 緑` `connector = 赤` `Server = 赤`
- 再接続中
  - `✓Mobile - - - - ✓Server`
  - 3 要素とも黄で点滅

## PC 確認

1. `iClone Start` を実行する
2. `http://127.0.0.1:8874/preview/index.html` を開く
3. 上段が `接続` と `再接続` の 2 つの box に分かれていることを確認する
4. `Serverを起こす` と `再接続` が editor から離れて配置され、誤クリックしにくいことを確認する
5. `Memo Clone` を開き、スクロール中も `閉じる` が追従することを確認する
6. `Photo Clone` を開き、画像付き entry が見えることを確認する
7. entry の削除でごみ箱へ移り、ごみ箱から `完全消去` と `一括消去` ができることを確認する

## mobile 確認

1. `iClone Mobile` を起動する
2. 上段が `接続` と `再接続` の 2 つの box に分かれていることを確認する
3. `Serverを起こす` と `再接続` がメモ入力欄から離れていることを確認する
4. メモ入力で自動保存されることを確認する
5. `Memo Clone` `Photo Clone` の折りたたみと `閉じる` が動くことを確認する
6. entry の削除でごみ箱へ移り、ごみ箱から `完全消去` と `一括消去` ができることを確認する

## 再接続確認

1. docker 未起動または host stack 停止状態を作る
2. status が `✓Mobile --×-- ×Server` で赤になることを確認する
3. mobile または desktop で `Serverを起こす` を押す
4. status が黄色点滅の `再接続中` に入ることを確認する
5. stack 復帰後に `✓Mobile <---> ✓Server` の緑へ戻ることを確認する

## 最小確認手順

1. Docker Desktop を起動する
2. `iClone Start` を実行する
3. `iClone Mobile` を起動する
4. mobile でメモを 1 件入力する
5. PC の `Memo Clone` に同じ内容が現れることを確認する
6. その entry をごみ箱へ移し、ごみ箱から完全消去できることを確認する

## 最終目標手順

1. mobile でテキストと写真を含むメモを作る
2. 自動保存と自動同期の間隔を変更する
3. PC で `Memo Clone` `Photo Clone` に反映されることを確認する
4. PC から再接続を実行し、黄色点滅から緑復帰まで確認する
5. mobile からも再接続を実行し、同じ挙動になることを確認する
6. mobile / desktop の両方で soft delete と hard delete を確認する

## 関連文書

- 要約レポート: `docs/process/UX_auto_validation_report.md`
- 検証トレース: `docs/process/UX_validation_trace.yaml`
