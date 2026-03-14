# Pilot Setup Checklist

## Purpose

`iDevelop` を本番仮運用前提で起動する前に確認する固定 checklist。

## Checklist

1. `config/project-manifest.json` の `projectRoot` `documentRoots` `dataRoots` `codeRoots` が対象 project と一致している
2. `readOnly` が `true` のままである
3. `npm install` が完了している
4. `npm test` が green
5. `npm run build` が green
6. `npm run dashboard` で `http://127.0.0.1:4173/` が開ける
7. `文書` `データ` `コード` の 3 tab が開ける
8. `文書` `データ` は read-only 表示になっている
9. `コード` tab で live code/script browse が見える
10. `再読み込み` 後に refresh evidence が増える

## Stop Rule

- checklist の 1 項目でも失敗したら pilot run に進まない
- failure は evidence log に記録してから rollback note を確認する
