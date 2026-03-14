# Story Release Map

## Story

Build a replacement camera subsystem that keeps `ARCore` only if it can coexist with stable video recording and preserve the existing `iSensorium` session contract.

## Release Mapping

- `MRL-0`: inherit and freeze current contract and failure evidence
- `MRL-1`: bootstrap `Camera2 + Shared Camera`
- `MRL-2`: emit contract-compatible session artifacts
- `MRL-3`: validate continuity against frozen baseline
- `MRL-4`: prepare adapter-ready swap plan
- `MRL-5`: decide integrate or drop `ARCore`

