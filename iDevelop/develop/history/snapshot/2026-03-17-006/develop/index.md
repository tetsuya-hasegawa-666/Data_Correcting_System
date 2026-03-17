# Develop Index

このディレクトリでは、`docs/` で定義された dashboard 原則に従って、開発計画と履歴を管理する。
実装完了扱いは、原則として Codex 再テスト通過後に行う。ただし、ユーザーが検証済みであることを明示した場合は、その user validation を完了根拠として採用できる。

## Governance Principle

- 新しい feature 計画は release line に落として実装する。
- 変更後は、結果、証拠、関連差分を履歴として残す。
- plan set と release line の採番は、ユーザーが別指定しない限り連番を使う。
- plan、history、current state に書く ID、名称、状態名、成果物名、データ名は、明示変更がない限り既存表記を再利用する。

## Layout

| Layer | File | Purpose |
|---|---|---|
| PlanSet | `develop/plans/YYYY-MM-DD-XXX/` | その時点の release line 計画を 2 文書セットで置く |
| HistorySummary | `develop/history/summary/summary.md` | 開発計画変更の要約履歴 |
| HistorySnapshot | `develop/history/snapshot/README.md` | 開発計画変更時点のスナップショット |

## Rules

1. release line 計画は `develop/plans/YYYY-MM-DD-XXX/` に置く。
2. 1 つの plan set には `market_release_lines.md` と `micro_release_lines.md` を含める。
3. plan set の `YYYY-MM-DD-XXX` は develop 履歴 entry id と一致させる。
4. 計画変更時は `develop/history/summary/summary.md` にエントリを追加する。
5. 同じ変更時点の plan スナップショットを `develop/history/snapshot/YYYY-MM-DD-XXX/` に残す。
6. 開発計画文書は `docs/` の関連情報更新を伴わない。必要なら docs 側の変更を先に行う。
7. 実装開始前の plan set では、feature 単位ではなく readiness milestone を release line として構成してよい。
8. 連番採番と記載データ継続利用の規則は、新しい plan set 作成時にも維持する。
9. active な market release line がある場合、user block または 6 時間上限に達しない限り、同一 session で exit criteria 到達まで継続する。
10. viewer、explorer、download、consultation の各 line は MVC と詳細エラーハンドリングを明示した上で開始する。

## 2026-03-17 現在の plan set

- active dated plan set: `2026-03-17-006 archive explorer, retrieval UX, and resilient operator flow`
- latest completed plan set: `2026-03-15-005 Header And Action Box Stabilization Line`
- active market release target: `MRL-22 archive explorer foundation line`
- latest completed market release target: `MRL-21 Header And Action Box Stabilization Line`
- active micro release target: `mRL-22-1 session and export contract intake`
- latest completed micro release target: `mRL-21-3 close docs/history/verification for the stabilized UX`
