# Story And Release Map

## Hierarchy

このプロジェクトの価値構造は、常に以下の順で定義する。

1. Human Goal
2. User Activities
3. User Stories
4. System Capabilities
5. Implementable Features
6. Market Release Lines
7. Micro Release Lines
8. Change / Expansion Points

## Meaning Rules

- Human Goal は不変条件に近い最上位目的。
- User Activities は利用者が行いたい行動。
- User Stories は行動が価値に変換される単位。
- System Capabilities はシステムが持つべき能力。
- Implementable Features は実装可能な機能単位。
- Market Release Line は外部価値が成立した意味単位。
- Micro Release Line は実機で体験可能な検証到達点。
- Change / Expansion Points は後で差し替えや拡張が起こりうる接続点。

## Market And Micro Separation

| Layer | Definition | Must Include |
|---|---|---|
| Market Release Line | 社会、現場、研究、運用に対して説明可能な価値成立ライン | 成立価値、対象者、成立条件、見直し要因 |
| Micro Release Line | 実機スマホで体験し、次学習へ接続できる小到達点 | 体験内容、観測項目、成功条件、失敗時次アクション |

## Minimal Required Fields

### Market Release Line

- ID
- name
- parent goal / activity / story
- delivered value
- entrance criteria
- exit criteria
- linked micro releases
- change drivers

### Micro Release Line

- ID
- parent market release
- developer experience
- verification method
- expected result
- failure split
- next decomposition target
- status

## Mermaid Rules

- 価値階層と release 階層は同一 Mermaid 内で表現してよい。
- ただし `Market Release` と `Micro Release` の node label を必ず分ける。
- 現在地、変更候補、保留、廃止候補は注釈で示す。
- Mermaid の正式版はこのファイルだけに置く。

## Initial Skeleton

```mermaid
flowchart TD
    HG["Human Goal: 動画中心の時空間同期記録基盤を確立する"]
    UA1["User Activity: 実機で記録する"]
    UA2["User Activity: 記録結果を検証する"]
    UA3["User Activity: 研究開発ラインを更新する"]

    US1["User Story: 録画しながら主要センサを欠落少なく保存したい"]
    US2["User Story: 後段解析に再利用できる形で持ち帰りたい"]
    US3["User Story: 変化に応じて release line を再編したい"]

    SC1["Capability: 同期付き収集"]
    SC2["Capability: 壊れにくい保存"]
    SC3["Capability: 変更追跡付き運用"]

    IF1["Feature: Session 管理"]
    IF2["Feature: Timestamp 正規化"]
    IF3["Feature: 圧縮/送信ポリシー"]
    IF4["Feature: Story/Release 可視化"]

    MRL1["Market Release: 実機で価値ある同期記録の成立"]
    MRL2["Market Release: 後段解析に流用できるデータ基盤の成立"]
    MRL3["Market Release: Human + AI 継続研究運用の成立"]

    mRL1["Micro Release: 起動して疑似または実録画 + 1 センサ保存"]
    mRL2["Micro Release: 動画 + IMU 同期確認"]
    mRL3["Micro Release: 変更要求を反映し意味差分を追跡"]

    CP1["Change Point: センサ可用性変化"]
    CP2["Change Point: 研究価値再定義"]
    CP3["Change Point: 端末制約変化"]

    HG --> UA1
    HG --> UA2
    HG --> UA3
    UA1 --> US1
    UA2 --> US2
    UA3 --> US3
    US1 --> SC1
    US1 --> SC2
    US2 --> SC2
    US3 --> SC3
    SC1 --> IF1
    SC1 --> IF2
    SC2 --> IF3
    SC3 --> IF4
    IF1 --> MRL1
    IF2 --> MRL1
    IF3 --> MRL2
    IF4 --> MRL3
    MRL1 --> mRL1
    MRL1 --> mRL2
    MRL3 --> mRL3
    MRL1 --> CP1
    MRL2 --> CP3
    MRL3 --> CP2
```
## 2026-03-15 Addendum: Guarded Upstream Trial

- New change point: `frozen CameraX path -> shared-camera-session-adapter seam`.
- New market target after documentation discipline: `MRL-6 guarded upstream trial`.
- New micro release focus:
  - `mRL-6-1`: route preserved outer session operations through the adapter seam.
  - `mRL-6-2`: keep frozen artifact contract while adding guarded trial metadata.
  - `mRL-6-3`: declare reversible cutover gate and verification conditions before real replacement runtime wiring.
