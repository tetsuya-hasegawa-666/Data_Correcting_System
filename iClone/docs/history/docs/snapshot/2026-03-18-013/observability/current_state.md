# current state

## 現在の状態

- active plan set: `2026-03-17-001 manager context collection foundation`
- active market release: `none`
- active micro release: `none`
- current blocker: `Android 実機は adb 未接続のため、物理端末での最終確認は未実施`

## completed evidence

- docs 初期化
- develop 初期化
- seed data 追加
- ローカル・同期・ハブ主体のアーキテクチャを source-of-truth へ反映
- Xperia 5 III と `Tezy-GT37` を現行ターゲットとして明文化
- `docker-compose.yml`、`start_host_stack.ps1`、`observer.py` を追加
- observer が inbox から records / llm_inbox へ反映する最小フローを確認
- observer から analysis pipeline、reverse sync payload、dead-letter までの host-side closed loop を追加
- Tailscale optional extension の config と endpoint helper を追加
- mobile quick capture preview と UX contracts を追加
- mobile auto-save、端末内一覧 sort、閲覧履歴、音声 / 画像見出しの preview 骨格を追加
- PC review preview と review snapshot generator を追加
- transcript、next question、KPI candidate、health snapshot、retry tool を追加
- `run_end_to_end_validation.py` による seed validation を通した

## active risks

- MAC アドレス単独認証の弱さ
- Android 側転写コスト未確定
- Windows 11 + WSL2 と Ubuntu での Syncthing Docker 差分未整理
- Android 実装の UI 状態管理方式が未確定
- 実機 Xperia 5 III との ADB / Syncthing 実接続確認が未完了

## next validation point

- Xperia 5 III を adb 接続し、実機入力から `runtime/edge-outbox` までの物理 closed loop を確認する
- Syncthing 実接続で Android 側 reverse sync 受信を確認する
- PC 側 context record の採用 / 保留 / 棄却操作を実 UI に落とし込む
