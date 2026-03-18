# ストーリーとリリース対応表

## 目的

user story と release line の対応を俯瞰する正本とする。

## ストーリー層

1. 数秒でメモを残せる
2. テキスト、音声、写真を同一文脈に束ねられる
3. 保存ボタン未押下でも端末内に自動で仮保存される
4. 端末上で一覧 sort と閲覧履歴からメモを見返せる
5. 近接時に自動同期される
6. PC 側で project 文脈に再配置される
7. AI が一問一葉で次問を返せる
8. KPI 候補と根拠ログが提示される

## MRL 対応

| story cluster | MRL | delivered value |
|---|---|---|
| foundation | `MRL-0` | 独立 project 初期化、主体アーキテクチャ、schema baseline |
| connectivity | `MRL-1` | mDNS、MAC whitelist、Syncthing Docker、Tailscale option |
| interaction | `MRL-2` | one-question UI、multimodal capture、auto-save、端末内一覧 / 履歴 |
| intelligence | `MRL-3` | Whisper、Ollama / LocalAI、KPI candidate |
| hardening | `MRL-4` | security、retry、review evidence |
