# 2026-03-17-001 release lines

このファイルを、`iClone` の MRL / mRL を一覧する単一の正本とする。

## MRL overview

| ID | status | name | delivered value |
|---|---|---|---|
| MRL-0 | completed | foundation line | `iClone` を独立 project として起こし、docs / develop / seed / schema の基線を整備した |
| MRL-1 | completed | connectivity line | host stack、runtime layout、known device 前提、将来の Syncthing 経路を整理した |
| MRL-2 | completed | edge end-user UX line | Xperia 5 III 向け `iClone Mobile` の memo / history / workspace UX と APK shell を実装した |
| MRL-3 | completed | PC end-user workspace line | PC 側を host console ではなく end-user workspace UI に切り替えた |
| MRL-4 | completed | intelligence line | transcript / next question / KPI candidate の host-side pipeline を実装した |
| MRL-5 | completed | device closed-loop line | Android local files から adb bridge を経由して host records と reverse sync が通る閉ループを成立させた |
| MRL-6 | completed | hardening and extension line | retry、snapshot、dead-letter、multi-device boundary、one-click launcher を揃えた |

## MRL-0 foundation line

### mRL-0-1 directory and docs setup

- parent: `MRL-0`
- status: `completed`
- result: `docs/` `develop/` `data/` `scripts/` を作成した

### mRL-0-2 architecture and schema baseline

- parent: `MRL-0`
- status: `completed`
- result: architecture、sequence、UX flow、YAML schema を定義した

## MRL-1 connectivity line

### mRL-1-1 host stack and runtime contract

- parent: `MRL-1`
- status: `completed`
- result: `docker-compose.yml` と runtime layout を定義した

### mRL-1-2 known device anchor

- parent: `MRL-1`
- status: `completed`
- result: `Xperia 5 III + Tezy-GT37` を現行ターゲットとして固定した

### mRL-1-3 future connectivity route

- parent: `MRL-1`
- status: `completed`
- result: mDNS、MAC whitelist、Syncthing、Tailscale option を source-of-truth に残した

## MRL-2 edge end-user UX line

### mRL-2-1 mobile capture contract

- parent: `MRL-2`
- status: `completed`
- result: `入力` `履歴` `ワークスペース` の 3 タブ UX を整理した

### mRL-2-2 mobile auto-save and list browse

- parent: `MRL-2`
- status: `completed`
- result: 自動仮保存、sort、閲覧履歴、写真見出し付きメモの contract を実装した

### mRL-2-3 Android app shell

- parent: `MRL-2`
- status: `completed`
- result: `iClone Mobile` APK project を build / install 可能にした

### mRL-2-4 Android local persistence

- parent: `MRL-2`
- status: `completed`
- result: JS bridge で draft、entry、history、photo attachment を app storage に保存する実装を追加した

## MRL-3 PC end-user workspace line

### mRL-3-1 PC workspace UI

- parent: `MRL-3`
- status: `completed`
- result: `preview/index.html` を end-user workspace UI に差し替えた

### mRL-3-2 image-capable review snapshot

- parent: `MRL-3`
- status: `completed`
- result: review snapshot に attachment preview URL を含め、PC 側で写真を表示可能にした

### mRL-3-3 one-click launcher

- parent: `MRL-3`
- status: `completed`
- result: `iClone Start` で stack、adb bridge、host app を順に起動する構成にした

## MRL-4 intelligence line

### mRL-4-1 transcript generation

- parent: `MRL-4`
- status: `completed`
- result: audio attachment 前提の transcript 生成を host pipeline に実装した

### mRL-4-2 next question generation

- parent: `MRL-4`
- status: `completed`
- result: memo と context から次の質問を生成する deterministic path を実装した

### mRL-4-3 KPI candidate generation

- parent: `MRL-4`
- status: `completed`
- result: evidence-linked KPI candidate を生成する path を実装した

## MRL-5 device closed-loop line

### mRL-5-1 adb pull bridge

- parent: `MRL-5`
- status: `completed`
- result: `adb_bridge.py` で device `sync-outbox` から host inbox へ pull する処理を実装した

### mRL-5-2 attachment-aware observer

- parent: `MRL-5`
- status: `completed`
- result: `observer.py` が YAML と写真添付を records 側へコピーするようにした

### mRL-5-3 reverse sync to device

- parent: `MRL-5`
- status: `completed`
- result: question と ack を `sync-inbox` へ返す実装を追加した

## MRL-6 hardening and extension line

### mRL-6-1 host app file serving

- parent: `MRL-6`
- status: `completed`
- result: `run_host_app.py` が runtime 配下を serve し、PC UI で records 添付画像を読めるようにした

### mRL-6-2 validation evidence

- parent: `MRL-6`
- status: `completed`
- result: sample photo memo による device -> host -> reverse sync の確認を実施した

### mRL-6-3 operational docs sync

- parent: `MRL-6`
- status: `completed`
- result: README、system blueprint、UX workflow、current state を現行 route に更新した
