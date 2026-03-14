# Project Contract

## Purpose

この文書は、`iDevelop` を他 project にコピーして使うための最小 contract を定義する。

## Contract Goal

- project ごとの path 起点を明確にする
- document / data / code を読める contract を統一する
- child / grandchild / deeper directory まで recursive read できるようにする
- path boundary と read-only safety を固定する
- live project の素材を consultation bundle として Codex に渡せる基礎をそろえる

## Manifest Schema

```json
{
  "projectId": "sample-project",
  "projectRoot": "C:/path/to/project",
  "documentRoots": ["docs", "develop"],
  "dataRoots": ["data"],
  "codeRoots": ["src", "scripts", "tools"],
  "ignoreGlobs": ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/build/**"],
  "readOnly": true
}
```

## Required Fields

| field | type | meaning |
|---|---|---|
| `projectId` | string | project を識別する固定 ID |
| `projectRoot` | string | すべての読み取り起点となる root path |
| `documentRoots` | string[] | document workspace が読む root |
| `dataRoots` | string[] | data workspace が読む root |
| `codeRoots` | string[] | code workspace が読む root。`src` `scripts` `tools` を想定する |
| `ignoreGlobs` | string[] | 読み取り対象外とする path pattern |
| `readOnly` | boolean | live 接続時の safety flag。初期値は `true` |

## Recursive Read Rule

- 各 root は再帰的に読む
- child / grandchild / deeper directory も同一ルールで読む
- root 外 path は拒否する
- missing root は warning 扱いとし、致命失敗にはしない
- ignore globs に一致する directory segment は除外する

## Naming Stability Rule

- manifest field 名は一度採用したら継続利用する
- workspace 名、status 名、artifact 名、docs / develop / history の名称は統一する

## Safety Boundary

- live connection は read-only first とする
- projectRoot 外の path は読まない
- code workspace は read-only のまま扱い、実行や attach を許可しない

## Consultation Interpretation Rule

- `documentRoots` `dataRoots` `codeRoots` から読まれた内容は、閲覧対象であると同時に consultation bundle の候補でもある
- bundle の具体構造、応答構造、承認状態は別途 consultation contract として定義する
- manifest schema は consultation phase でも互換性を維持する

## Consultation Contract

### Input Bundle Schema

```json
{
  "workspaceId": "document | data | code",
  "bundle": [
    {
      "id": "stable-source-id",
      "kind": "document | dataset | code",
      "label": "human-readable-name",
      "path": "docs/... or data/... or src/..."
    }
  ],
  "sourcePolicy": "existing-source-policy-name",
  "focusPrompt": "user question or focus"
}
```

### Response Contract

- `summary`
  相談対象に対する短い結論
- `evidence`
  bundle に含まれた材料から引く根拠
- `next_action`
  user が次に選べる action

### Approval State Contract

| state | meaning |
|---|---|
| `consultation-only` | document/data は相談まで。apply はまだ行わない |
| `phase-gated-read-only` | code は相談材料のみ。実行、attach、apply を許可しない |
| `approval-pending` | safe apply line で preview review 待ち |
| `approved` | apply 実行可能 |
| `cancelled` | apply request を取り下げた |
