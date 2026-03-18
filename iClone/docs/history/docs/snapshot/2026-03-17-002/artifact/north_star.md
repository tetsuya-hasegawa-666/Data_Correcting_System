# 北極星

## 背景と目的

マネージャーがビジネスの現場で「追いかけるべき真の KPI」を特定するための、コンテキスト収集システムを構築する。
最大の特徴は、「アンケートに答える」という行為を「利便性の高いビジネスメモ同期」という UX に昇華させ、思考コストと行動コストを最小化したまま、生きた情報を収集することにある。

## ターゲットユーザー

- 現場とオフィスを往復し、多忙を極めるマネージャー
- 多数の論点を横断して意思決定するシステムアーキテクト

## 顧客提供価値

- 脳内同期の解放:
  スマホで吐き出した断片思考が、PC 側のビジネス記録として即座に構造化・同期される。
- セキュリティの透明化:
  物理的近接を使い、毎回のログイン操作を意識させない。
- インサイトの創発:
  記録傾向から AI が次の問いを生成し、真の KPI 候補を気づかせる。

## 主体アーキテクチャ

この project の主体は、Windows 11 + WSL2/Docker または Ubuntu をホスト、Android をエッジとする「ローカル・同期・ハブ」である。
まず同期を成立させ、その後でコンテキスト抽出と KPI 発見を重ねる。

## UX 設計の柱

- Zero-Friction Entry
- Invisible Sync
- Context Preservation

## 非交渉事項

- スマホ起動から入力完了まで数秒で到達できること
- PC の Wi-Fi / Bluetooth 圏内でバックグラウンド同期が成立すること
- 断片メモが project 文脈を失わず PC 側に展開されること
- 同期対象メタデータの正本は YAML で一貫管理すること
- 推論は Docker コンテナ内で完結させること
- 利用者向け文言は日本語で自然に理解できること

## 不変条件

### 固定事項

- host: Windows 11 + WSL2/Docker または Ubuntu 22.04+
- edge: Android
- PC 発見は mDNS を第一候補とし、`pc-name.local` で到達できることを基本導線とする
- P2P 同期は Docker 上の Syncthing を初期優先候補とする
- 同一 Wi-Fi 外の延長導線は Tailscale をオプションで許容する
- MAC アドレス whitelist は近接認証の起点とする
- 音声文字起こしは Whisper 系ローカル推論を前提にする
- LLM Hub は Ollama または LocalAI を採用候補とする
- source-of-truth は `docs/`、計画は `develop/`、seed data は `data/` で扱う

### 仮説事項

- MAC アドレスだけでは恒久認証として弱く、peer key 併用が必要になる
- Android 端末内転写は電力制約により host 側実行が優位の可能性がある
- 初期 review surface は CLI または local web でも十分な可能性がある

## 成功条件

- manager の断片メモが project 文脈付きで同期される
- Android で保存した YAML / 写真 / 音声が数秒以内に host 側 Docker mount へ到達する
- AI の一問一葉が入力負荷を増やさず情報密度を上げる
- KPI 候補に根拠ログと次問が紐付く
- Android、Windows、WSL2、Docker の責務境界が明確である
