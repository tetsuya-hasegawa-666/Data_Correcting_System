# Current State

## Active Plan Set

- `2026-03-18-003 Excel Online Shadow Assistant prototype delivery`

## Active Market Release

- `なし`

## Active Micro Release

- `なし`

## Completed Evidence

- Excel Online 前提の Shadow Assistant prototype を local server + web UI + logic API として実装した
- Windows launcher と desktop shortcut 導線を追加した
- `python -m unittest discover -s tests` が成功
- `python -m iagents range ...` と `python -m iagents intent ...` の CLI 実行が成功
- local server の `GET /api/health` と `GET /` の smoke が成功
- launcher の server 起動と desktop shortcut 作成を確認した
- completion evidence: `Codex retest`

## Active Risks

- Excel Online との接続は手入力と手貼り付け前提で、自動 DOM 連携ではない
- OCR や本物の local LLM 接続は未実装
- Graph Shadow Editor は候補提示までで、Excel 側の自動編集はしない

## Pending Change Requests

- bookmarklet、extension、または Office Script 連携へ進めるかの判断

## Next Validation Point

- desktop shortcut からの実起動確認
- Excel Online 実画面で side-by-side manual UX check
- 名前ボックスからの range 転記負荷の確認
- 将来の自動連携方式の選定
