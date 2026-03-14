# Session Handover

## Decision

- 現在の `iSensorium` camera mainline は凍結する
- `CameraX + ARCore` への patch 継続を主経路にしない
- `coreCamera/` での replacement 作業は開始済み
- release line、docs history、UX check の運用粒度は `iSensorium` と同等に保つ
- `shared-camera-session-adapter` を現時点で唯一の swap seam として維持する
- 上流実装の変更前に、isolated adapter 内で `MRL-5` を完了させる

## Verified Facts To Carry Forward

- `ARCore OFF` の baseline session: `session-20260314-194350`
- `ARCore ON` の比較 session: `session-20260314-194438`
- `ARCore OFF` の camera timestamp 最大 gap: `139.6 ms`
- `ARCore ON` の camera timestamp 最大 gap: `2634 ms`
- `IMU` は両 run で安定しており、最大 gap は約 `30-47 ms`
- isolated shared-camera 実装は、実際の `video.mp4`、`video_frame_timestamps.csv`、`arcore_pose.jsonl` を出力する
- isolated `session_manifest.json` は、凍結済み file-name contract を変えずに、実際の出力状態を報告する
- isolated `session_manifest.json` は、凍結 baseline との continuity 比較、timestamp contract 検証、`swapReadiness` または blocker を記録する
- isolated `session_manifest.json` は、保持すべき operation binding と cutover gate を固定する `integrationAdapterPlan` metadata を記録する
- isolated `session_manifest.json` は、target-device evidence に基づく `integrationRecommendation` を記録する

## Constraint

- 現在の `iSensorium` session in/out contract を維持する
- release line と documentation discipline を変えない
- replacement readiness が証明されるまで、`iSensorium/` 内の実装変更を避ける
- active な market release line がある間は、15 分前後で任意停止せず、user block または 6 時間上限に達するまで継続する

## Open Issues

- replacement seam は、downstream parser や validation flow を再設計せずに swap できるだけの明確さが必要
- `MRL-5` は Xperia 5 III 実機 session `session-20260315-043204` により完了し、`RECOMMEND_GUARDED_UPSTREAM_TRIAL` を返している

## Risks And Assumptions

- `Shared Camera` で continuity defect を除去できない場合、fallback は `ARCore` を落とす方針のまま
- isolated 開発が partial implementation を `iSensorium` へ漏らしてはならない
- 現在の `arcore_pose.jsonl` 取得は offscreen GL sampling path で十分だと仮定している。guarded upstream trial 前後で再度観測すること
- ここでの `MRL-5` 完了は、guarded upstream trial を推奨できるという意味であり、integration を即時開始すべきという意味ではない

## Next Session Start Order

1. `coreCamera/docs/index.md` を読む
2. `coreCamera/docs/observability/current_state.md` を読む
3. `coreCamera/USER_PREPARATION.md` を読む
4. `coreCamera/docs/artifact/project_contract.md` を読む
5. `coreCamera/develop/index.md` を読む
6. `coreCamera/develop/plans/2026-03-14-001/` を `MRL-5` 状態から継続する
