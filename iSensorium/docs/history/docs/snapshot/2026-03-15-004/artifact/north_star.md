# North Star

## Human Goal

Xperia 5 III 上で、動画を中心に IMU、GNSS、BLE、ARCore を時間同期付きで安定記録し、後段の自己位置推定、軌跡解析、レビュー、時空間再構成、3DGS 系処理へ再利用できる基盤を作る。

## Scope Boundary

- `iSensorium/` は source-of-truth、実開発計画、実装コード、検証補助文書を同居させる。
- source-of-truth は `docs/`、実開発判断と履歴は `develop/`、実装コードはアプリ本体配下で扱う。
- 実装開始後は、文書体系がコードと実機検証の現在地を正しく表せることを維持する。

## Non-Negotiables

- 後出し禁止。必要な論点は初期構造に先置きする。
- MVP から実運用拡張までを同じ意味体系で管理する。
- 端末負荷、発熱、通信断、権限拒否、部分欠落を常態として扱う。
- 「全部を生保存」はしない。
- ただし後段再利用性を壊す過度な情報破壊もしない。
- Market Release Line と Micro Release Line を混同しない。
- 変更可能性を前提にしつつ、変更時の意味追跡を失わない。
- 人の短周期プロンプト待ちで止まらない研究運用を前提にする。

## Invariants

### Fixed

- 基準端末は Xperia 5 III。
- 開発言語は Kotlin。
- 実装対象は Android アプリである。
- 記録信頼性は可視化の豪華さより優先する。
- 端末内一時保存、条件付き圧縮、条件付き送信の三段構造は維持する。

### Hypothesis

- Raw GNSS、Depth、uncalibrated sensor は端末制約で一部非対応の可能性がある。
- 初期の保存形式は、端末内書き込み容易性と Python 後処理容易性の両立を優先する。
- 初期 UX は評価者である開発者自身の体験検証を最優先する。

### Disposable

- 初期 release 名称
- Micro Release の粒度
- 運用上の優先順位
- 中間ファイル形式の細部

## Success Criteria For This Thread

- 文書ごとの責務境界が明確である。
- 要求群の矛盾や重複が整理されている。
- 次スレッドで A-W を迷わず埋められる。
- 変更要求が入っても、どの文書のどこを更新するか即断できる。
