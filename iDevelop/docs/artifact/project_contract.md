# Project Contract

## Purpose

この文書は、`iDevelop` を他 project にコピーして使うための最小 contract を定義する。

## Contract Goal

- project ごとの path 差異を吸収できる
- document / data / code を同じ contract で扱える
- 子、孫、それ以降の directory を再帰的に走査できる
- path boundary と read-only safety を先に固定できる

## Manifest Schema

```json
{
  "projectId": "sample-project",
  "projectRoot": "C:/path/to/project",
  "documentRoots": ["docs", "develop"],
  "dataRoots": ["data"],
  "codeRoots": ["src", "scripts"],
  "ignoreGlobs": ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/build/**"],
  "readOnly": true
}
```

## Required Fields

| field | type | meaning |
|---|---|---|
| `projectId` | string | project を識別する固定 ID |
| `projectRoot` | string | 読込基準となる root path |
| `documentRoots` | string[] | document workspace が再帰走査する root |
| `dataRoots` | string[] | data workspace が再帰走査する root |
| `codeRoots` | string[] | code workspace が再帰走査する root |
| `ignoreGlobs` | string[] | 読込対象外にする path pattern |
| `readOnly` | boolean | 実体接続時の safety flag。最初は常に `true` |

## Recursive Read Rule

- 各 root は存在する限り再帰的に走査する。
- 子 directory、孫 directory、その先の深さも同じ規則で扱う。
- root 配下の項目数は固定しない。
- 存在しない root は error で止めず、missing root として扱う。
- ignore に一致する path は最初から除外する。

## Naming Stability Rule

- manifest field 名は一度採用したら継続利用する。
- document / data / code の workspace 名も既存表記を維持する。
- status 名や成果物名を変更する場合は docs / develop / history を同時更新する。

## Safety Boundary

- 最初の live connection は read-only で開始する。
- projectRoot 外の path は読まない。
- code workspace は read-only のまま保持する。
