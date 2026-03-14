# Develop History Summary

## 2026-03-14-001 development-history-framework

- target_behavior: 実開発変更の履歴運用
- intended_change: 変更目的、背景理由、変更内容要約を必ず残す方式へ切り替える
- background_reason: 文書体系履歴だけでは、実際の開発判断と振る舞い変更の学習資産が不足する
- change_summary: 実開発専用の履歴レイヤと、変更した文書のみを保存するスナップショットレイヤを追加した
- affected_documents: `docs/index.md`, `docs/process/change_protocol.md`, `docs/process/research_operation.md`, `develop/history/summary/README.md`, `develop/history/snapshot/README.md`
- expected_effect: 今後の機能変更で、目的、背景、具体変更を短く比較できるようになる

## 2026-03-14-002 initial-release-line-plans

- target_behavior: 実開発計画の初期配置
- intended_change: docs で定義した意味体系に沿って Market Release Line と Micro Release Line の計画文書を develop 側に配置する
- background_reason: 規約と実開発計画を分離しつつ、次スレッドから具体的な実装計画へ接続できる状態が必要になった
- change_summary: develop の入口文書、履歴 README、release line 計画文書を追加し、docs/develop の責務境界に沿った初期計画面を作成した
- affected_documents: `develop/index.md`, `develop/history/summary/README.md`, `develop/history/snapshot/README.md`, `develop/plans/2026-03-14-002/market_release_lines.md`, `develop/plans/2026-03-14-002/micro_release_lines.md`
- expected_effect: 次の実装スレッドで、Market と Micro の両ラインを参照しながら実装順序と検証順序を決められる

## 2026-03-14-003 plan-set-and-summary-alignment

- target_behavior: release line 計画と develop 履歴の参照形式
- intended_change: release line 計画実体を `YYYY-MM-DD-XXX` plan set に揃え、develop 側要約履歴を単一 `summary.md` に集約する
- background_reason: 計画実体と履歴 id が一致していないと、snapshot と計画の対応を辿りにくい
- change_summary: plan 実体を dated folder に集約し、develop 履歴は `summary.md` 一括管理へ変更した
- affected_documents: `develop/index.md`, `develop/history/summary/README.md`, `develop/history/summary/summary.md`, `develop/history/snapshot/README.md`, `develop/history/snapshot/2026-03-14-001/manifest.md`, `develop/history/snapshot/2026-03-14-002/manifest.md`, `develop/plans/2026-03-14-002/market_release_lines.md`, `develop/plans/2026-03-14-002/micro_release_lines.md`
- expected_effect: develop 側で「履歴 id」「plan set」「snapshot」が同じ番号で対応し、管理しやすくなる

## 2026-03-14-004 idevelop-bootstrap-boundary

- target_behavior: sibling subproject 立ち上げ時の実開発境界管理
- intended_change: `iDevelop/` を `iSensorium` と sibling な companion project として分離し、初期 plan set とローカル運用入口を持つ構成へ切り替える
- background_reason: ダッシュボード開発を Xperia 側計画と分離すると、計画管理と履歴追跡の負荷が下がる
- change_summary: `iSensorium` 側に companion project 分離ルールと bootstrap 計画を追加し、`iDevelop/` 配下へ独立した `docs/` `develop/` `AGENTS.md` を配置した
- affected_documents: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: 今後のダッシュボード開発を `iSensorium` のルート計画から切り離し、companion project 内だけで継続できる

## 2026-03-14-005 idevelop-rename-alignment

- target_behavior: companion project の名称整合
- intended_change: bootstrap 計画内の `Codex_Dashborad/` 表現を `iDevelop/` へ揃える
- background_reason: project 名と実ディレクトリ名が一致しないと、境界計画と実配置の対応が追いにくい
- change_summary: `iSensorium` 側の bootstrap 計画、develop 入口、summary 表現を `iDevelop/` 基準へ更新した
- affected_documents: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-004/market_release_lines.md`, `develop/plans/2026-03-14-004/micro_release_lines.md`
- expected_effect: companion project 参照が一貫し、計画と実配置の整合が取りやすくなる

## 2026-03-14-006 release-line-validity-revision

- target_behavior: `iSensorium` の main release line 計画
- intended_change: 次セッションで実装開始しやすいよう、同期 spine を先に成立させる順序へ Market / Micro Release Line を再編する
- background_reason: 旧計画では `MRL-1` に同期基盤と全センサ統合が同時に載っており、初期実装ラインとして広すぎた
- change_summary: 新しい plan set `2026-03-14-006/` を追加し、`MRL-0` と `MRL-1` を初手向けに明確化し、GNSS/BLE/ARCore・後段再利用・屋外運用を後続 line へ分離した
- affected_documents: `develop/index.md`, `develop/history/summary/summary.md`, `develop/plans/2026-03-14-006/market_release_lines.md`, `develop/plans/2026-03-14-006/micro_release_lines.md`
- expected_effect: 新しい実装セッションで、最初の着手対象と後続拡張対象が明確になり、開始時の迷いが減る
