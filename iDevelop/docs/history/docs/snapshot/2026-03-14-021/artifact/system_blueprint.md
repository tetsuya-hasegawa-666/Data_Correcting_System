# System Blueprint For Codex Dashboard

## Purpose

この文書は、`iDevelop` の責務境界、module 構造、project contract、live 接続戦略を固定する。

## Module Structure

- `document-workspace`
  文書一覧、検索、プレビュー、編集
- `data-workspace`
  データ一覧、集計、更新結果表示
- `code-workspace`
  read-only の code / script browse
- `shared-core`
  workspace navigation、refresh、error 表示、entry shell

## MVC Boundary

- View:
  表示と入力受付だけを担う
- Controller:
  workspace ごとのユースケース制御を担う
- Model:
  repository、manifest、data contract、evidence log を担う

## Project Contract Entry

- source-of-truth は [project_contract.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\artifact\project_contract.md) とする
- live connection は project manifest を起点に document / data / code roots を解決する
- manifest field は `projectId` `projectRoot` `documentRoots` `dataRoots` `codeRoots` `ignoreGlobs` `readOnly` で固定する

## Recursive Read Rule

- document / data / code は、それぞれの root 配下を再帰読込する
- 子、孫、その先の directory も同一規則で扱う
- root 外の path は拒否する
- missing root は warning として扱い、致命失敗にはしない
- ignore glob に一致する path は除外する

## Read Strategy

- phase 1: seed data + browser storage
- phase 2: filesystem read-only connection
- phase 3: refresh / stale tracking
- phase 4: pilot operation evidence

## Safety Boundary

- 最初の live connection は read-only とする
- projectRoot 外の path へ出ない
- code workspace は read-only を維持し、実行や attach を許可しない

## Current Implementation Status

- phase 1: 完了
- phase 2: 完了
- phase 3: 完了
- phase 4: 未着手
- current target: `2026-03-14-004 / MRL-9 / mRL-9-1`

## Next Design Focus

- pilot setup checklist を整える
- rollback note と evidence export を定義する
- 本番仮運用 dry run の導線を閉じる
