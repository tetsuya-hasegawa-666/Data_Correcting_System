# current state

## 現在の状態

- latest completed plan set: `2026-03-17-015 capture mode, japanese UX, and resilient recording`
- latest completed market release: `MRL-13 robust recording and error handling line`
- latest completed micro release: `mRL-13-3 completion evidence rule close`
- active market release: `none`
- active micro release: `none`
- current blocker: `none`

## 累積台帳

- MRL 正本: [market_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iSensorium/develop/plans/2026-03-17-015/market_release_lines.md)
- mRL 正本: [micro_release_lines.md](/Users/tetsuya/playground/Data_Correcting_System/iSensorium/develop/plans/2026-03-17-015/micro_release_lines.md)
- 上記 2 ファイルには初版から最新完了分までを累積で記載する。

## 直近完了

- `MRL-11`
  - 通常計測 / ポケット収納計測 mode の定義
  - mode metadata と export contract の確立
- `MRL-12`
  - Android 日本語 UI
  - mode selection UI
  - MVC 境界整理
- `MRL-13`
  - 詳細 error handling
  - pocket mode fallback / warning
  - Codex 再テストと evidence 反映

## completion evidence

- 既定 evidence: `Codex retest`
- 例外: ユーザーが検証できた旨を明示した場合は `user validation` を completion evidence として採用できる

## 最新の再テスト

- `./gradlew.bat testDebugUnitTest`
- `./gradlew.bat assembleDebug`
- `python -m unittest python.test_session_parser`
- 実機確認
  - 日本語 UI
  - pocket mode 選択
  - 低頻度調整 guidance
