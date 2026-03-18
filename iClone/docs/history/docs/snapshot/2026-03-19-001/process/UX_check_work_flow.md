# UX確認ワークフロー

## 対象

`iClone` は、mobile / PC の両方でデータクローンを触りやすくする UX を確認する。

## エントリーポイント

- PC:
  Desktop の `iClone Start`
- Android:
  `iClone Mobile`

## 事前条件

- Docker Desktop 起動
- `adb devices -l` で `Xperia 5 III` が `device`
- host app が `http://127.0.0.1:8874/preview/index.html` で応答

## まず確認すること

1. status は小さい `Local / PC / PC synced` ラベルだけで読める
2. count は footer に小さく出ている
3. editor と workspace list が最初に触れる
4. `auto save` `auto sync` と interval を両端末で変更できる
5. delete を両端末で実行できる

## PC 側の確認

1. `iClone Start` を起動する
2. browser で `http://127.0.0.1:8874/preview/index.html` を開く
3. editor に見出しと本文を入れる
4. 必要なら写真を添付する
5. `記録する` と `今すぐコピー` の両方を試す
6. list に新しい record が増えることを確認する
7. settings を開き、`auto save` `auto sync` と interval を変更する
8. footer の次回同期表示が変わることを確認する
9. list の delete を押し、record が消えることを確認する

## mobile 側の確認

1. `iClone Mobile` を開く
2. 上部に compact status label があることを確認する
3. main tab で見出しと本文を入れる
4. 必要なら写真を添付する
5. `記録する` と `今すぐコピー` の両方を試す
6. list に新しい record が増えることを確認する
7. settings を開き、`auto save` `auto sync` と interval を変更する
8. `履歴` tab で閲覧履歴を確認する
9. delete を押し、record が消えることを確認する

## status 色ルール

- `Local`
  緑 current
- `PC`
  緑 current、`Local` はグレー complete
- `PC synced`
  緑 current、`Local` と `PC` はグレー complete
- 未到達状態は赤 pending

## 最小確認手順

1. PC / mobile を起動する
2. どちらか一方でメモを作る
3. `今すぐコピー` を押す
4. 相手側へ clone payload が届くことを確認する
5. delete を押して相手側反映が壊れないことを確認する

## 追加で見る点

- `auto sync realtime` のとき、入力後すぐに clone payload が出るか
- `10s` と `1m` のとき、次回予定が UI に出て不安が減るか
- counts が workspace の邪魔をしていないか
- dashboard 的な情報より clone 操作が主役になっているか

## 関連文書

- 自動検証レポート:
  `docs/process/UX_auto_validation_report.md`
