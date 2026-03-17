# iAgents

軽量 LLM を複数インスタンス起動し、役割分担と合意形成を使った AI 共創協働を試す独立実験 project。

## 入口

- 文書正本: `docs/index.md`
- 開発計画: `develop/index.md`
- 実行入口: `python -m iagents.cli --brief-file data/seed/session/brief.md`

## 現在の初期構成

- `src/iagents/`
  multi-agent 協働の最小 CLI と orchestration 実装
- `data/seed/`
  team config と seed brief
- `tests/`
  orchestrator の最小回帰確認

## ねらい

- 実モデル未接続でも、複数 agent が役割ごとに論点を出し、最後に統合案を返す流れをすぐ試せる
- 将来の local model / API provider 差し替え先を明確にする
