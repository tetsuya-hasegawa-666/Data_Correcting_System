# User Preparation

## Current External Blockers

- 現在、外部 blocker はない

## Start Preconditions For Later Sessions

- 開発は `coreCamera/` 内に隔離したまま進める
- isolated build phase の間は `iSensorium/app/` を変更しない
- 現在の `iSensorium` session in/out contract を変えない
- guarded upstream trial や長時間試験に進むときだけ、追加の target-device 操作を要求する
- 長時間試験は、発熱や熱制限を含む長時間連続動作の耐久確認を指す

## Notes

- この file には、本当に user action や外部 device access が必要な項目だけを書く
- 進行が実際に block されていない限り、ここへ他の user action を追加しない
