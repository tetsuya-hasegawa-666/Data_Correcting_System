# UX確認ワークフロー

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 利用者準備ノート

- この欄には、Codex だけでは代行できない user action や外部 account access だけを書く。
- 実 blocker が発生していない限り、推測の user task は書かない。
- 現在の外部準備:
  - Microsoft account で Excel Online を開けること

## 目的

この手順は、Excel Online と side-by-side で Shadow Assistant prototype を検証するための workflow である。

## 事前に必要なもの

- Windows
- ブラウザ
- Microsoft account
- Python 3.11 以上
- `C:\Users\tetsuya\playground\Data_Correcting_System\iAgents`

## エントリーポイント

- 通常アプリ起動:
  `python -m iagents app`
- local web app 直起動:
  `python -m iagents serve --port 8765 --open-browser`
- range 単体確認:
  `python -m iagents range "Sheet1!B3:D5" --visible-rows 10 --visible-cols 4`

## 最小確認ルート

1. PowerShell で `iAgents/` を開く。
2. `$env:PYTHONPATH='src'` を実行する。
3. `python -m iagents app` を実行する。
4. launcher 上で `Excel Online を開く` を押すか、自分で Excel Online を開く。
5. launcher が Excel Online の window title を検知すると、必要なら Shadow Assistant を自動で開く。
6. 自動で開かなければ `Shadow Assistant を開く` を押す。
7. Excel Online の名前ボックスに表示される range を assistant の `現在の range` に入力する。
8. `提案する` を押して Smart Snap 候補を確認する。
9. 任意の表データを Clean Paste へ貼って `浄化する` を押す。
10. 必要なら Data Synthesizer、Graph Shadow Editor、Semantic Shadow Assist を順に試す。

## 最終目標ルート

1. 利用者が Excel Online を開く。
2. Shadow Assistant を横に置く。
3. 利用者が range、貼り付け、グラフ、自然言語指示のどれかを行う。
4. assistant が提案、preview、履歴、整形結果を返す。
5. 利用者が採用したものだけを Excel Online へ反映する。
6. 原本を壊さずに作業効率だけが上がる。

## 観察点

- 初見でも 5 分以内に app を起動できるか
- Excel Online 検知から Shadow Assistant 自動オープンまで迷わず進むか
- Smart Snap 候補が直感に合うか
- Clean Paste の結果がそのまま Excel Online に使いやすいか
- Graph と Intent の候補文が過不足なく読めるか

## うまくいかないとき

- `python` が見つからない:
  Python を入れて PowerShell を開き直す。
- `ModuleNotFoundError`:
  `$env:PYTHONPATH='src'` を先に設定する。
- 自動起動しない:
  browser の window title に `Excel` が含まれない場合がある。そのときは launcher の `Shadow Assistant を開く` を押す。
- local app が開かない:
  `http://127.0.0.1:8765/api/health` を開き、JSON が返るか確認する。
- Excel Online で range が分からない:
  名前ボックスの表示を assistant 側へそのまま転記する。
