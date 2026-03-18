# develop 履歴概要

## 2026-03-18-010 app shell and launcher completion

- `mRL-2-5 Android app shell` を completed で追加した
- `mRL-3-4 PC app launcher` を completed で追加した
- release line の delivered value を app shell / launcher を含む形へ更新した

## 2026-03-18-009 MRL-3 to MRL-6 completion

- `MRL-3` から `MRL-6` を completed に更新した
- `mRL-3-2`、`mRL-4-1..3`、`mRL-5-1..3`、`mRL-6-1..3` を completed に更新した
- host-side closed loop、retry、hardening、extension boundary の実装を計画へ反映した

## 2026-03-18-008 edge autosave and local browse completion

- `MRL-2 edge capture UX line` の delivered value に auto-save と端末内一覧 / 履歴 UX を追加した
- `mRL-2-4 local autosave and browse contract` を completed で追加した
- 現行の mobile UX 骨格を、実装対象に近い preview 契約として拡張した

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
## 2026-03-18-011 end-user workspace and adb bridge completion

- `MRL-3` を PC end-user workspace line として更新した
- `MRL-5` を adb closed loop line として更新し、device local files から host records までの current route を計画へ反映した
- `MRL-6` に one-click launcher、runtime file serving、operational docs sync を閉じた
## 2026-03-18-012 unified release lines file

- MRL と mRL の正本を `develop/plans/2026-03-17-001/release_lines.md` に統合した
- `develop/index.md` の参照先を単一ファイルへ変更した
- 分割されていた `market_release_lines.md` と `micro_release_lines.md` を現行正本から外した
