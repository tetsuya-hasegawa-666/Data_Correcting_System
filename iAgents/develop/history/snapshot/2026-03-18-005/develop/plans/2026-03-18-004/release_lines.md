# 2026-03-18-004 release lines

## 位置づけ

このファイルを `iAgents` の implementation roadmap 用 release line 正本とする。  
最新 plan set では、MRL と mRL を分断せず、この 1 ファイルですべて参照できる構成に統一する。

prototype line の `MRL-5` から `MRL-9` を完了済みとし、当初に構想した Excel UX 改善を本実装して確認する line を `MRL-10` から順次進める。

## Active Targets

- active market release target: `MRL-10 shadow bar operationalization line`
- active micro release target: `mRL-10-1 launcher, shortcut, and auto-open stabilization`
- latest completed market release target: `MRL-9 semantic shadow assist prototype line`
- latest completed micro release target: `mRL-9-1 semantic intent assist prototype`

## Release Lines

### MRL-10 shadow bar operationalization line

- status: `in_progress`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-004`
- delivered value:
  launcher、desktop shortcut、Excel Online 検知、companion open を 1 click 起動に寄せる。

#### mRL-10-1 launcher, shortcut, and auto-open stabilization

- status: `in_progress`
- result:
  1 click 起動、前面表示、Excel Online 検知、companion open の起動体験を安定化する。

#### mRL-10-2 startup diagnostics and fallback route

- status: `planned`
- result:
  debug launcher、health check、fallback open 導線を用意し、起動失敗時の回復を早くする。

### MRL-11 range pilot v2 implementation line

- status: `planned`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-004`
- delivered value:
  遠方選択の補助、視点移動の抑制、現在位置を失わない UX を本実装する。

#### mRL-11-1 range pilot interaction model

- status: `planned`
- result:
  遠方選択の操作モデル、入力 contract、確認 UI を定義して実装する。

#### mRL-11-2 range pilot confirmation run

- status: `planned`
- result:
  Excel Online 実画面で Range Pilot 実行時の current position 保持を確認する。

### MRL-12 selection recovery and smart snap line

- status: `planned`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-004`
- delivered value:
  選択履歴タイムマシンと Smart Snap を実装し、選択ミス復帰を支える。

#### mRL-12-1 selection history recovery flow

- status: `planned`
- result:
  5 世代選択履歴、復元導線、誤クリック recovery を揃える。

#### mRL-12-2 smart snap confidence tuning

- status: `planned`
- result:
  header、隣接データ、境界漏れ補正の判定を調整し、実用閾値を決める。

### MRL-13 graph shadow editor implementation line

- status: `planned`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-004`
- delivered value:
  グラフ候補提示と設定補助を実装し、深いダイアログ依存を減らす。

#### mRL-13-1 graph recommendation enrichment

- status: `planned`
- result:
  データ構造に応じた graph suggestion と設定候補を強化する。

#### mRL-13-2 graph ux validation

- status: `planned`
- result:
  グラフ作成開始から設定変更までの操作ステップ短縮を確認する。

### MRL-14 clean paste implementation line

- status: `planned`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-004`
- delivered value:
  汚いデータを Excel Online に渡す前に整える実用 flow を固める。

#### mRL-14-1 clean paste normalization hardening

- status: `planned`
- result:
  Markdown、CSV、TSV、複数表 text の正規化処理を強化する。

#### mRL-14-2 clean paste confirmation set

- status: `planned`
- result:
  before / after 例で使いやすさを確認する。

### MRL-15 data synthesizer implementation line

- status: `planned`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-004`
- delivered value:
  複数表の構造比較と統合を実用レベルへ持ち上げる。

#### mRL-15-1 synthesizer schema matching

- status: `planned`
- result:
  列名ゆれ、欠損、型差異の handling を揃える。

#### mRL-15-2 synthesizer confirmation run

- status: `planned`
- result:
  複数 dataset での統合結果を確認する。

### MRL-16 input mode halo implementation line

- status: `planned`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-004`
- delivered value:
  入力状態の気づきを補助し、入力ミスの事前防止を狙う。

#### mRL-16-1 halo state model

- status: `planned`
- result:
  入力、編集、数式、全半角などの状態モデルを定義する。

#### mRL-16-2 halo usefulness validation

- status: `planned`
- result:
  mode halo が入力事故の予防に寄与するか確認する。

### MRL-17 semantic shadow assist implementation line

- status: `planned`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-004`
- delivered value:
  自然言語の意図解釈を拡張し、safety を保った提案精度を上げる。

#### mRL-17-1 semantic command coverage expansion

- status: `planned`
- result:
  集計、検索、並び替え、グラフ化などの command coverage を増やす。

#### mRL-17-2 semantic safety guard tuning

- status: `planned`
- result:
  自動実行を避けつつ提案精度を上げる。

### MRL-18 integrated validation and evidence close line

- status: `planned`
- initial plan set: `2026-03-18-004`
- latest touch: `2026-03-18-004`
- delivered value:
  全機能の end-to-end manual validation と evidence close を揃える。

#### mRL-18-1 end-to-end manual ux check

- status: `planned`
- result:
  launcher から各機能までの通し確認を行う。

#### mRL-18-2 completion evidence close

- status: `planned`
- result:
  feature ごとの evidence、残課題、次 line を整理して閉じる。
