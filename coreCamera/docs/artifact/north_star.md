# North Star

次を満たす `Camera2 + ARCore Shared Camera` camera subsystem を構築する:

- 現在の `iSensorium` recording contract を維持する
- `iSensorium` で確認された `CameraX + ARCore` の camera-path stall を回避する
- replacement readiness が示されるまで isolated のまま保つ

## User Value

- stable な video capture と両立できる場合にのみ `ARCore` を維持する
- recording 中の multi-second camera stall を避ける
- downstream parser と validation assumptions を維持し、後の integration cost を抑える

## Freeze Context

- 現在の `iSensorium` mainline は、`CameraX + ARCore` が `ARCore ON` 下で camera-path stall を再現したため凍結されている
- この project は replacement route を検証するためのものであり、凍結済み evidence が十分だったかを再議論するためのものではない
