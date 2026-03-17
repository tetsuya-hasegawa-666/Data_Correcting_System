# develop インデックス

## 現在の plan set

- active dated plan set: `none`
- latest completed plan set: `2026-03-17-015 capture mode, japanese UX, and resilient recording`
- active market release target: `none`
- latest completed market release target: `MRL-13 robust recording and error handling line`
- active micro release target: `none`
- latest completed micro release target: `mRL-13-3 completion evidence rule close`

## 正本の見方

- 現在の MRL 一覧の正本は [develop/plans/2026-03-17-015/market_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iSensorium/develop/plans/2026-03-17-015/market_release_lines.md) とする。
- 現在の mRL 一覧の正本は [develop/plans/2026-03-17-015/micro_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iSensorium/develop/plans/2026-03-17-015/micro_release_lines.md) とする。
- 上記 2 ファイルは、初版 `MRL-0` / `mRL-0-1` から最新完了分までを累積記載する。
- 過去の dated plan set 配下の release 文書は、当時の計画文脈を残す履歴とし、レビュー時の主参照には使わない。

## 2026-03-17-015 の完了内容

- `MRL-11`
  - 通常計測 / ポケット収納計測 mode の定義
  - session manifest / parser contract の mode 対応
  - docs / develop の整合
- `MRL-12`
  - Android 日本語 UI
  - mode selection UI
  - MVC 境界整理
- `MRL-13`
  - 詳細エラーハンドリング
  - pocket mode fallback / warning
  - Codex 再テストと evidence 反映

## 直近の再テスト

- `./gradlew.bat testDebugUnitTest`
- `./gradlew.bat assembleDebug`
- `python -m unittest python.test_session_parser`
- `adb install -r app/build/outputs/apk/debug/app-debug.apk`
- 実機確認項目
  - 日本語 UI
  - pocket mode 選択
  - 低頻度調整 guidance

## 運用ルール

- 実装完了の既定 evidence は `Codex retest` とする。
- ただしユーザーが検証できた旨を明示した場合は、その `user validation` を completion evidence として採用できる。
- 新しい MRL / mRL を追加するときは、現行正本の累積一覧へ追記してから個別作業へ進む。
