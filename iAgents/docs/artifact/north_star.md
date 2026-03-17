# North Star

## Human Goal

人が 1 つの課題メモを渡すだけで、複数の軽量 AI agent が役割分担し、論点抽出、リスク確認、実行案整理を短時間で返せる状態を作る。

## 価値

- 単一 agent では漏れやすい観点を、役割分担で補完できる
- 重い推論基盤の前段として、軽量モデルの組み合わせ可能性を検証できる
- 将来の local model、API model、hybrid model へ adapter を差し替えやすい

## 非交渉条件

- 初期版は外部 API なしでも CLI デモが成立する
- agent ごとの責務は明示し、無名のブラックボックス協調にしない
- source-of-truth と実装骨格を同じ turn で初期化する
- 追加の user preparation は blocker が出るまで要求しない

## 初期仮説

- strategist、critic、builder の 3 役で最初の協働ループを表現できる
- 1 つの brief から 2 round 程度の対話を回せば、統合案の型を検証できる
- provider adapter を先に分離すれば、後から local LLM や API LLM を接続しやすい
