# System Blueprint For Codex Dashboard

## Purpose

この文書は、`iDevelop` の責務境界、module 構成、project contract、実体接続方針を定義する。

## Module Structure

- `document-workspace`
  文書一覧、検索、プレビュー、編集、保存
- `data-workspace`
  データ一覧、集計、更新結果表示
- `code-workspace`
  read-only の code / script 参照
- `shared-core`
  workspace navigation、共通 error 表示、entry shell

## MVC Boundary

- View:
  表示と入力導線だけを持つ
- Controller:
  workspace ごとのユースケース制御を持つ
- Model:
  repository、manifest、data contract、集計ロジックを持つ

## Project Contract Entry

- source-of-truth は [project_contract.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\artifact\project_contract.md) とする
- live connection は project manifest を起点に document / data / code roots を解決する
- manifest field 名は `projectId` `projectRoot` `documentRoots` `dataRoots` `codeRoots` `ignoreGlobs` `readOnly` で固定する

## Recursive Read Rule

- document / data / code は、それぞれ root 配下を再帰的に走査する
- 子、孫、それ以降の directory 深さも同一規則で扱う
- 項目数の増減を前提にし、固定件数を仮定しない
- missing root は停止条件ではなく、欠損として扱う
- ignore glob に一致する path は除外する

## Read Strategy

- phase 1: seed data + browser storage
- phase 2: filesystem read-only connection
- phase 3: refresh / stale tracking
- phase 4: pilot operation evidence

## Safety Boundary

- 最初の実体接続は read-only とする
- projectRoot 外の path へ出ない
- code workspace は read-only を維持し、実行や attach を許可しない

## MRL-5 BDD Story

- story summary:
  Codex と人間は、他 project に `iDevelop` を持ち込む前に、同じ manifest と recursive read rule を共有し、path 差異があっても同じ言葉で setup できる。

## MRL-1 Acceptance Criteria

| id | condition | expected result |
|---|---|---|
| `GEN-B1` | project manifest を確認する | required field と meaning が固定されている |
| `GEN-B2` | recursive read rule を確認する | 子孫 directory と missing root の扱いが定義されている |
| `GEN-B3` | generic setup 手順を確認する | 他 project にコピーしたときの最初の導入手順が成立する |

## MRL-1 TDD/Verification Notes

- `mRL-5-1`
  contract doc review で manifest schema を固定する
- `mRL-5-2`
  BDD/TDD review で recursive read rule を固定する
- `mRL-5-3`
  `UX_check_work_flow.md` を generic setup へ更新して exit する

## Current Implementation Status

- dummy dashboard の UX は成立済み
- 次の実装対象は filesystem repository と refresh policy
- current target は `2026-03-14-004 / MRL-6 / mRL-6-1` へ進む前提で contract を固定済みとする
