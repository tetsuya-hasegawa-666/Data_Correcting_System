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
- status: `in_progress`
- result: mDNS による `pc-name.local` discovery と MAC whitelist の契約を定義する

### mRL-1-2 syncthing docker folder contract

- parent: `MRL-1`
- status: `planned`
- result: Syncthing in Docker による edge-outbox / host-inbox / curated records のフォルダ契約を固定する

### mRL-1-3 tailscale optional extension

- parent: `MRL-1`
- status: `planned`
- result: 同一 Wi-Fi 外でのオプション導線として Tailscale 利用条件を定義する

### mRL-1-4 host mount and watcher baseline

- parent: `MRL-1`
- status: `planned`
- result: Docker mount、watcher、llm inbox の host 側配置を固定する
