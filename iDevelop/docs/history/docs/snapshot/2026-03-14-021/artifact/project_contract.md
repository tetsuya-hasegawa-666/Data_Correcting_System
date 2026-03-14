# Project Contract

## Purpose

この文書は、`iDevelop` を他 project にコピーして使うための最小 contract を定義する。

## Contract Goal

- project ごとの path 基準を明確にする
- document / data / code を同じ contract で扱う
- 子、孫、その先の directory まで再帰読込できる
- path boundary と read-only safety を固定する

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
| `projectRoot` | string | すべての読込基準となる root path |
| `documentRoots` | string[] | document workspace が再帰読込する root |
| `dataRoots` | string[] | data workspace が再帰読込する root |
| `codeRoots` | string[] | code workspace が再帰読込する root。`src` `scripts` `tools` を含めてよい |
| `ignoreGlobs` | string[] | 読込対象外にする path pattern |
| `readOnly` | boolean | live 接続時の safety flag。最初は `true` 固定 |

## Recursive Read Rule

- 各 root は再帰的に読む
- child / grandchild / deeper directory も同一規則で扱う
- root 外の path は拒否する
- missing root は warning 扱いとし、致命失敗にはしない
- ignore globs に一致する directory segment は除外する

## Naming Stability Rule

- manifest field 名は一度採用したら継続利用する
- workspace 名、status 名、artifact 名は docs / develop / history で統一する

## Safety Boundary

- live connection は read-only first とする
- projectRoot 外の path は読まない
- code workspace は read-only のまま扱い、実行や attach を許可しない
