# 2026-03-17-016 micro release lines

## 目的

このファイルを `iSensorium` の mRL 正本とする。
旧 capture research line の履歴は要約保持し、新しい manager context collection line の詳細分解を `mRL-14-1` から追記する。

## 運用ルール

- 新しい mRL を追加したら、このファイルへ必ず追記する。
- 各 mRL は `parent` `status` `initial plan set` `latest touch` `result` を最低限持つ。

## legacy summary

- `mRL-0-1` から `mRL-13-3`:
  capture research line として completed。詳細は `2026-03-17-015` までの履歴を参照する。

## MRL-14

### mRL-14-1 project pivot and north star rewrite

- parent: `MRL-14`
- status: `completed`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: manager context collection system への pivot を `north_star` `story_release_map` `current_state` に反映した。

### mRL-14-2 YAML schema and seed data baseline

- parent: `MRL-14`
- status: `completed`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: `system_blueprint` に schema、directory structure、sequence を定義し、`data/seed/manager_context/` に sample YAML を追加した。

### mRL-14-3 connectivity contract and local sync scaffold

- parent: `MRL-14`
- status: `in_progress`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: known device contract、Syncthing folder pair、peer state 管理の config / skeleton を次タスクとして進行中。

## MRL-15

### mRL-15-1 MAC whitelist contract

- parent: `MRL-15`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: host 側 `known_devices.yaml` と edge 側 `trusted_hosts` の対応を固定する。

### mRL-15-2 local P2P folder mapping

- parent: `MRL-15`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: `edge-outbox` と `host-inbox/<deviceId>/` の双方向同期契約を固定する。

### mRL-15-3 attachment integrity and retry

- parent: `MRL-15`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: attachment hash、partial sync、retry policy を定義する。

## MRL-16

### mRL-16-1 one-question edge flow

- parent: `MRL-16`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: Android 一問一葉 flow を確立する。

### mRL-16-2 multimodal capture aggregation

- parent: `MRL-16`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: text / voice / photo を単一 entry YAML へ集約する。

### mRL-16-3 project context binding

- parent: `MRL-16`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: projectId、topic、phase を quick memo 段階で保持する。

## MRL-17

### mRL-17-1 local transcription pipeline

- parent: `MRL-17`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: Docker 内の local transcription pipeline を固定する。

### mRL-17-2 next question generation

- parent: `MRL-17`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: recent entry と unresolved theme から次問を 1 件生成する。

### mRL-17-3 KPI candidate synthesis

- parent: `MRL-17`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: evidence-linked KPI candidate YAML を生成する。

## MRL-18

### mRL-18-1 manager review workflow

- parent: `MRL-18`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: PC 側で採用 / 保留 / 棄却を行う review workflow を整える。

### mRL-18-2 security and isolation hardening

- parent: `MRL-18`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: raw data mount policy、container 権限、key handling を harden する。

### mRL-18-3 end-to-end evidence close

- parent: `MRL-18`
- status: `planned`
- initial plan set: `2026-03-17-016`
- latest touch: `2026-03-17-016`
- result: edge capture から KPI candidate までの end-to-end evidence を閉じる。
