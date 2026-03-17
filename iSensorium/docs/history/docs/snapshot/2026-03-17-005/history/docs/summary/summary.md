# docs 履歴要約

## 2026-03-17-005 device reality check after pivot

- 発生種別: observability alignment
- 反映内容:
  - `current_state.md` に、Xperia 5 III 実機で `com.isensorium.app` version `0.1.0` を再確認した結果を追加
  - active docs が manager context pivot 後でも、現行 Android runtime は legacy capture line のままであることを明記
  - `UX_check_work_flow.md` を target UX 用 workflow として位置づけ、現行端末の実装手順と混同しないように更新

## 2026-03-17-004 manager context collection pivot baseline

- 発生種別: source-of-truth update
- 反映内容:
  - `iSensorium` の北極星を manager context collection system へ再定義
  - `system_blueprint.md` に architecture、directory structure、YAML schema、接続 sequence、KPI 発見 UX flow を追加
  - `story_release_map.md` と `current_state.md` を `MRL-14` 起点へ更新
  - `data/seed/manager_context/` を追加し、config と sample YAML を配置

## 2026-03-17-003 mode-aware recording implementation close

- 発生種別: source-of-truth update
- 反映内容:
  - `current_state.md` を `MRL-13` 完了状態へ更新
  - `develop/index.md` と plan files を completed 状態へ更新
  - `MRL-11` から `MRL-13` の completion evidence を文書へ反映
- 実装根拠:
  - mode contract: `recordingMode` / `recordingModeLabel` / `modeBehavior`
  - UI: 日本語 mode selection と pocket mode guidance
  - process: `Codex retest` 優先、`user validation` 例外許容

## 主要な直近履歴

- 2026-03-17-002
  - mode-aware recording と planning baseline を source-of-truth へ反映した
- 2026-03-16-001
  - `MRL-10` の Codex 実機再テスト根拠を文書へ反映した
- 2026-03-15-016
  - `MRL-10 guarded replacement preview MVP` の完了を source-of-truth へ反映した
