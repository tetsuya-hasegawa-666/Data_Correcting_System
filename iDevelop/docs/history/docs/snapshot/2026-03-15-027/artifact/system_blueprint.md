# System Blueprint For Codex Dashboard

## Purpose

`iDevelop` の module 境界、project contract、live connection、安全境界に加えて、ユーザーと Codex の consultation workflow をどこに置くかを定義する。

## Module Structure

- `document-workspace`
  文書一覧、検索、プレビュー、相談対象選択
- `data-workspace`
  データ一覧、要約、相談対象選択
- `code-workspace`
  read-only の code / script browse と相談対象参照
- `conversation-workspace`
  ユーザー入力、選択 bundle、Codex 応答、根拠、承認 state、次 action
- `shared-core`
  workspace navigation、refresh、error 表示、entry shell、session coordination

## Interaction Contract Boundary

- `shared-core/model/ConsultationSession`
  workspace 横断の consultation story、bundle、response contract、approval state を保持する
- `document-workspace`
  選択中文書を `document` bundle item として shared-core へ渡す
- `data-workspace`
  選択中 dataset を `dataset` bundle item として shared-core へ渡す
- `code-workspace`
  read-only target を `code` bundle item として shared-core へ渡し、phase gate を超えない

## MVC Boundary

- View:
  表示と入力の責務だけを持つ
- Controller:
  workspace ごとのユースケース制御と conversation orchestration を担う
- Model:
  repository、manifest、consultation contract、response contract、evidence log を担う

## Project Contract Entry

- source-of-truth は [project_contract.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\artifact\project_contract.md) とする
- live connection は project manifest で document / data / code roots を解決する
- manifest field は `projectId` `projectRoot` `documentRoots` `dataRoots` `codeRoots` `ignoreGlobs` `readOnly` を固定する

## Recursive Read Rule

- document / data / code は、それぞれの root 配下を再帰的に読む
- child / grandchild / deeper directory も同一ルールで読む
- root 外 path は拒否する
- missing root は warning として扱い、致命失敗にはしない
- ignore glob に一致する path は除外する

## Read Strategy

- phase 1: seed data + browser storage
- phase 2: filesystem read-only connection
- phase 3: refresh / stale tracking
- phase 4: pilot operation evidence
- phase 5: consultation contract
- phase 6: user-approved apply

## Consultation Flow

- user は document / data / code から consultation bundle を選ぶ
- user は prompt と観点を入力する
- Codex は bundle と prompt をもとに summary / risk / proposal / next action を返す
- 応答には対象、根拠、提案種別、承認状態を持たせる
- user は keep / discard / convert-to-task / apply-request を選ぶ

## State Boundary

- bundle state:
  workspace が source selection を持ち、shared-core が contract へ正規化する
- response state:
  `summary` `evidence` `next_action` の 3 要素を最小 schema とする
- approval state:
  `consultation-only` と `phase-gated-read-only` を phase 5 の既定値とする
- transition boundary:
  keep / discard / task / apply-request は `MRL-15` 以降で解放する

## Safety Boundary

- live connection は read-only first とする
- projectRoot 外の path には出ない
- code workspace は read-only を維持し、実行や attach を許可しない
- apply は approval state が定義されるまで導入しない

## Current Implementation Status

- phase 1: completed
- phase 2: completed
- phase 3: completed
- phase 4: completed
- phase 5: in progress
- phase 6: planned
- current target: `2026-03-15-005 / MRL-11 / mRL-11-1`

## Next Design Focus

- document bundle selection の failing test を作る
- document consultation input / response panel を実装する
- shared conversation shell に合流しやすい state shape を維持する
