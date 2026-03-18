# システム設計書

## 実装対象

`Xperia 5 III + Windows Tezy-GT37` の組み合わせを first target とし、end-user が使う copy-first の同期 UX を構築する。

- 将来の本命ルート:
  `mDNS discovery -> MAC whitelist -> Syncthing in Docker -> local LLM`
- 現在の実装ルート:
  `iClone Mobile -> app local files -> adb bridge -> runtime/host-inbox -> observer -> runtime/records -> runtime/edge-outbox -> Android sync-inbox`

## アーキテクチャ図

```mermaid
flowchart LR
    subgraph Edge["Xperia 5 III"]
        A1["iClone Mobile"]
        A2["Local draft / entries / history"]
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

    U->>A: メモ入力 / 写真添付
    A->>A: local entry と sync-outbox を自動更新
    B->>A: sync-outbox を pull
    B->>O: host-inbox へ YAML と写真を配置
    O->>O: records と llm_inbox へ反映
    O->>L: memo を解析
    L->>L: question / KPI candidate を生成
    L->>P: PC workspace を更新
    B->>A: ack と question を sync-inbox へ push
```

## KPI 発見 UX フロー

```mermaid
flowchart TD
    S1["mobile でメモを残す"] --> S2["自動保存される"]
    S2 --> S3["写真も同じ entry に添付される"]
    S3 --> S4["PC workspace へコピーされる"]
    S4 --> S5["PC でメモと写真を読む"]
    S5 --> S6["次の質問と KPI candidate が生成される"]
    S6 --> S7["質問が mobile に戻る"]
    S7 --> S8["PC synced で続きが読める"]
```

## ディレクトリ構造

```text
iClone/
  android/
    app/src/main/assets/mobile_quick_capture.html
    app/src/main/java/com/iclone/mobile/MainActivity.kt
  preview/
    mobile_quick_capture.html
    index.html
    app.js
    styles.css
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

## UI contract

### 共通 visual language

- warm paper background
- round panel
- concise copy
- shared labels:
  `Local` `PC` `PC synced`

### mobile

- 主題:
  `その場で残す`
- primary tabs:
  `入力` `履歴` `ワークスペース`
- compose:
  headline / body / photo
- save model:
  typing と photo change で auto-save entry
- confirm button:
  `記録を確定`
  実保存トリガではなく、`記録しました。` を返すギミック

### desktop

- 主題:
  `コピーされたメモを使う`
- first view:
  最新メモ / 次の質問 / コピー状況
- second view:
  PC に届いたメモ一覧 / 写真ギャラリー
- admin console の露出は避け、end-user workspace を正面に置く

## YAML schema

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
body: "現場ホワイトボードを撮影し、そのままメモした"
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

### reverse sync question

```json
{
  "entryId": "question-entry-20260318-211500",
  "headline": "次の質問",
  "body": "現場で最も遅れている工程はどこですか",
  "projectId": "project-alpha",
  "sessionId": "session-20260318-211500"
}
```
