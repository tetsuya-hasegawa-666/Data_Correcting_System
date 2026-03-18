# current state

## 現在の状態

- active plan set: `2026-03-17-001 manager context collection foundation`
- active market release: `none`
- active micro release: `none`
- latest completed release: `MRL-8 clone-first workspace line`
- current target pair: `Xperia 5 III + Windows Tezy-GT37`

## 現在できていること

- mobile / desktop の両方で clone-first workspace を持つ
- compact status label と footer counts を採用した
- mobile / desktop の両方で `auto save` `auto sync` と interval を設定できる
- mobile / desktop の両方で delete を実行できる
- host app API から entry create / settings update / delete を実行できる
- bridge が memo、settings、delete、question の payload を扱う
- UX 自動検証レポートを process 正本として保持する

## 直近の確認

- `GET /api/workspace/bootstrap` が settings と records を返す
- `POST /api/workspace/entries` で desktop entry を作成できる
- `POST /api/workspace/settings` で `10s / 1m` 設定を反映できる
- `DELETE /api/workspace/entries/{entryId}` で record count を減らせる
- Android asset sync、APK build / install / launch を確認した

## 未解決

- mobile 実機で create / delete / settings を人手で一巡する最終確認
- Docker Desktop 自動起動の不安定さ
