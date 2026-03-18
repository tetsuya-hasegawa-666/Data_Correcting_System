# 2026-03-17-001 market release lines

| ID | status | name | delivered value |
|---|---|---|---|
| MRL-0 | completed | foundation line | `iClone` を独立 project として初期化し、`docs/` `develop/` `data/` の正本を整えた |
| MRL-1 | completed | connectivity line | host stack、runtime layout、known device anchor、`mDNS + MAC whitelist + Syncthing` の接続前提を定義した |
| MRL-2 | completed | edge end-user UX line | `Xperia 5 III` 向け `iClone Mobile` の capture / history / workspace UX と APK shell を整えた |
| MRL-3 | completed | PC end-user workspace line | host console ではなく end-user が使う PC workspace UI を整えた |
| MRL-4 | completed | intelligence line | transcript / next question / KPI candidate の host-side pipeline を実装した |
| MRL-5 | completed | device closed-loop line | Android local files から adb bridge を通して host records / reverse sync を閉じた |
| MRL-6 | completed | hardening and extension line | retry、snapshot、dead-letter、multi-device boundary、one-click launcher を整えた |
| MRL-7 | completed | sync-first copy experience line | mobile / desktop を copy-first UX に寄せ、`Local / PC / PC synced` の共有表現を入れた |
| MRL-8 | completed | clone-first workspace line | clone workspace を主役にし、compact status、双方向 settings、delete、UX 自動検証レポートを整えた |
| MRL-9 | completed | mobile-server connector line | `Mobile --connector-- Server` を正本の同期表示へ更新し、docker 未起動 / 同期準備中 / 同期中 を色で一目判定できる compact UX にした |
