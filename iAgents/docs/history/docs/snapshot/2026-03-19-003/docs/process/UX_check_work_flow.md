# UX確認ワークフロー

> 共通文書ルール: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## 適用範囲と前提

- この手順は `iAgents` の Excel Online Shadow Assistant を、実ブラウザと実 Microsoft account で確認するためのもの
- UX 確認の前に、接続処理と環境整合の監査を行う
- 現在の active plan set は `2026-03-19-003 connection and environment reconciliation roadmap`
- blocker がない限り、ここで定義した接続監査を完了してから UX 確認に進む

## なぜ先に接続監査が必要か

- 「画面が変わらない」「選択が取れない」は UX 不具合にも見えるが、実際には起動経路、拡張機能、CORS、ローカル server、ブラウザ tab 状態のどこでも起こり得る
- 接続面の不整合を先に潰さないと、UX 確認で見えた失敗が設計問題なのか環境問題なのかを区別できない
- そのため、UX 確認の直前に `MRL-28` から `MRL-31` の監査 line を通す

## UXでないと確認できない理由

- Excel Online は browser 上の動的 UI であり、selection、focus、IME、tab 状態、拡張機能注入タイミングは実際の人の操作でしか再現できない
- browser bridge は実 URL、実ログイン状態、実タブでの script 注入成否に依存するため、CLI や unit test だけでは閉じない
- Shadow Assistant の価値は、提案の見え方、更新タイミング、安心感、邪魔さ、誤誘導の少なさにあるため、最終判断は UX 手触りでしかできない
- よって自動テストは前提条件の整備とロジックの下支えを担い、最終確認は UX 手順で行う

## 必要環境

- Windows
- Edge または Chrome
- Microsoft account
- Python 3.11 以上
- `C:\Users\tetsuya\playground\Data_Correcting_System\iAgents`
- ローカルで `http://127.0.0.1:8765` を開けること

## エントリーポイント

- 通常起動
  `python -m iagents app`
- local web app 直起動
  `python -m iagents serve --port 8765 --open-browser`
- 診断用 health
  `http://127.0.0.1:8765/api/health`

## 事前監査フロー

1. PowerShell で `C:\Users\tetsuya\playground\Data_Correcting_System\iAgents` を開く
2. `$env:PYTHONPATH='src'` を設定する
3. `python -m iagents app` を実行する
4. launcher が前面に見えることを確認する
5. ブラウザで `http://127.0.0.1:8765/api/health` を開き、`status: ok` が返ることを確認する
6. Edge または Chrome の拡張機能ページで `browser_bridge` を unpacked extension として読み込む
7. Excel Online を開く前に、拡張機能が `有効` になっていることを確認する
8. Excel Online を開き、ログイン後に tab を再読み込みする
9. Shadow Assistant 側で `Bridge State 更新` を押し、少なくとも空でない JSON を受け取れるかを確認する
10. 空のままなら Excel Online の開発者コンソールから manual bridge POST を実行し、assistant 側で state が見えるかを確認する

## manual bridge POST

Excel Online の tab で `F12` を押し、Console に次を貼る。

```js
fetch("http://127.0.0.1:8765/api/bridge/state", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    source: "manual_test",
    selection: "Sheet1!B4:F15",
    mode: "selection",
    workbook_name: document.title
  })
}).then(r => r.text()).then(console.log).catch(console.error)
```

これで `Bridge State 更新` 後に JSON が出るなら、server と assistant は正常で、残る原因は extension 注入や page 検出側に寄る。

## 最小確認ルート

1. launcher を起動する
2. `Excel Online を開く` を押す
3. Excel Online を開いた browser tab に `browser_bridge` が有効であることを確認する
4. 適当な workbook を開く
5. `B4:F15` などのセル範囲を選択する
6. Shadow Assistant で `Bridge State 更新` を押す
7. `selection` に `B4:F15` または `Sheet1!B4:F15` が出ることを確認する
8. `Live Assist 更新` を押す
9. `status: "ready"`、`range_assist`、`snap_assist` が返ることを確認する

## 接続不整合の切り分けポイント

- launcher が出ない
  表示位置か Tk 起動の問題
- `api/health` が返らない
  local server の起動経路か port 問題
- manual bridge POST だけ通る
  extension 注入、URL 対象、page 検出の問題
- Bridge State は出るが Live Assist が空
  relay 後の assist 計算か UI 更新の問題
- selection は出るが体験が悪い
  ここからが UX 改善対象

## 最終目標確認ルート

1. launcher から assistant を起動する
2. Excel Online を開いて bridge が自動で反応する
3. selection 変更で `Bridge State` が更新される
4. `Live Assist` が現在の selection に応じて Range Pilot と Smart Snap を返す
5. 誤クリック後に selection recovery 候補が出る
6. Clean Paste が貼り付け前の整形案を返す
7. Data Synthesizer が workbook handoff を返す
8. Graph Shadow Editor が bridge preview から chart recommendation を返す
9. Input Mode Halo が mode 状態を返す
10. Semantic Shadow Assist が bridge 文脈を使って target range、handoff、safety checklist を返す
11. 使った人が「何が壊れているのか分からない」状態にならず、失敗時も切り分け導線がある

## 現時点の到達点

- launcher は起動できる
- local server の health は返せる
- browser bridge の最小 relay 経路はある
- bridge 文脈を使う assist ロジックはある
- ただし Excel Online 実画面での relay と更新タイミングは、接続監査と実 UX 確認で詰める必要がある

## うまくいかないとき

- `python` が見つからない
  Python を入れてから PowerShell を開き直す
- `ModuleNotFoundError: iagents`
  `$env:PYTHONPATH='src'` を設定する
- launcher が見えない
  `Alt + Tab`、複数モニタ、前面表示を確認する
- `api/health` が返らない
  `python -m iagents serve --port 8765 --open-browser` を直接実行して確認する
- Bridge State が空
  extension の有効化、Excel Online tab の再読み込み、manual bridge POST の順で切り分ける
