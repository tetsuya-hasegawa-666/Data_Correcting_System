# Docs History Summary

## 2026-03-14-001 agentized-doc-system

- scope: documentation system
- trigger: 初期文書体系の構築と agent 規約化要求
- resulting_direction: 文書体系を単なるメモ置き場ではなく、source-of-truth と agent 運用規約を兼ねる基盤へ寄せた。
- expected_benefit: 将来の文書変更が運用規約と直結し、別開発でも有効だった構造を比較しやすくなる。

## 2026-03-14-002 paired-history-snapshot

- scope: documentation system
- trigger: 文書体系変更の価値検証と効果検証のため、全体スナップショット併用が必要になった
- resulting_direction: 文書体系の変更管理を、短い方向要約だけでなく検証可能な全体保存と対で扱う運用へ寄せた。
- expected_benefit: どの方向の変更が有効だったかと、その時点の全体状態をセットで比較できる。

## 2026-03-14-003 open-extension-closed-correction

- scope: documentation system
- trigger: 文書体系履歴と実開発履歴の意味を分離し、規約全体を拡張にオープン・修正にクローズへ寄せる必要が生じた
- resulting_direction: 追加や拡張は既存レイヤへ取り込める一方で、既存意味の修正は履歴とスナップショットを必須とする構造へ寄せた。
- expected_benefit: 追加要求を柔軟に受けつつ、意味の上書きや履歴の曖昧化を防げる。

## 2026-03-14-004 history-tree-simplification

- scope: documentation system
- trigger: 履歴フォルダ構成が煩雑になり、文書体系履歴と実開発履歴の見通しが悪くなった
- resulting_direction: 履歴管理を `docs/history/docs/{summary,snapshot}` と `develop/history/{summary,snapshot}` に単純化する方向へ寄せた。
- expected_benefit: 履歴の探索コストが下がり、追加も同じ型で増やしやすくなる。

## 2026-03-14-005 docs-develop-boundary

- scope: documentation system
- trigger: docs 内外の文書とデータで履歴のすみわけを明確にする必要が生じた
- resulting_direction: `docs/` を source-of-truth 専用、`develop/` を実開発専用として分離した。
- expected_benefit: 何を規約として守るかと、何を開発対象として進めるかが分離され、管理と参照が容易になる。

## 2026-03-14-006 summary-consolidation

- scope: documentation system
- trigger: 履歴参照を見やすくし、summary を単一文書へ集約したい要求が入った
- resulting_direction: docs 側履歴の要約管理を個別ファイル分割から `summary.md` 一括管理へ寄せ、manifest は summary 文書と entry id で結びつける形式へ変えた。
- expected_benefit: 履歴の閲覧性が上がり、連番と snapshot の対応関係を追いやすくなる。

## 2026-03-14-007 isolated-dashboard-boundary

- scope: documentation system
- trigger: Codex 向けダッシュボードを sibling subproject として分離して扱う要求が入った
- resulting_direction: ルート規約には分離境界だけを残し、ダッシュボード固有の仕様、計画、実装、履歴は companion project 側で閉じる運用へ寄せた。
- expected_benefit: `iSensorium` の source-of-truth を壊さずに、ダッシュボード project を独立して設計・実装できる。

## 2026-03-14-008 idevelop-project-placement

- scope: documentation system
- trigger: メインプロジェクト名を `iSensorium`、ダッシュボード project 名を `iDevelop` として sibling 配置へ揃える要求が入った
- resulting_direction: source-of-truth と境界ルールを `iSensorium/` 配下へ移し、companion project 側は `iDevelop/` へ正規名で配置する構造へ寄せた。
- expected_benefit: project 単位の見通しが上がり、`iSensorium` と `iDevelop` の連携整合を保ちやすくなる。

## 2026-03-14-009 implementation-baseline-and-device-proof

- scope: documentation system
- trigger: `iSensorium` で文書専用段階を抜け、Android recording spine の実装と Xperia 5 III 実機証跡が得られた
- resulting_direction: source-of-truth を「文書体系設計」中心から「実装と実機検証の現在地を反映する運用」へ寄せ、`MRL-0 -> MRL-1` 到達を観測可能にした。
- expected_benefit: 次の作業者が plan set とコードと実機結果の対応を失わず、`mRL-2-1` 以降へそのまま進める。
