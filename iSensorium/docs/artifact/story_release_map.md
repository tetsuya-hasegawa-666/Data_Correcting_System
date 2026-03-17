# ストーリーとリリース対応表

## 目的

この文書は、`iSensorium` の人の目的、利用アクティビティ、ユーザーストーリー、機能、MRL の対応を俯瞰するための正本とする。  
MRL / mRL の累積台帳そのものは develop 側の次の 2 ファイルを主参照とする。

- [market_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iSensorium/develop/plans/2026-03-17-015/market_release_lines.md)
- [micro_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iSensorium/develop/plans/2026-03-17-015/micro_release_lines.md)

## 人の目的

Xperia 5 III 上で、動画を中心に IMU、GNSS、BLE、ARCore を時系列収録し、後段の解析や 3DGS 利用へ渡せる形で保存する。さらに、通常携行だけでなくポケット収納のような実利用文脈にも適合し、運用時に人が迷わない UX と確認可能性を確保する。

## ストーリー層

1. 記録を開始できる
2. 複数センサーを同一 session で残せる
3. 解析利用できる export を得られる
4. 障害時も session を破綻させず運用できる
5. guarded route を安全に試験できる
6. preview と UX 確認を実機で回せる
7. 通常計測とポケット収納計測を選べる
8. 日本語 UI と詳細エラーハンドリングで迷わず操作できる

## MRL 対応

| story cluster | 対応 MRL | 要点 |
|---|---|---|
| 記録開始と session 基礎 | `MRL-0` `MRL-1` | session bootstrap、recording spine、timestamp basis |
| センサー拡張と export 契約 | `MRL-2` `MRL-3` | GNSS / BLE / ARCore 統合、parser / metadata contract |
| 運用耐性 | `MRL-4` `MRL-5` | offline / partial failure / docs-develop discipline |
| guarded route 準備と実配線 | `MRL-6` `MRL-7` | seam、additive metadata、replacement runtime wiring |
| guarded route 安定化と UX check | `MRL-8` `MRL-9` | lifecycle stabilization、UX check ready |
| preview 実装 | `MRL-10` | guarded replacement preview MVP |
| 計測 mode と日本語 UX | `MRL-11` `MRL-12` | mode-aware recording、日本語 UI、MVC |
| 強い error handling | `MRL-13` | pocket mode fallback、詳細 issue 表示、completion evidence |

## 現在の到達点

- `MRL-0` から `MRL-13` まで完了
- `mRL-0-1` から `mRL-13-3` まで完了
- 今後は新しい line を追加するときも、累積台帳に追記してから着手する

## レビュー方針

- 全体の進行確認は develop 側の累積台帳を見る
- 人の目的との整合はこの文書で確認する
- 実装詳細、状態、evidence は `current_state` と develop history を併読する
