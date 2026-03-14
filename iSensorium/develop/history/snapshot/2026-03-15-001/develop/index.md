# Develop Index

このディレクトリは、`docs/` で固定された意味体系と運用規約に従って、`iSensorium` の実開発計画と開発履歴を管理する。

## Governance Principle

- 拡張的変更にオープン:
  新しい検証計画、実装順序、release line の分解を dated plan set として追加できる。
- 修正的変更にクローズ:
  進行中の意味を無言で差し替えず、履歴 entry と対応 snapshot を残して更新する。

## Layout

| Layer | File | Purpose |
|---|---|---|
| PlanSet | `develop/plans/YYYY-MM-DD-XXX/` | その時点の release line 計画実体を保持する |
| HistorySummary | `develop/history/summary/summary.md` | develop 側変更の単一要約履歴 |
| HistorySnapshot | `develop/history/snapshot/README.md` | 変更した文書だけを残す snapshot 規約 |

## Rules

1. release line 計画実体は `develop/plans/YYYY-MM-DD-XXX/` に置く。
2. 1 つの plan set には最低限 `market_release_lines.md` と `micro_release_lines.md` を含める。
3. plan set の `YYYY-MM-DD-XXX` は、対応する develop 履歴 entry id と一致させる。
4. develop の計画文書は `docs/artifact/story_release_map.md` の意味体系に従う。
5. 実開発変更時は `develop/history/summary/summary.md` にエントリを追加する。
6. 同じ変更時点の「変更した文書のみ」を `develop/history/snapshot/YYYY-MM-DD-XXX/` に保存する。
7. 計画文書は docs の意味体系を重複定義しない。具体の実装順序だけを担う。
8. `coreCamera/` や `iDevelop/` の feature 計画、変更履歴、実装検証は、それぞれの project 配下だけで管理する。

## Continuation Rules

- 15 分前後の manual check や短時間 harness は停止条件ではなく、evidence 採取の最小単位として扱う。
- active な dated plan set がある限り、Codex は active micro release の出口条件に到達するまで継続する。
- 1 回の自律継続作業は最大 6 時間まで継続してよい。
- 停止してよい条件は、実 blocker、外部依存、active plan set 完了かつ次 plan set 未定義のいずれかに限定する。
- 歴史的に完了済みの plan set は baseline であり、現在の会話停止条件ではない。

## Validated Baseline Plan Set

- baseline: `develop/plans/2026-03-14-006/`
- status: validated historical baseline
- interpretation: `2026-03-14-006` は「完了済みで止まってよい」という意味ではなく、次の dated plan set を切るときの基準線として扱う。
- next-session rule: 新しい実装セッションでは、まず `docs/observability/current_state.md` を確認し、必要なら `2026-03-14-006` を起点に新しい dated plan set を切る。

## 2026-03-14 Freeze Note

- `CameraX + ARCore` mainline is frozen after reproducible camera-path stalls were verified under `ARCore ON`.
- isolated replacement-camera work is moved to sibling project `coreCamera/`.
- `iSensorium/` implementation should not start `Camera2 + Shared Camera` work directly in the next session.
