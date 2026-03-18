# 2026-03-17-001 market release lines

| ID | status | name | delivered value |
|---|---|---|---|
| MRL-0 | completed | foundation line | `iClone` を独立 project として初期化し、`docs/` `develop/` `data/` の source-of-truth を整えた |
| MRL-1 | completed | connectivity line | host stack、runtime layout、known device anchor、将来の `mDNS + MAC whitelist + Syncthing` ルートを定義した |
| MRL-2 | completed | edge end-user UX line | `Xperia 5 III` 向け `iClone Mobile` の memo / history / workspace UX と APK shell を整えた |
| MRL-3 | completed | PC end-user workspace line | host console ではなく、end-user が使う PC workspace UI を導入した |
| MRL-4 | completed | intelligence line | transcript / next question / KPI candidate の host-side pipeline を実装した |
| MRL-5 | completed | device closed-loop line | Android local files から adb bridge を通し、host records と reverse sync が回る閉ループを実装した |
| MRL-6 | completed | hardening and extension line | retry、snapshot、dead-letter、multi-device boundary、one-click launcher を整えた |
| MRL-7 | completed | sync-first copy experience line | mobile / desktop を copy-first の共通 UX に再設計し、`Local / PC / PC synced` 表現、自動保存、写真付き同期、簡潔な workspace を統一した |
| MRL-8 | completed | clone-first workspace line | クローン操作を最優先に再設計し、compact status、PC / mobile 両側設定、削除、双方向 clone payload、UX 自動検証レポートを導入した |
