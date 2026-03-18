# 2026-03-17-001 market release lines

| ID | status | name | delivered value |
|---|---|---|---|
| MRL-0 | completed | foundation line | `iClone` を独立 project として初期化し、`docs/` `develop/` `data/` の正本を作成した |
| MRL-1 | completed | connectivity line | host stack、runtime layout、known device anchor、`mDNS + MAC whitelist + Syncthing` の設計基盤を揃えた |
| MRL-2 | completed | edge end-user UX line | `Xperia 5 III` 向け `iClone Mobile` の capture / history / workspace UX と APK shell を作成した |
| MRL-3 | completed | PC end-user workspace line | host console ではなく end-user が使う PC workspace UI を作成した |
| MRL-4 | completed | intelligence line | transcript / next question / KPI candidate を生成する host-side pipeline を実装した |
| MRL-5 | completed | device closed-loop line | Android local files から adb bridge を通して host records / reverse sync まで閉ループ化した |
| MRL-6 | completed | hardening and extension line | retry、snapshot、dead-letter、multi-device boundary、one-click launcher を整えた |
| MRL-7 | completed | sync-first copy experience line | mobile / desktop を copy-first UX に揃え、状態表現を簡潔化した |
| MRL-8 | completed | clone-first workspace line | clone workspace を主役にし、compact status、設定、delete、UX 自動検証レポートを整えた |
| MRL-9 | completed | mobile-server connector line | `Mobile --connector-- Server` を正本表現にし、docker 停止 / 準備中 / 同期中を色で判別できるようにした |
| MRL-10 | completed | clone browser and trash line | `Memo Clone` `Photo Clone` の accordion browser、sticky close、soft delete、ごみ箱、hard delete を mobile / desktop 両方へ入れた |
| MRL-11 | completed | reconnect and validation trace line | mobile / desktop 両方から `Server再起動` `再接続` を操作可能にし、再接続中は黄色点滅で可視化した。UX 検証は単一の `UX_validation_trace.yaml` に追記する運用へ移行した |
