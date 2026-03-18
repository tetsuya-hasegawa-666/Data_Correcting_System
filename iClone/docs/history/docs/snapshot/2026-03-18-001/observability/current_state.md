# current state

## 現在の状態

- active plan set: `2026-03-17-001 manager context collection foundation`
- active market release: `MRL-3 PC review UX line`
- active micro release: `mRL-3-2 context record view`
- current blocker: `none`

## completed evidence

- docs 初期化
- develop 初期化
- seed data 追加
- ローカル・同期・ハブ主体のアーキテクチャを source-of-truth へ反映
- Xperia 5 III と `Tezy-GT37` を現行ターゲットとして明文化
- `docker-compose.yml`、`start_host_stack.ps1`、`observer.py` を追加
- observer が inbox から records / llm_inbox へ反映する最小フローを確認
- Tailscale optional extension の config と endpoint helper を追加
- mobile quick capture preview と UX contracts を追加
- PC review preview と review snapshot generator を追加

## active risks

- MAC アドレス単独認証の弱さ
- Android 側転写コスト未確定
- review surface の実装方式未確定
- Windows 11 + WSL2 と Ubuntu での Syncthing Docker 差分未整理
- Android 実装の UI 状態管理方式が未確定
- context record view の詳細操作が未定

## next validation point

- Syncthing Docker と host runtime layout の実体を compose と script へ落とし込む
- observer が inbox から curated records へ正規化する最小実装を追加する
- PC 側 inbox board と context record view を preview へ反映する
- status snapshot を review surface に流し込む
- context record の採用 / 保留 / 棄却操作を設計へ落とし込む
