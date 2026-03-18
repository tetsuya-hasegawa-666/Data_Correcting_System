# 北極星

## 背景

多忙なマネージャーが、現場で思いついた断片メモをそのまま残し、あとで PC 側ワークスペースに自然に集約される体験を先に作る。  
そのうえで、蓄積されたメモから「次の一問」と KPI 候補を返す。

## いまの主対象

- edge: `Xperia 5 III`
- host: `Windows PC Tezy-GT37`

将来は Android 機種拡張、Ubuntu host、Syncthing 中心の多端末同期へ広げる。ただし現在は、実働する最短経路として `USB / adb bridge` を優先する。

## UX の中心

### Android

- 一番上は end-user のメモ欄
- 保存前でも必ず自動仮保存する
- `入力` `履歴` `ワークスペース` の 3 タブで移動できる
- `Local` `PC` `PC synced` の 3 状態で、何ができるかが分かる
- 写真メモにも文字見出しを持たせる

### PC

- host 管理画面ではなく end-user workspace を主画面にする
- 最新メモ、写真、次の質問、同期状態を 1 画面で把握できる
- 添付写真を実画像として読める

## いまの同期原則

- 将来の基本構想:
  `mDNS + MAC whitelist + Syncthing + Docker LLM`
- 現在の実装原則:
  「今の Xperia 5 III と Windows で実際に通ること」を優先し、`Android app local files -> adb bridge -> host observer` を採用する

## 到達目標

1. ユーザーはスマホのアイコンからメモを残す
2. PC はアイコン 1 回で起動する
3. テキストと写真が PC ワークスペースへ届く
4. host 側で question と KPI candidate が生成される
5. 次の質問が Android に戻る
