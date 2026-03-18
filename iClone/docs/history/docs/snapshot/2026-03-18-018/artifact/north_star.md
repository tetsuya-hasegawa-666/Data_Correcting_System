# north star

## 背景

多忙なマネージャーが、現場で思いついた断片的なメモをその場で残し、PC 側のワークスペースへ自然にコピーしながら、「次に追うべき KPI」の気配まで拾える状態を目指す。

## 現在の主体

- edge: `Xperia 5 III`
- host: `Windows Tezy-GT37`

将来は Android 多機種、iPhone、Ubuntu host、Syncthing 主体の近接同期へ広げるが、現行の実装主体は `Xperia 5 III + Windows` の組み合わせである。

## UX の核

### mobile

- 主題は `その場で残す`
- 保存操作より入力を優先し、基本は自動保存
- `入力` `履歴` `ワークスペース` の 3 タブで迷わず移動できる
- `Local` `PC` `PC synced` の 3 状態で、コピーの進み具合が直感的に分かる

### desktop

- 主題は `コピーされたメモを使う`
- host console ではなく、end-user が読み返す workspace を正面に置く
- 最新メモ、次の質問、写真、コピー状況が一画面でつながる
- mobile と同じラベルと言葉づかいを使い、学習コストを増やさない

## copy-first 原則

1. ユーザーは「保存する」より「残す」を行う
2. システムは入力を受けたら、できるだけ早く local entry として保存する
3. PC 側は「同期できたか」より「コピーされたメモをどう使うか」を見せる
4. 説明文は短くし、状態ラベルと本文で意味が通るようにする
5. 写真も文字メモと同列に扱い、見出しと本文の流れの中で読めるようにする

## 現在の同期戦略

- 将来の基準:
  `mDNS + MAC whitelist + Syncthing + Docker LLM`
- 現在の実装:
  `Android app local files -> adb bridge -> host observer -> records -> reverse sync`

## 到達像

1. ユーザーはスマホで短くメモする
2. 入力内容は自動で local entry として保存される
3. 写真も同じ entry に添付される
4. PC ワークスペースへコピーされる
5. host 側で次の質問と KPI candidate が生成される
6. 質問がスマホへ戻り、`PC synced` として続きが読める
