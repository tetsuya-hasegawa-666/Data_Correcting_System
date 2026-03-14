# Market Release Line Plan

## Purpose

この文書は、`iDevelop` の設計構想を実装として段階的に成立させるための execution-oriented release line を定義する。

## Planning Rules

- 現 plan set は handoff 用ではなく、設計構想を実機能へ変換する順序を扱う。
- must scope の document/data を先に厚くし、optional scope は read-only 境界を維持した場合にだけ後続へ入れる。
- 各 line は MVC を崩さず、BDD ストーリーと TDD の赤テストから着手できる単位で区切る。

## Market Release Lines

| ID | Name | Delivered Value | Entrance Criteria | Exit Criteria | Linked Micro Releases | Change Drivers |
|---|---|---|---|---|---|---|
| MRL-1 | Document Authoring Line | 文書画面が search/preview だけでなく edit/save まで扱える | `document-workspace` の一覧・検索・プレビューが green である | edit/save の最小 UI、保存 contract、回帰テスト、`npm run dashboard` による手動 UI 確認、`UX_check_work_flow.md` 更新が成立する | mRL-1-1, mRL-1-2, mRL-1-3 | must scope 完成、source-of-truth 操作 |
| MRL-2 | Document Source Sync Line | seed document と実ファイルの同期方針が固定される | MRL-1 が成立している | 読み込み元、保存先、同期責務、衝突回避、`UX_check_work_flow.md` の保存手順更新が定義される | mRL-2-1, mRL-2-2, mRL-2-3 | 二重管理回避、永続化責務 |
| MRL-3 | Data Workflow Line | データ画面が browse から更新・結果確認まで進む | MRL-2 が成立している | data seed/update/result 表示の最小 workflow、回帰テスト、`npm run dashboard` による UI 操作確認、`UX_check_work_flow.md` 更新が成立する | mRL-3-1, mRL-3-2, mRL-3-3 | must scope 完成、結果整理 |
| MRL-4 | Shared-Core Hardening Line | document/data を支える共通契約が安定する | MRL-3 が成立している | navigation、state contract、error 表示、拡張登録境界、entry command の導線、`UX_check_work_flow.md` の画面遷移更新が固定される | mRL-4-1, mRL-4-2, mRL-4-3 | MVC 維持、OCP、保守性 |
| MRL-5 | Optional Read-Only Entry Line | code/debug optional scope を read-only で最小実装まで扱える | MRL-4 が成立している | code workspace の採否、read-only slice の実装、禁止操作、`UX_check_work_flow.md` の code tab 手順更新が成立する | mRL-5-1, mRL-5-2 | 安全性、スコープ制御 |
| MRL-6 | Integrated Readiness Line | 設計構想の主要ラインを次フェーズへ handoff できる | MRL-1 から MRL-5 の必要条件が揃っている | `test`、`build`、`dashboard` 起動、manual UI check、`UX_check_work_flow.md`、主要残課題、回帰観点、次の拡張優先順位が整理される | mRL-6-1, mRL-6-2, mRL-6-3 | 継続開発速度、判断漏れ防止 |

## Current Recommendation

- `MRL-1` から `MRL-5` までの最小実装は成立し、entry command も `npm run dashboard` に固定された。
- 現在の target は `MRL-6` であり、manual UI exploratory check の証跡を残して integrated readiness を閉じることにある。
- 次の新 plan set は、実ファイル同期とより深い save/persistence を扱う execution line とするのが妥当である。
- `UX_check_work_flow.md` は各 market line の成果物として扱い、実装と運用導線のずれを line 単位で解消する。
