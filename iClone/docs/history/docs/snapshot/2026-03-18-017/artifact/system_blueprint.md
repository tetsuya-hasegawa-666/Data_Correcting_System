# システム設計図

## 現行方針

`Xperia 5 III + Windows Tezy-GT37` の組み合わせで、まず end-user が使える同期体験を成立させる。

- 将来の正式経路:
  `mDNS discovery -> MAC whitelist -> Syncthing in Docker -> local LLM`
- 現在の実働経路:
  `iClone Mobile -> app local files -> adb bridge -> runtime/host-inbox -> observer -> runtime/records -> runtime/edge-outbox -> Android sync-inbox`

## アーキテクチャ図

```mermaid
flowchart LR
    subgraph Edge["Xperia 5 III"]
        A1["iClone Mobile"]
        A2["Local draft / history / workspace"]
        A3["sync-outbox (YAML + photos)"]
        A4["sync-inbox (acks + questions)"]
    end

    subgraph Host["Windows Tezy-GT37"]
        H1["adb bridge"]
        H2["runtime/host-inbox"]
        H3["observer"]
        H4["runtime/records"]
        H5["PC Workspace UI"]
    end

    subgraph Intel["Docker"]
        I1["Ollama"]
        I2["analysis pipeline"]
        I3["question / KPI output"]
    end

    A1 --> A2
    A2 --> A3
    A3 --> H1
    H1 --> H2
    H2 --> H3
    H3 --> H4
    H3 --> I2
    I2 --> I1
    I2 --> I3
    I3 --> H4
    I3 --> A4
    H4 --> H5
```

## Android-PC 接続シーケンス

```mermaid
sequenceDiagram
    participant U as User
    participant A as Xperia 5 III
    participant B as adb bridge
    participant O as observer
    participant L as analysis pipeline
    participant P as PC workspace

    U->>A: メモ入力 / 写真添付 / 記録を確定
    A->>A: local entry と sync-outbox を保存
    B->>A: sync-outbox を pull
    B->>O: host-inbox へ YAML と写真を配置
    O->>O: records と llm_inbox へ正規化
    O->>L: memo を解析
    L->>L: question / KPI candidate を生成
    L->>P: records と preview snapshot を更新
    B->>A: ack と question を sync-inbox へ push
```

## UX フロー

```mermaid
flowchart TD
    S1["入力タブでメモを書く"] --> S2["自動仮保存される"]
    S2 --> S3["写真を添付する"]
    S3 --> S4["記録を確定する"]
    S4 --> S5["PC ワークスペースへ同期される"]
    S5 --> S6["PC でメモ / 写真 / 最新質問を見る"]
    S6 --> S7["Android に次の質問が戻る"]
    S7 --> S8["PC synced として継続入力する"]
```

## ディレクトリ構造

```text
iClone/
  android/
    app/src/main/assets/mobile_quick_capture.html
    app/src/main/java/com/iclone/mobile/MainActivity.kt
  preview/
    index.html
    app.js
    styles.css
    mobile_quick_capture.html
  src/host/
    adb_bridge.py
    observer.py
    analysis_pipeline.py
    build_status_snapshot.py
    build_review_snapshot.py
    run_host_app.py
  runtime/
    host-inbox/
    records/
    edge-outbox/
    device-cache/
    logs/
```

## YAML スキーマ

### memo

```yaml
schemaVersion: "1.0.0"
entryId: "entry-20260318-211500"
entryType: "memo"
projectId: "project-alpha"
sessionId: "session-20260318-211500"
capturedAt: "2026-03-18T21:15:00+09:00"
deviceId: "xperia5iii-edge-001"
inputMode: "photo"
body: "現場ホワイトボードの写真を共有します"
attachments:
  - attachmentId: "photo-entry-20260318-211500"
    path: "attachments/photo-entry-20260318-211500.jpg"
    mimeType: "image/jpeg"
projectContext:
  customer: "field-user"
  phase: "validation"
  topic: "onsite_context"
sync:
  peerId: "USB-ADB-XPERIA"
  state: "local_saved"
headline: "ホワイトボード確認"
```

### reverse sync question json

```json
{
  "entryId": "question-entry-20260318-211500",
  "headline": "次の質問",
  "body": "現場で最も遅れている工程はどこですか",
  "projectId": "project-alpha",
  "sessionId": "session-20260318-211500"
}
```

## 実装メモ

- `observer.py` は添付写真を records 側へコピーする
- `build_review_snapshot.py` は PC 側 image preview URL を出す
- `run_host_app.py` は `/runtime/...` をそのまま配信する
- `MainActivity.kt` は JS bridge で draft / entry / history / question を扱う
