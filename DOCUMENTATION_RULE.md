# 文書ルール

このファイルは `Data_Correcting_System` ワークスペース全体の文書ルールの唯一の基準です。各 project の `docs/` と `develop/` は、この文書を前提に各 project 固有の規約だけを追加します。

## 基本方針

- `.md` は原則として日本語で記述する
- 文脈上自然に日本語で表現できる UI 文言、説明文、ログ、エラー文、運用記述は極力日本語で記述する
- file path、識別子、API 名、class 名、package 名、command、環境変数などは原文のまま保持してよい
- file 名、directory 名、class 名、package 名、API 名、識別子、config key など、プログラム構成上アルファベットが推奨されるものはアルファベットを使う
- 英語を残すのは、固有名詞、外部仕様、識別子、短い引用、または日本語にすると意味が崩れる場合に限る
- 新しい文書ルールは chat だけで閉じず、この文書または各 project の source-of-truth に反映する
- project 間で責務が分かれる場合、実装作業は担当 project 配下で完結させる。振り分け不能な変更だけを事前相談対象とする

## commit / push ルール

- `app/build/`、`.gradle/`、`tmp/`、generated file、cache、device dump、screen capture などの生成物は commit / push しない
- commit / push 対象は source file、設定、plan、docs、history、snapshot manifest などの管理対象に限る
- 生成物を誤って stage しないよう、stage は明示 path で行う

## 利用者準備ルール

- user action や外部準備は、独立した `USER_PREPARATION.md` ではなく各 project の `docs/process/UX_check_work_flow.md` に集約して管理する
- UX 文書では、共通文書ルール参照の直下に `利用者準備ノート` を置く
- `利用者準備ノート` には次の Notes 方針を使う
- この欄には、Codex だけでは代行できない user action や外部 device access だけを書く
- 実際に blocker が発生していない限り、推測の user task は書かない
- 外部準備がない場合は `なし` と明記する

## 参照構造

- workspace 全体の文書ルールはこの `DOCUMENTATION_RULE.md` を参照する
- project ごとの source-of-truth は各 project の `docs/index.md`
- project ごとの変更運用は各 project の `docs/process/change_protocol.md`
- project ごとの実行運用は各 project の `docs/process/research_operation.md`
- project ごとの UX 評価手順は各 project の `docs/process/UX_check_work_flow.md`

## 記述ルール

- 見出し、説明文、手順、判断基準、理由は日本語で書く
- 箇条書きは意味単位で短く保つ
- source-of-truth では原則や現行ルールを書く
- history では変更理由と結果だけを書く
- develop では plan、status、snapshot の対応関係を明確にする
- MVC、エラーハンドリング、再テスト方針のような全体運用ルールは、実装前に source-of-truth へ先に反映する

## 検証ルール

- Codex が実装または文書に基づく完了判定を行う場合、原則として Codex 自身の再テスト結果を伴う
- ただし、ユーザーが自分の検証結果を明示して完了根拠として示した場合は、そのユーザー検証を完了根拠として採用できる
- 上記のどちらを採用したかは、`current_state.md` または対応 history に明記する

## 更新順序

1. workspace 共通ルールの変更ならこの文書を更新する
2. 次に影響を受ける各 project の `docs/index.md` を更新する
3. 次に `docs/process/*.md` や `docs/observability/current_state.md` へ具体ルールを反映する
4. 最後に `docs/history/` と `develop/history/` を更新する

## project 境界

- `iSensorium/` の文書は `iSensorium/` 配下で完結させる
- `iDevelop/` の文書は `iDevelop/` 配下で完結させる
- `coreCamera/` の文書は `coreCamera/` 配下で完結させる
- workspace 共通ルールだけをこの root に置く

## 参照義務

- 各 project の文書ルール `.md` は、この `DOCUMENTATION_RULE.md` を参照する
- root の `AGENTS.md` は workspace 共通文書ルールの入口としてこのファイルを明記する
