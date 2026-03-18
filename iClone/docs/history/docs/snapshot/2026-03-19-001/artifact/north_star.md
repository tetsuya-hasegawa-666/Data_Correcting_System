# north star

## 背景

この project の主目的は、ユーザーに「データクローン機能」を直感的に使い続けてもらうことにある。  
使用率が上がるほど、生きたメモと写真が蓄積され、そこからユーザー意図と真の KPI の手がかりを拾いやすくなる。

## 現在の主体

- edge: `Xperia 5 III`
- host: `Windows Tezy-GT37`

## 最優先の UX 原則

1. dashboard より clone workspace を優先する
2. status は小さい色ラベルで足りる
3. count は footer に小さく置けばよい
4. editor、sync、workspace list を最短距離で触れる
5. save / sync の予定は明示して心理不安を減らす
6. mobile / PC の両方で設定できる
7. mobile / PC の両方で delete できる

## 共通ラベル

- `Local`
  端末内には保存されている
- `PC`
  PC workspace にコピーされている
- `PC synced`
  次の質問まで返ってきている

## 設定 UX

両端末で次を設定可能にする。

- `auto save` ON / OFF
- `auto sync` ON / OFF
- interval:
  `realtime` `10s` `1m`

各設定は「次にいつ保存 / 同期されるか」を UI 上で示す。

## 現在の同期戦略

- 将来の本命:
  `mDNS + MAC whitelist + Syncthing + Docker LLM`
- 現在の実装:
  `Android app local files -> adb bridge -> host observer -> records -> reverse sync`

## 到達像

1. ユーザーは mobile / PC のどちらからでも clone を始められる
2. その場で local save される
3. 設定どおりのタイミングで sync される
4. list から delete / resync をすぐ実行できる
5. 使い続けた結果として、文脈データが自然に集まり、次の質問と KPI 候補へつながる
