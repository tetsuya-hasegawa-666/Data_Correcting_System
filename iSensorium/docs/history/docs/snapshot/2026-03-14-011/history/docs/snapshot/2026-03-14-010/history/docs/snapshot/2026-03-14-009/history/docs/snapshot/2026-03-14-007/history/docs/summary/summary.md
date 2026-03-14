# Docs History Summary

## 2026-03-14-001 agentized-doc-system

- scope: documentation system
- trigger: 初期文書体系の構築と agent 規約化要求
- resulting_direction: 文書体系を単なるメモ置き場ではなく、source-of-truth と agent 運用規約を兼ねる基盤へ寄せた。加えて、個別差分ではなく全体方向の変化を蓄積する履歴レイヤを追加し、他開発へ再利用しやすい知見化を強めた。
- expected_benefit: 将来の文書変更が運用規約と直結し、別開発でもどういう方向の文書体系が有効だったかを比較しやすくなる。

## 2026-03-14-002 paired-history-snapshot

- scope: documentation system
- trigger: 文書体系変更の価値検証と効果検証のため、全体スナップショット併用が必要になった
- resulting_direction: 文書体系の変更管理を、短い方向要約だけでなく検証可能な全体保存と対で扱う運用へ寄せた。これにより、意図の追跡と状態再現の両方を優先する文書運用になった。
- expected_benefit: 後からどの方向の変更が有効だったかと、その時点で全体がどう組まれていたかをセットで比較できる。

## 2026-03-14-003 open-extension-closed-correction

- scope: documentation system
- trigger: 文書体系履歴と実開発履歴の意味を分離し、規約全体を拡張にオープン・修正にクローズへ寄せる必要が生じた
- resulting_direction: 文書体系の規約を、追加や拡張は既存レイヤへ取り込める一方で、既存意味の修正は履歴とスナップショットを必須とする構造へ寄せた。さらに、文書全体履歴と実開発履歴を分離し、各履歴の対象粒度を明確にした。
- expected_benefit: 文書体系の進化と開発変更の追跡が混線せず、追加要求を柔軟に受けつつ、意味の上書きや履歴の曖昧化を防げる。

## 2026-03-14-004 history-tree-simplification

- scope: documentation system
- trigger: 履歴フォルダ構成が煩雑になり、文書体系履歴と実開発履歴の見通しが悪くなった
- resulting_direction: 履歴管理を `docs/history/docs/{summary,snapshot}` と `docs/history/develop/{summary,snapshot}` の 2 系統 4 レイヤへ単純化した。これにより、履歴の意味分類を保ったまま、保存先の探索コストを下げる構造へ寄せた。
- expected_benefit: 文書体系履歴と実開発履歴を迷わず辿れ、今後の追加も同じ型で増やしやすくなる。

## 2026-03-14-005 docs-develop-boundary

- scope: documentation system
- trigger: docs 内外の文書とデータで履歴のすみわけを明確にする必要が生じた
- resulting_direction: `docs/` を source-of-truth 専用、`develop/` を実開発専用として分離し、履歴もそれぞれの管理面へ寄せた。これにより、規約の変更と実開発の進行が同じ場所で混線しない構造へ寄った。
- expected_benefit: 何を規約として守るかと、何を開発対象として進めるかが分離され、管理と参照が容易になる。

## 2026-03-14-006 summary-consolidation

- scope: documentation system
- trigger: 履歴参照を見やすくし、summary を単一文書へ集約したい要求が入った
- resulting_direction: docs 側履歴の要約管理を個別ファイル分割から `summary.md` 一括管理へ寄せた。合わせて、manifest は個別ファイル参照ではなく summary 文書と entry id で結びつける形式へ変えた。
- expected_benefit: 履歴の閲覧性が上がり、連番と snapshot の対応関係を追いやすくなる。

## 2026-03-14-007 isolated-codex-dashboard-boundary

- scope: documentation system
- trigger: Codex 向けダッシュボードをメインプロジェクトと完全分離した sibling subproject として立ち上げる要求が入った
- resulting_direction: ルート規約には分離境界だけを残し、ダッシュボード固有の仕様、計画、実装、履歴は `Codex_Dashborad/` 配下で閉じる運用へ寄せた。
- expected_benefit: メインプロジェクトの source-of-truth を汚さずに、Codex 開発支援ダッシュボードを独立して設計・拡張できる。
