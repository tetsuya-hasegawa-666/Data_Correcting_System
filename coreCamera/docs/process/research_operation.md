# Research Operation

> 共通文書ルール参照: `C:/Users/tetsuya/playground/Data_Correcting_System/DOCUMENTATION_RULE.md`

## First Re-entry Files

1. `coreCamera/docs/index.md`
2. `coreCamera/docs/observability/current_state.md`
3. `coreCamera/USER_PREPARATION.md`
4. `coreCamera/SESSION_HANDOVER.md`
5. `coreCamera/develop/index.md`
6. `coreCamera/develop/plans/2026-03-14-001/market_release_lines.md`
7. `coreCamera/develop/plans/2026-03-14-001/micro_release_lines.md`

## Scope Rule

後の integration が明示的に始まるまで、replacement stack の開発は `coreCamera/` 内だけで行う。

## First Implementation Objective

- `iSensorium` の code を変えずに start/stop できる、最小の `Camera2 + Shared Camera` skeleton を作る
- 後で workflow redesign ではなく code replacement で swap-in できるよう、現在の outer recording contract を維持する

## Validation Standard

- 凍結済み `iSensorium` evidence と比較して `ARCore OFF` / `ARCore ON` の continuity を評価する
- 現在の in/out contract を維持する
- docs/develop/history は `iSensorium` と同じ discipline で更新する
- 後の experience-based testing に向けて、user-facing evaluation route を十分に単純に保つ
- `.md` の narrative と operational note は、意味的に別言語が必要でない限り日本語で保つ

## Continuation Window Rule

- active な market release line がある場合、同一 session 内ではその exit criteria を満たすまで micro release を順送りで進める
- 1 つの micro release が完了しても、同じ market release line 内の次 micro release へ自動で進んでよい
- 15 分前後で任意停止する運用は取らない
- 停止条件は次に限定する
  - user 操作、追加データ、明示承認が必要で進められない
  - active な market release line の exit criteria を満たした
  - 継続時間が 6 時間上限に到達した
