# North Star

## Human Goal

`iDevelop` は、`iSensorium` の文書、session archive、export metadata を、人が迷わず確認し、必要なものを 1 ボタンで取り出せる backend UI として機能する。

## Non-Negotiables

- MVC を崩さない
- operator-facing wording は自然な日本語を優先する
- file 名、class 名、API 名、config key はアルファベットを維持する
- viewer / explorer / download / consultation すべてで詳細 error handling を持つ
- completion evidence は既定で `Codex retest`
- user が検証できた旨を示した場合は `user validation` を採用可能

## Current Success Criteria

- session archive を compact explorer で選べる
- selected archive の session contract と files を preview で確認できる
- download を 1 ボタンで実行できる
- empty / warning / error state が operator に明確に見える
