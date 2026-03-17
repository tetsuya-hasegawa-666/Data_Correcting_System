# 市場リリースライン計画

## 目的

`2026-03-17-006` は、consultation workspace baseline の上に、session archive viewer、compact tree explorer、one-click download、詳細 error handling を追加する。

## 計画ルール

- 作業は `iDevelop/` 配下だけで行う
- MVC 境界を維持する
- UI と operator 向けメッセージは、自然に日本語化できる箇所を極力日本語にする
- file 名、識別子、API 名、config key はアルファベットを維持する
- 完了根拠は `Codex retest` または明示された `user validation` を使う

## 市場リリースライン

| ID | 名称 | 提供価値 | 状態 |
|---|---|---|---|
| MRL-22 | archive explorer foundation line | session/export contract の受入れと compact tree explorer 基盤を固定する | active |
| MRL-23 | retrieval and download UX line | preview 中心の retrieval と one-click download 導線を固定する | pending |
| MRL-24 | MVC and resilient operator line | viewer flows の詳細 error handling と MVC hardening を固定する | pending |

## 完了条件の見方

- `MRL-22` は archive contract、compact tree explorer、`.md` directory selection が docs / develop で固定されたら閉じる
- `MRL-23` は preview-centered retrieval と one-click download flow が docs / develop で固定されたら閉じる
- `MRL-24` は MVC 境界、error state、completion evidence rule が docs / develop で固定されたら閉じる

## 現在の推奨順序

- `MRL-22 / mRL-22-1` から開始する
- `MRL-21` は completed baseline として保持する
