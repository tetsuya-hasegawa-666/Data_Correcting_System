# 文書ルール

このファイルは `Data_Correcting_System` ワークスペース全体の文書ルールの唯一の基準である。  
各 project の `docs/` と `develop/` は、この文書を参照しつつ project 固有ルールだけを追加する。

## 基本方針

- `.md` は原則として日本語で記述する
- UI 文言、ログ、エラー文言、説明ラベル、技術メモは必要に応じて原語を併記してよい
- file path、API 名、class 名、package 名、command、config key などは原文のまま書く
- 新しいルールや運用変更は chat だけで閉じず、該当する source-of-truth に反映する
- project 間で境界が変わる場合を除き、変更は対象 project 内だけに閉じる

## Commit / Push ルール

- `app/build/`、`.gradle/`、`tmp/`、generated file、cache、device dump、screen capture などの生成物は commit / push しない
- commit / push 対象は source file、設計、plan、docs、history、snapshot manifest などの追跡対象に限る
- stage は対象 path を明示して行う

## 利用者準備ルール

- user action や外部準備は、独立した `USER_PREPARATION.md` を増やさず、各 project の `docs/process/UX_check_work_flow.md` に集約する
- UX 文書では、確認手順の上位に `利用者準備ノート` を置く
- そこには Notes 方式で次を明記する
- Codex だけでは代行できない user action
- 外部 account や device access が必要な項目
- blocker にならない限り中断理由にしないこと
- 準備がない場合の `できないこと` と `できること`

## source-of-truth ルール

- workspace 全体の共通ルールはこの `DOCUMENTATION_RULE.md` を基準にする
- project ごとの source-of-truth は各 project の `docs/index.md`
- project ごとの変更手順は各 project の `docs/process/change_protocol.md`
- project ごとの調査運用は各 project の `docs/process/research_operation.md`
- project ごとの UX 確認手順は各 project の `docs/process/UX_check_work_flow.md`

## 記述ルール

- 断定したこと、決まったこと、確認済みのことは source-of-truth に残す
- history には変更経緯と証跡を残す
- develop には plan、status、snapshot の対応関係を残す
- prototype や中間 milestone を書く場合でも、最終目標と誤認させない

## Codex とユーザーの運用取り決め

- 高優先度:
  active plan set に未完了の MRL が残っている場合、Codex は実 blocker や外部依存が発生しない限り、その終端まで継続する前提で文書と報告を書く。
- 高優先度:
  `current_state.md`、`develop/index.md`、release line 文書には、`ここで止まってよい` と読める記述を残さず、`次に進むべき active MRL / mRL` を必ず明示する。
- 高優先度:
  prototype、temporary scope、companion scope などの中間到達点を記録する場合でも、それを最終目標の完了と誤認させない表現にする。
- 高優先度:
  Codex が `ブロッカーなし` と判断した場合、完了報告ではなく継続作業か active MRL の完了状態を示す報告に切り替える。

## 読懆ｨｼルール

- Codex が変更した文書に基づいて新しい実行や確認が必要になる場合、その文書に沿った最小確認を提示する
- ユーザーが確認できない項目は、できる範囲の検証と、何が未確認かを分けて記録する
- 明示依頼がなければ、確認結果は `current_state.md` または対応する history に反映する

## 更新順序

1. workspace 共通ルールが変わるならこの文書を更新する
2. 次に影響を受ける各 project の `docs/index.md` を更新する
3. 次に `docs/process/*.md` と `docs/observability/current_state.md` へ具体ルールを反映する
4. 最後に `docs/history/` と `develop/history/` を更新する

## project 境界

- `iSensorium/` の文書は `iSensorium/` 内で完結させる
- `iDevelop/` の文書は `iDevelop/` 内で完結させる
- `coreCamera/` の文書は `coreCamera/` 内で完結させる
- `iAgents/` の文書は `iAgents/` 内で完結させる
- workspace 共通ルールだけを root に置く
