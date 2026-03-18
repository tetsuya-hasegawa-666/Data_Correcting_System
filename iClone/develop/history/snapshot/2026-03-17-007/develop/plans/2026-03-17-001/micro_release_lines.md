# 2026-03-17-001 micro release lines

## MRL-0

### mRL-0-1 directory and entry docs setup

- parent: `MRL-0`
- status: `completed`
- result: `docs/` `develop/` `data/` `scripts/` を初期化した

### mRL-0-2 architecture and schema baseline

- parent: `MRL-0`
- status: `completed`
- result: architecture、sequence、UX flow、YAML schema を定義した

### mRL-0-3 docs, seed, and snapshot close

- parent: `MRL-0`
- status: `completed`
- result: seed data と snapshot を揃え、基礎ラインを閉じた

### mRL-0-4 local sync hub architecture anchor

- parent: `MRL-0`
- status: `completed`
- result: Windows 11 + WSL2/Docker または Ubuntu を host、Android を edge とする主体アーキテクチャを固定した

## MRL-1

### mRL-1-1 zero-config discovery contract

- parent: `MRL-1`
- status: `completed`
- result: mDNS による `pc-name.local` discovery と MAC whitelist の契約を定義する

### mRL-1-2 syncthing docker folder contract

- parent: `MRL-1`
- status: `completed`
- result: `docker-compose.yml` と runtime layout により edge-outbox / host-inbox / curated records のフォルダ契約を固定した

### mRL-1-3 tailscale optional extension

- parent: `MRL-1`
- status: `completed`
- result: `tailscale_profile.yaml` と `host_endpoint.py` により、同一 Wi-Fi 外でのオプション導線を定義した

### mRL-1-4 host mount and watcher baseline

- parent: `MRL-1`
- status: `completed`
- result: `start_host_stack.ps1`、`observer.py`、runtime directories により host mount、watcher、llm inbox の最小構成を追加した

### mRL-1-5 current host and device config anchor

- parent: `MRL-1`
- status: `completed`
- result: Xperia 5 III と `Tezy-GT37` を現行ターゲットとして config と UX 評価前提を固定する

## MRL-2

### mRL-2-1 one-question mobile screen contract

- parent: `MRL-2`
- status: `completed`
- result: `mobile_quick_capture.yaml` と mobile preview により、一問一葉の表示、回答、保存導線を定義した

### mRL-2-2 multimodal attachment flow

- parent: `MRL-2`
- status: `completed`
- result: `multimodal_attachment_flow.yaml` により、テキスト、音声、写真を同じ entry 文脈で扱う flow を固定した

### mRL-2-3 sync status UX

- parent: `MRL-2`
- status: `completed`
- result: mobile contract と preview により `saved` `syncing` `synced` `attention` の状態表現を固定した

## MRL-3

### mRL-3-1 inbox board

- parent: `MRL-3`
- status: `completed`
- result: `build_status_snapshot.py` と PC preview により、到着 record 数と処理状態の一覧表示を追加した

### mRL-3-2 context record view

- parent: `MRL-3`
- status: `in_progress`
- result: `build_review_snapshot.py` と PC preview により、元ログ、次問、KPI 候補の最小同時表示を追加した

### mRL-3-3 ops panel

- parent: `MRL-3`
- status: `completed`
- result: PC preview により Syncthing、observer、Ollama の状態表示を追加した

## MRL-4

### mRL-4-1 whisper pipeline

- parent: `MRL-4`
- status: `planned`
- result: 音声から transcript YAML を生成する

### mRL-4-2 next question generation

- parent: `MRL-4`
- status: `planned`
- result: recent logs から次問を 1 件生成する

### mRL-4-3 KPI candidate synthesis

- parent: `MRL-4`
- status: `planned`
- result: evidence-linked KPI candidate を生成する

## MRL-5

### mRL-5-1 observer-to-analysis handoff

- parent: `MRL-5`
- status: `planned`
- result: watcher から分析ジョブ投入までを自動化する

### mRL-5-2 reverse sync question loop

- parent: `MRL-5`
- status: `planned`
- result: 生成した次問を Android 側へ逆同期する

### mRL-5-3 end-to-end validation

- parent: `MRL-5`
- status: `planned`
- result: Android 入力から KPI 候補提示までの一連を検証する

## MRL-6

### mRL-6-1 security hardening

- parent: `MRL-6`
- status: `planned`
- result: mount policy、container permissions、device trust を harden する

### mRL-6-2 retry and observability

- parent: `MRL-6`
- status: `planned`
- result: retry、dead letter、health indicators を整える

### mRL-6-3 future multi-device boundary

- parent: `MRL-6`
- status: `planned`
- result: 他 OS、他スマホへ拡張可能な boundary を定義する
