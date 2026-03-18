# develop 履歴概要

## 2026-03-17-002 connectivity line activation

- `MRL-0 foundation line` を completed に更新した
- `MRL-1 connectivity line` を in_progress とし、`mRL-1-1` から `mRL-1-4` を追加した
- host stack を mDNS + MAC whitelist + Syncthing Docker + Ollama / LocalAI 前提へ整理した

## 2026-03-17-003 full line expansion and UX target fixation

- 現行ターゲットを Xperia 5 III と `Tezy-GT37` に固定した
- `MRL-1` から `MRL-6` までの全体 line を定義した
- Android UX と PC UX を含む end-to-end 計画へ拡張した

## 2026-03-17-004 connectivity skeleton implementation

- `docker-compose.yml` を追加し、Syncthing / Ollama / observer の host stack 骨格を作成した
- `src/host/observer.py` で inbox -> records -> llm_inbox の最小反映を実装した
- `scripts/start_host_stack.ps1` と runtime directories を追加した

## 2026-03-17-005 tailscale option and line shift

- `tailscale_profile.yaml`、`host_endpoint.py`、`show_host_endpoint.ps1` を追加した
- `MRL-1` を completed とし、`MRL-2` を active に進めた

## 2026-03-17-006 edge UX skeleton implementation

- `mobile_quick_capture.yaml`、`multimodal_attachment_flow.yaml`、mobile preview を追加した
- `MRL-2` を completed とし、`MRL-3` を active に進めた

## 2026-03-17-007 PC review preview implementation

- `build_status_snapshot.py`、`build_review_snapshot.py`、PC preview を追加した
- `MRL-3` の inbox / ops / context の最小表示を実装した

## 2026-03-17-001 manager context collection foundation start

- `iClone/` を独立 project として初期化した
- `MRL-0` から `MRL-4` を起票した
- seed data と snapshot 運用を開始した
