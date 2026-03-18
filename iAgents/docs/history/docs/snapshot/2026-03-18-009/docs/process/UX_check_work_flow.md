# UX確認ワークフロー

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 利用者準備ノート

- この確認は Codex だけでは完了できない user action を含む。
- 利用者の準備は Microsoft account で Excel Online を開けること。
- blocker がない限り、確認途中で作業を止めない。

## 位置づけ

この手順は、Excel Online を横に置いて Shadow Assistant companion app を確認するための workflow である。

## 事前条件

- Windows
- ブラウザ
- Microsoft account
- Python 3.11 以上
- `C:\Users\tetsuya\playground\Data_Correcting_System\iAgents`

## エントリーポイント

- 通常起動:
  `python -m iagents app`
- local web app を直接起動:
  `python -m iagents serve --port 8765 --open-browser`
- CLI 個別確認:
  `python -m iagents range "Sheet1!B3:D5" --visible-rows 10 --visible-cols 4`

## 最小確認ルート

1. PowerShell で `iAgents/` を開く。
2. `$env:PYTHONPATH='src'` を設定する。
3. `python -m iagents app` を実行する。
4. launcher で `Excel Online を開く` を押し、Microsoft account でサインインする。
5. companion が自動で開かなければ `Shadow Assistant を開く` を押す。
6. Range Pilot v2 に `Sheet1!B3:F12` などの range を入れて `候補を出す` を押す。
7. Selection Time Machine で `履歴へ保存` を押し、復元候補が出ることを確認する。
8. Smart Snap で `Ghost 候補を見る` を押し、ghost range と confidence を確認する。
9. Clean Paste に Markdown table か CSV を貼り、`整形する` を押す。
10. Semantic Shadow Assist に `売上を合計` と入れ、意図解釈が返ることを確認する。

## 最終目標ルート

1. launcher から companion app を起動する。
2. Excel Online を横に並べる。
3. Range Pilot v2 で遠方選択候補を出す。
4. Selection Time Machine で誤クリックからの復元候補を出す。
5. Smart Snap で header 行、右端列、下端行の不足候補を出す。
6. Clean Paste で表データを TSV または 1 セル式へ変換する。
7. Data Synthesizer で 2 つの dataset を統合し、列対応 report を確認する。
8. Graph Shadow Editor で chart family と editor label を確認する。
9. Input Mode Halo で mode と IME 状態を切り替えて確認する。
10. Semantic Shadow Assist で合計、拡張、グラフ、貼り付け、統合、復元の指示を試す。

## 完了条件

- launcher が起動する。
- Excel Online 検知または手動 open で companion app を開ける。
- Range Pilot と Smart Snap の候補が返る。
- Selection Time Machine が履歴 5 件を保持する。
- Clean Paste が整形結果を返す。
- Data Synthesizer が統合 preview を返す。
- Graph Shadow Editor が chart suggestion を返す。
- Input Mode Halo が mode と IME 状態を返す。
- Semantic Shadow Assist が提案を返す。

## うまくいかないとき

- `python` が見つからない:
  Python を入れてから PowerShell を開き直す。
- `ModuleNotFoundError`:
  `$env:PYTHONPATH='src'` を設定する。
- 自動で companion が開かない:
  launcher の `Shadow Assistant を開く` を押す。
- local app が開かない:
  `http://127.0.0.1:8765/api/health` を開いて JSON が見えるか確認する。
- Excel Online 側のセル選択を自動読取できない:
  現在は external companion scope のため、range は手入力またはコピペで渡す。
