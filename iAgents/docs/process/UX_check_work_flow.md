# UX確認ワークフロー

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 利用者準備ノート

- この欄には、Codex だけでは代行できない user action や外部 device access だけを書く。
- 実 blocker が発生していない限り、推測の user task は書かない。
- 現在の外部準備:
  - なし

## 目的

この手順は、1 件の brief を与えて multi-agent 協働出力を確認する最小 CLI 実験のワークフローである。

## 現時点のテスト対象

- 現在テストできるのは、`mock` ベースの CLI 実験版である。
- まだ Web 画面や常駐サーバーはなく、PowerShell から 1 コマンドで起動する。
- 本番向けの lightweight model 接続は未実装であり、現時点では seed brief と team config を読み込んで協働の流れだけを確認する。

## 事前に立ち上がっていなければならないもの

- Windows
  - PowerShell が開けること
- Python
  - Python 3.11 以上がインストール済みであること
- 作業フォルダ
  - `C:\Users\tetsuya\playground\Data_Correcting_System\iAgents` が存在すること
- 必須ファイル
  - `data/seed/session/brief.md`
  - `data/seed/config/agent_team.sample.json`
  - `src/iagents/cli.py`

## 今の環境条件

- OS:
  Windows を前提とする
- 実行場所:
  `iAgents/` フォルダをカレントディレクトリにした PowerShell
- ネット接続:
  不要
- 追加サーバー:
  不要
- 追加アプリ:
  不要

## エントリーポイント

- 実行入口:
  `python -m iagents --brief-file data/seed/session/brief.md`
- 補助入口:
  `python -m unittest discover -s tests`
- 初回だけ import error が出る場合:
  `$env:PYTHONPATH='src'` を先に設定してから同じコマンドを実行する

## 最小確認ルート

1. エクスプローラーで `C:\Users\tetsuya\playground\Data_Correcting_System\iAgents` を開く。
2. フォルダ上で右クリックし、PowerShell を開く。
3. `python --version` を実行し、Python 3.11 以上が出ることを確認する。
4. 必要なら `$env:PYTHONPATH='src'` を実行する。
5. `python -m iagents --brief-file data/seed/session/brief.md` を実行する。
6. 画面に `# iAgents Session Report` が表示されることを確認する。
7. `Round 1` と `Round 2` の見出しがあり、`Astra` `Nox` `Forge` の 3 agent が出てくることを確認する。
8. 最後に `Final synthesis` が表示されることを確認する。
9. strategist / critic / builder で文面の役割差が出ているかを見る。

## Windows でネットを見るくらいの人向けの実行フロー

1. まず `iAgents` フォルダを開く。
2. 上のアドレス欄に `powershell` と入力して Enter を押す。
3. 青または黒い画面が開いたら、`python --version` と打って Enter を押す。
4. `Python 3.11` 以上と出たら、そのまま次へ進む。
5. 次に `$env:PYTHONPATH='src'` と打って Enter を押す。
6. 次に `python -m iagents --brief-file data/seed/session/brief.md` と打って Enter を押す。
7. 文字がたくさん出てきたら、その中に `Round 1` `Round 2` `Final synthesis` があるかを見る。
8. 終わったら、PowerShell の画面を閉じればよい。

## 最終目標ルート

1. 利用者が brief を 1 件入力する。
2. lightweight model を使う複数 agent が役割分担して応答する。
3. agent 間で共有文脈を引き継ぎながら複数 round の協働を行う。
4. 統合 agent が最終提案、リスク、次アクションを 1 つの report にまとめる。
5. 利用者が保存済み report を見て、次の実験方針または実装方針を判断できる。
6. 将来的には mock ではなく local model または API model に差し替えても、同じ操作感で確認できる。

## 必要なもの

- Python 3.11 以上
- ローカル terminal
- `iAgents/` フォルダ一式

## 観察点

- 役割ごとに視点差が出ているか
- 2 round の context が後続発話へ反映されているか
- 最終統合で次アクションが読み取れるか
- 初めて触る人でも、PowerShell を開いてから実行完了まで迷わないか

## うまくいかないとき

- import error:
  `PYTHONPATH=src` 付きで実行するか、editable install を使う。
- `python` が見つからない:
  Python が未導入か、PATH が通っていない。Python 3.11 以上を入れてから PowerShell を開き直す。
- フォルダが違う:
  PowerShell 上で `pwd` を実行し、`iAgents` フォルダにいるか確認する。
- 文字化け:
  UTF-8 表示設定を確認する。
- 出力が単調:
  `data/seed/config/agent_team.sample.json` の focus を見直す。
