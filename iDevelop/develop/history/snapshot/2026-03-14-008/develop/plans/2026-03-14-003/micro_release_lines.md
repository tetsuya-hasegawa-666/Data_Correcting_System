# Micro Release Line Plan

## Purpose

この文書は、`2026-03-14-003` の execution-oriented market release line を、実装開始に使える最小単位へ分解する。

## Definition Rule

- 各 Micro Release は 1 つの明確な振る舞いか契約だけを固定する。
- failing test を先に置けない粒度の項目は micro release にしない。
- must scope と optional scope を同一 micro release に混在させない。

## Micro Release Lines

| ID | Parent | Developer Experience | Verification Method | Expected Result | Failure Split | Next Decomposition Target |
|---|---|---|---|---|---|---|
| mRL-1-1 | MRL-1 | 文書を preview から編集状態へ切り替えられる | controller/view の failing test を作る | edit intent と edit form の表示条件が決まる | edit state ambiguity | edit behavior |
| mRL-1-2 | MRL-1 | 編集内容を保存要求として扱える | save action の failing test を作る | save request と validation の最小 contract が決まる | save contract gap | save flow |
| mRL-1-3 | MRL-1 | edit/save 追加後も既存検索が壊れず、UI で操作確認できる | 回帰 test、build、`npm run dashboard` による exploratory check を確認する | document-workspace の最小 authoring slice が成立する | search regression | source sync |
| mRL-2-1 | MRL-2 | 文書の読み込み元を seed か実ファイルかで迷わない | model contract を確認する | document source policy が決まる | dual source confusion | repository redesign |
| mRL-2-2 | MRL-2 | 保存先と同期責務を一意に説明できる | save flow と docs rule を照合する | write target と sync responsibility が固定される | conflicting writes | persistence contract |
| mRL-2-3 | MRL-2 | source-of-truth と seed の衝突条件を見落とさない | current state と protocol を確認する | conflict handling と rollback 観点が残る | stale overwrite | sync safeguards |
| mRL-3-1 | MRL-3 | dataset 一覧から更新操作へ進める | controller の failing test を作る | data update intent が決まる | write path unknown | update action |
| mRL-3-2 | MRL-3 | 結果データを一覧・要約できる | view/controller test を作る | result summary の最小表示が決まる | result contract gap | result view |
| mRL-3-3 | MRL-3 | data workflow 追加後も metric 表示が壊れず、UI で追える | 回帰 test、build、exploratory check を確認する | data-workspace の workflow slice が成立する | chart regression | shared state |
| mRL-4-1 | MRL-4 | document/data の navigation を共通化できる | shared-core の contract test を作る | workspace 切替 contract と entry 導線が決まる | routing drift | shell navigation |
| mRL-4-2 | MRL-4 | 失敗時の表示責務が共通化される | error state の view test を作る | error rendering の共通境界が決まる | hidden failure | error contract |
| mRL-4-3 | MRL-4 | 拡張登録点を壊さずに新機能を追加できる | registry or composition point を確認する | OCP を保つ shared-core が成立する | core mutation | optional gate |
| mRL-5-1 | MRL-5 | code workspace を read-only で入れるか判断できる | safety boundary と current value を確認する | optional scope の採否が一意に決まる | scope creep | code browse story |
| mRL-5-2 | MRL-5 | 採用する場合の最初の read-only story を 1 つに絞れる | BDD story を確認する | file browse または log preview のどちらかに限定される | mixed optional scope | optional slice |
| mRL-6-1 | MRL-6 | 次フェーズの first target を迷わず選べる | current recommendation を確認する | 継続順序が固定される | scattered backlog | handoff note |
| mRL-6-2 | MRL-6 | 維持すべき回帰観点と UI 操作確認観点を一覧できる | test/build/exploratory evidence を確認する | regression checklist が残る | hidden regression | verification pack |
| mRL-6-3 | MRL-6 | 残課題と defer 理由を短く引き継げる | current state と履歴を確認する | entry command を含む次フェーズ handoff が成立する | missing context | new plan set |

## Current Recommendation

1. 最初の target micro release は `mRL-1-1` とし、document edit intent の failing test から始める。
2. 次に `mRL-1-2` で save contract を固定し、`mRL-1-3` で回帰 green を確認する。
3. `MRL-2` 以降は、`MRL-1` で保存 contract の形が見えてから具体化を深める。
4. 各 line の最後に `npm run dashboard` を使った UI exploratory check を追加し、ユーザーが画面を触って理解できる状態を維持する。
