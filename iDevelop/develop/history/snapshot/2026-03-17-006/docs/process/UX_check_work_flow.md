# UX確認ワークフロー

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 利用者準備ノート

- この欄には、Codex だけでは代行できない user action や外部 device access だけを書く
- 実際に blocker が発生していない限り、推測の user task は書かない
- 現在の外部準備:
  - なし

## 目的

consultation workspace の完成済み baseline を維持しつつ、session archive viewer、compact tree explorer、one-click download、詳細 error handling を含む次段 UX を確認する。

## 事前確認

1. `config/project-manifest.json` が意図した project root を指していることを確認する。
2. 次を実行する。

```powershell
cd C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop
npm install
npm test
npm run build
```

3. どれか 1 つでも失敗したらそこで止める。

## 起動

```powershell
npm run dashboard
```

`http://127.0.0.1:4173/` を開く。

## ヘッダー確認

1. 画面上部が `Refresh`、`Consultation Contract`、`Shared Conversation` の 3 カードに圧縮されていることを確認する。
2. desktop で上端のおよそ 6 分の 1 程度に収まっていることを確認する。
3. 各カードに click で詳細表示が開くことを確認する。
4. pointer を外すと compact 状態へ戻ることを確認する。

## 文書ワークスペース確認

1. `文書` tab を開く。
2. top directory ごとの compact tree explorer が見えることを確認する。
3. `.md` を含む directory が compact に表示され、child markdown を選べることを確認する。
4. source が read-only の場合は、`local draft` unlock guidance に次が書かれていることを確認する。
   - unlock 条件
   - source は editable draft 状態へ clone されること
   - safe apply までは original source は変わらないこと
5. `local draft` を開始して edit controls が有効になることを確認する。
6. selected document preview が viewport の右にはみ出さないことを確認する。
7. consultation panel が `Summary`、`Evidence`、`Next Action` を説明していることを確認する。
8. consultation を 1 回実行し、response panel にその 3 項目が出ることを確認する。
9. preview から download action を 1 操作で実行できる構造になっていることを確認する。

## データワークスペース確認

1. `データ` tab を開く。
2. session archive または export metadata が一覧できることを確認する。
3. source が read-only の場合は、`local draft` unlock guidance に次が書かれていることを確認する。
   - unlock 条件
   - dataset list は editable draft 状態へ clone されること
   - source 反映前に safe apply が必要なこと
4. `local draft` を開始して status/count 編集が有効になることを確認する。
5. dataset table が viewport 内に収まり、必要なら横スクロールすることを確認する。
6. consultation panel が `Summary`、`Evidence`、`Next Action` を説明していることを確認する。
7. consultation を 1 回実行し、response panel にその 3 項目が出ることを確認する。
8. session/export 情報に mode や route があれば識別できることを確認する。

## コードワークスペース確認

1. `コード` tab を開く。
2. code targets が read-only のままであることを確認する。
3. approval state が `phase-gated-read-only` であることを確認する。
4. `Apply Request` が apply preview を出さないことを確認する。

## 共有シェル確認

1. 文書 consultation を 1 回実行する。
2. データ consultation を 1 回実行する。
3. shared shell に prompt、bundle、summary、approval、history が出ることを確認する。
4. consultation response 後に proposal actions が見えることを確認する。

## Safe Apply 確認

1. editable または unlocked local draft の文書モードで consultation を実行する。
2. `Apply Request` を押して preview が出ることを確認する。
3. approve して document preview に `[Applied Consultation]` が追記されることを確認する。
4. code workspace では同じ操作が phase gate により block されることを確認する。

## Refresh 確認

1. `Refresh` header card に refresh evidence が表示されることを確認する。
2. refresh を実行し、`fresh`、`refreshed`、`stale` が適切に更新されることを確認する。

## 記録

1. UX evidence は [UX_evidence_log.md](C:/Users/tetsuya/playground/Data_Correcting_System/iDevelop/docs/observability/UX_evidence_log.md) に記録する。
2. failure が出た場合は rollback trigger と visible symptom を記録する。

## ロールバック条件

次のどれかが起きたら rollback する。

- local draft unlock が original source を即時変更する
- consultation guidance が欠落する、または誤解を招く
- header expansion が重要な control を隠す、または collapse しない
- preview または table が右端にはみ出す
- compact tree explorer が directory 構造を把握しづらい
- download action が失敗時状態を分けて示せない
- `npm test` または `npm run build` が失敗する

## ロールバック手順

1. dashboard を止める。
2. 最後の known-good implementation へ戻す。
3. `npm test` と `npm run build` を再実行する。
4. failure を [UX_evidence_log.md](C:/Users/tetsuya/playground/Data_Correcting_System/iDevelop/docs/observability/UX_evidence_log.md) に記録する。

## 終了条件

- `npm test` が通る
- `npm run build` が通る
- header cards が意図どおり compact / expand する
- document local draft unlock が理解しやすく使える
- data local draft unlock が理解しやすく使える
- consultation capability guidance が document/data workspace に表示される
- preview と table layout が右にはみ出さない
- code workspace が phase-gated read-only を維持する
- compact tree explorer から `.md` を選択できる
- session archive と export metadata が把握しやすい
- download action と失敗時表示が理解しやすい
