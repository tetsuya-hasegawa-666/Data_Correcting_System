# UX確認ワークフロー

## 対象

`iClone` の mobile / desktop 両方で、clone-first UX が成立しているかを確認する。

## エントリーポイント

- PC: Desktop の `iClone Start`
- Android: `iClone Mobile`

## 事前条件

- Docker Desktop が起動している
- `adb devices -l` で `Xperia 5 III` が `device` として見える
- host app が `http://127.0.0.1:8874/preview/index.html` で開ける

## 今回の確認観点

1. 上部 status が `☑Mobile --connector-- ☑/×Server` の 3 要素だけで読める
2. docker 未起動時は `Server = ×` と赤 connector `--×--` になる
3. 圏内で同期準備中は黄色 connector `- - - -` になる
4. 同期中は緑 connector `<--->` になる
5. editor と workspace list が主役で、counts は footer の小表示に収まっている
6. settings は compact panel で一目で変更できる
7. `auto save` `auto sync` の `ON/OFF` と `realtime / 10s / 1m` を両画面で変更できる
8. `次の同期` が両画面で見える
9. mobile / desktop の両方で delete できる

## PC側の確認

1. `iClone Start` を起動する
2. browser で `http://127.0.0.1:8874/preview/index.html` を開く
3. 画面上部で `Mobile --connector-- Server` を確認する
4. editor に見出しとメモを入れる
5. 必要なら写真を追加する
6. `記録する` と `今すぐコピー` の両方を試す
7. settings を開き、`auto save` `auto sync` と interval を変更する
8. footer の counts と `次同期` が小さく収まっていることを確認する
9. list の delete で record を消せることを確認する

## mobile側の確認

1. `iClone Mobile` を起動する
2. 上部で `☑Mobile --connector-- ☑/×Server` を確認する
3. clone tab で見出しとメモを入れる
4. 必要なら写真を追加する
5. `記録する` と `今すぐコピー` の両方を試す
6. settings を開き、`auto save` `auto sync` と interval を変更する
7. history tab で閲覧履歴を確認する
8. workspace list の delete で record を消せることを確認する
9. footer の counts と `次同期` が小さく収まっていることを確認する

## 最小確認手順

1. Docker Desktop を起動する
2. `iClone Start` を起動する
3. `iClone Mobile` を起動する
4. mobile / desktop の両方で上部 status を確認する
5. mobile から 1 件メモを入れて `今すぐコピー` を押す
6. PC 側 list に反映されることを確認する

## 最終目標手順

1. Docker 起動あり / なしの両方で status を見比べる
2. mobile / desktop の両方からメモを作る
3. `auto sync realtime` `10s` `1m` を切り替えて `次同期` 表示を確認する
4. 写真付きメモを mobile から送る
5. PC で写真プレビューと質問表示を確認する
6. mobile / desktop の両方から delete を試す
7. `Mobile / Server / connector` が常に現在の同期状態を誤解なく示すことを確認する

## 関連文書

- 自動検証レポート: `docs/process/UX_auto_validation_report.md`
