# North Star

## Human Goal

`iDevelop` の中心価値は、ユーザーが文書・データ・コードを材料として選び、このソフトの中から Codex に相談し、根拠付きの返答と次アクションを得られることにある。dashboard は閲覧専用の終点ではなく、ユーザーと Codex の協働を支える consultation workspace として扱う。

## Scope Boundary

- この project の変更対象は `iDevelop/` 配下だけとする
- companion project `iSensorium/` とは境界ルールだけを共有し、実装・計画・履歴は分離する
- `iDevelop` は Codex 相談の入口を担う companion project である

## Non-Negotiables

- MVC を崩さない
- BDD で体験を定義し、TDD で実装を進める
- must scope は `document` と `data`
- `code` は phase gate を維持しつつ、相談材料としての参照価値を評価する
- live connection は safety-first で始め、いきなり自由編集へ進まない
- ユーザーが Codex に渡す対象、Codex が返す根拠、承認状態を明示する
- release line と plan set は、ユーザー指示がない限り連番で継続する
- 一度採用した ID、名称、状態名、artifact 名、source policy 名は、明示変更がない限り継続利用する

## Reuse Direction

- 他 project にコピーして使える project contract を維持する
- project ごとの差分は manifest で吸収する
- document / data / code は recursive read を基本とする
- live connection は read-first / consult-first / safety-first を原則にする
- 汎用性は「閲覧機能の再利用」だけでなく、「相談対象 bundle を Codex に渡せること」まで含めて定義する

## Success Criteria For The Current Phase

- consultation session contract が source-of-truth に定義されている
- 文書とデータを相談材料として選び、質問し、根拠付き応答を受け取る release line 計画が定義されている
- shared conversation shell、approval state、proposal-to-action が plan に落ちている
