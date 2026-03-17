# UX確認ワークフロー

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 利用者準備ノート

- この欄には、Codex だけでは代行できない user action や外部 device access だけを書く。
- 実 blocker が発生していない限り、推測の user task は書かない。
- 現在の外部準備:
  - なし

## 目的

この手順は、多忙な manager が Android で断片メモを残し、PC 側で project 文脈付き record と次の問いを確認するまでの UX を検証するためのワークフローである。

## 現在の適用状態

- この文書は `MRL-16` 以降で実装する target UX の確認手順であり、現行端末に入っている `com.isensorium.app` version `0.1.0` の実装手順ではない。
- 2026-03-17 の実機確認では、現行端末の UI は `通常計測 / ポケット収納計測` を持つ capture recording app のままである。
- 現時点の実機確認は `MRL-13` までの capture line 証跡として扱い、この文書の quick memo 導線は future workflow として読む。

## UX 設計の柱

1. Zero-Friction Entry
   アプリ起動から入力完了まで数秒で終わる。
2. Invisible Sync
   host 近接時に同期が背景処理として成立する。
3. Context Preservation
   PC 側で project 文脈が失われない。

## まず結論

最小確認ルートは次の 6 手順である。

1. Android で一問一葉の入力画面を開く
2. テキストまたは音声で 1 件メモを残す
3. 写真が必要なら 1 枚追加する
4. host 近接状態へ入る
5. PC 側で project record root を開く
6. 同じ内容が YAML + attachment + generated question として揃っているか確認する

## 必要なもの

- Android 端末 1 台
- Windows PC 1 台
- WSL2 Ubuntu
- Syncthing peer 環境
- Docker 実行環境

## 体験テスト 1: edge 側 quick memo

### 観察点

- 起動から入力開始まで迷わないか
- 1 問だけが出ていて、次に何をすべきか明確か
- 写真と音声を追加しても、操作が分岐しすぎないか

## 体験テスト 2: invisible sync

### 観察点

- host 近接後に明示ログインなしで同期へ進めるか
- 同期待ち、同期中、同期完了の状態差が分かるか
- ネットワーク不安定時に local queue へ安全退避できるか

## 体験テスト 3: PC 側 context preservation

### 観察点

- record が project ごとに自動配置されるか
- attachment path と YAML metadata が一致するか
- AI 生成の次問が、直前 entry と論理的につながるか

## 体験テスト 4: KPI discovery

### 観察点

- KPI 候補に根拠 entry が紐付いているか
- 提案された問いが、情報密度を上げる方向になっているか
- manager が採用 / 保留 / 棄却を判断できる粒度か

## 評価ポイント

1. 入力コストが低いか
2. 同期が心理的に透過か
3. project 文脈が保たれているか
4. 次問が押し付けでなく自然か
5. KPI 候補が行動に移せる粒度か

## うまくいかないとき

- 近接しても同期されない:
  whitelist、peer 接続、local queue 残件を確認する。
- 転写が出ない:
  Docker transcriber と attachment path を確認する。
- project 文脈が誤る:
  `projectId` と mapping rule を確認する。
- KPI 候補が弱い:
  根拠 entry 数、未回答 question、topic 偏りを確認する。

## UX check 後の分岐

1. 採用
   quick memo、sync、context、question、KPI candidate が一連で成立した。
2. guarded 継続
   主導線は成立したが、問いや同期表現に改善が必要。
3. rollback
   近接認証または同期が危険で、旧導線へ戻す必要がある。
