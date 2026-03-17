# 北極星

## 人の目標

多忙なマネージャーやシステムアーキテクトが、現場で生まれる断片的な気づき、観察、会話、写真、音声を最小負荷で残し、PC 側でプロジェクト文脈付きのビジネス記録へ即座に同期できるようにする。
その蓄積文脈から、AI が「今追うべき真の KPI 候補」を一問一葉で浮かび上がらせる。

## 提供価値

- 脳内同期の解放:
  スマホで吐き出したメモが、PC 側では構造化済みの記録として揃う。
- セキュリティの透明化:
  物理的近接とローカルネットワーク前提で、毎回の明示ログインを極小化する。
- インサイトの創発:
  蓄積傾向と相関から、AI が次に聞くべき問いと潜在 KPI 候補を提示する。

## 対象ユーザー

- 現場とオフィスを往復するマネージャー
- 多数の論点を跨いで意思決定するシステムアーキテクト
- 断片メモを後で整理しきれず、追うべき KPI の定義が遅れやすい利用者

## 対象境界

- `iSensorium/` は manager context collection system の source-of-truth、実開発計画、seed data、将来の edge / host / intelligence 実装方針を扱う。
- edge は Android、host は Windows + WSL2 Ubuntu、推論隔離は Docker on Ubuntu を基本前提とする。
- ローカル同期、YAML 正本、添付整理、質問生成、KPI 発見フローまでを同一意味体系で管理する。

## 非交渉事項

- Zero-Friction Entry:
  アプリ起動から入力開始まで数秒で到達できること。
- Invisible Sync:
  PC の Wi-Fi / Bluetooth 圏内へ入ったら、バックグラウンド同期が基本導線であること。
- Context Preservation:
  スマホ側の断片メモが、PC 側で project / topic / session 文脈付きで再構成されること。
- Local-First:
  デフォルトではクラウド依存を置かず、同一 LAN / 近接環境で閉じられること。
- YAML Canonical Log:
  テキスト、音声転写、写真、質問、KPI 候補の正本メタデータを YAML で一貫管理すること。
- Secure Isolation:
  推論は Docker コンテナ内で完結し、生データを隔離境界外へ出さないこと。
- 日本語 UX:
  利用者向け UI 文言と質問文は、日本語で自然に理解できること。

## 不変条件

### 固定事項

- host OS は Windows を主、WSL2 Ubuntu を補助実行環境とする。
- edge OS は Android を主とする。
- 同期は local network 内の P2P を基本とし、初期実装では Syncthing 系を優先候補とする。
- 近接判定は MAC アドレス whitelist を起点にするが、接続自体の暗号化と補助鍵管理は別レイヤで担保する。
- Whisper 互換のローカル音声文字起こしを採用候補とする。
- file 名、class 名、package 名、識別子、config key はアルファベットで維持する。
- source-of-truth は `docs/`、実開発計画は `develop/`、seed data は `data/` で扱う。
- Codex は完了判定前に再確認を行う。ただしユーザーが検証結果を明示した場合は、その user validation を完了根拠として採用できる。

### 仮説事項

- MAC アドレスだけでは OS 更新や NIC 変動に弱いため、最終的には device key との二段確認が必要になる。
- Android 端末内のローカル Whisper 実行は電力と発熱制約が強く、初期は host 側転写に寄せる可能性がある。
- host 側 UI は初期には CLI / local web console で十分であり、専用 dashboard は後段へ送れる可能性がある。

### 変更可能事項

- release 名称
- Micro Release の粒度
- 添付ファイルのフォルダ粒度
- KPI 候補抽出の scoring 方式
- host 側 UI の実装様式

## 成功条件

- manager の断片メモが project 文脈を失わず PC へ同期される。
- 近接時の同期と認証の主導線が、人の明示操作をほぼ要求しない。
- 1 問ずつの質問生成が、入力コストを増やさずに文脈密度を上げる。
- KPI 候補が、元ログと質問履歴へ遡れる形で提示される。
- Android / Windows / WSL2 / Docker の責務分離が source-of-truth 上で明確である。
