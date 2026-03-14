# North Star

Build a `Camera2 + ARCore Shared Camera` camera subsystem that:

- preserves the current `iSensorium` recording contract
- avoids the `CameraX + ARCore` camera-path stall confirmed in `iSensorium`
- remains isolated until replacement-readiness is demonstrated

## User Value

- keep `ARCore` available only if it can coexist with stable video capture
- avoid multi-second camera stalls during recording
- preserve downstream parser and validation assumptions so later integration cost stays bounded

## Freeze Context

- the current `iSensorium` mainline is frozen because `CameraX + ARCore` reproduced camera-path stalls under `ARCore ON`
- this project exists to test the replacement route, not to debate whether the frozen evidence was sufficient
