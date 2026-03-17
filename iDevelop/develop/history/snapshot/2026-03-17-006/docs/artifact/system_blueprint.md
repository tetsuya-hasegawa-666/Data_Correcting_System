# System Blueprint For Codex Dashboard

## Purpose

`iDevelop` の module 境界、project contract、live connection、安全境界に加えて、ユーザーと Codex の consultation workflow をどこに置くかを定義する。

## Module Structure

- `document-workspace`
  文書一覧、compact tree explorer、プレビュー、相談対象選択
- `data-workspace`
  データ一覧、session archive viewer、要約、相談対象選択
- `code-workspace`
  read-only の code / script browse と相談対象参照
- `conversation-workspace`
  ユーザー入力、選択 bundle、Codex 応答、根拠、承認 state、次 action
- `shared-core`
  workspace navigation、refresh、error 表示、entry shell、session coordination、download action coordination

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
  表示と入力、日本語ラベル、empty / warning / error / retry 状態の描画だけを持つ
- Controller:
  workspace ごとのユースケース制御、explorer selection、download orchestration、conversation orchestration を担う
- Model:
  repository、manifest、session/export contract、consultation contract、response contract、evidence log を担う

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

## Archive / Explorer Flow

- user は top directory ごとの compact tree から directory を開く
- `.md` を含む directory は compact に表示し、child markdown を選択できる
- data workspace は session archive と export metadata を一覧できる
- user は preview を見ながら download を 1 操作で実行できる
- download failure、source mismatch、missing file は個別 error state として扱う

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
- download は path boundary と source existence を確認してから実行する

## Current Design Focus

- session archive viewer
- top directory compact tree explorer
- one-click download
- detailed operator-facing error handling
