# Pilot Runbook

## Purpose

`iDevelop` の本番仮運用を短時間で再現するための runbook。

## Run Steps

1. [pilot_setup_checklist.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\process\pilot_setup_checklist.md) を上から順に確認する
2. `npm run dashboard` を起動する
3. `文書` tab で live document list と read-only 案内を確認する
4. `データ` tab で live dataset summary と read-only 案内を確認する
5. `コード` tab で live code/script target を確認する
6. `再読み込み` を押し、status strip と refresh evidence の更新を確認する
7. evidence を [pilot_evidence_log.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\observability\pilot_evidence_log.md) に追記する
8. 問題があれば [rollback_note.md](C:\Users\tetsuya\playground\Data_Correcting_System\iDevelop\docs\process\rollback_note.md) に従う

## Minimum Success Signal

- document/data/code の 3 workspace が見える
- stale / refreshed / fresh が判別できる
- refresh evidence が 1 件以上残る
- read-only boundary が崩れない
