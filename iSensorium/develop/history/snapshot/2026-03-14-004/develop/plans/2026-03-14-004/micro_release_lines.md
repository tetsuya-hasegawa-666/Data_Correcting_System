# Micro Release Line Plan

## Purpose

この文書は、`Codex_Dashborad/` bootstrap を、ルート側で確認可能な最小単位へ分解する。

## Definition Rule

- 各 Micro Release は境界確認可能であること。
- 各 Micro Release はルート側から存在確認できること。
- 各 Micro Release はダッシュボード機能詳細ではなく、分離成立条件を扱うこと。

## Micro Release Lines

| ID | Parent | Developer Experience | Verification Method | Expected Result | Failure Split | Next Decomposition Target |
|---|---|---|---|---|---|---|
| mRL-0-1 | MRL-0 | ルート直下に `Codex_Dashborad/` が存在することを確認できる | ディレクトリ一覧を確認する | 専用サブディレクトリが見える | 作成漏れ / 命名誤り | local entry files |
| mRL-0-2 | MRL-0 | ダッシュボード関連作業をこの配下だけで行うルールを確認できる | ルート docs とローカル AGENTS を確認する | 境界ルールが明文化される | 規約未反映 / 二重定義 | local docs boundary |
| mRL-1-1 | MRL-1 | ローカル `docs/` を入口に仕様整理を始められる | `Codex_Dashborad/docs/index.md` を確認する | source-of-truth 入口が存在する | docs 未整備 | local artifact docs |
| mRL-1-2 | MRL-1 | ローカル `develop/` を入口に実開発計画を始められる | `Codex_Dashborad/develop/index.md` を確認する | 計画と履歴入口が存在する | develop 未整備 | local plan set |
| mRL-2-1 | MRL-2 | ダッシュボードの初期 release line を参照できる | ローカル plan set を確認する | 実装順序の骨格が読める | plan 不足 | feature design start |
| mRL-2-2 | MRL-2 | BDD/TDD と MVC を前提にした設計方針を確認できる | ローカル north star / blueprint を確認する | 次スレッドで設計詳細化できる | 方針欠落 | implementation breakdown |

## Current Recommendation

1. まず `mRL-0-1` と `mRL-0-2` で分離を成立させる。
2. 次に `mRL-1-1` と `mRL-1-2` でローカル入口を揃える。
3. その後 `mRL-2-1` と `mRL-2-2` を満たして、サブプロジェクト内部で実装計画を継続する。
