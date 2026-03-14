# System Blueprint

## Frozen Fact From iSensorium

- `ARCore OFF`: camera timestamp max gap about `139.6 ms`
- `ARCore ON`: camera timestamp max gap about `2634 ms`
- `IMU` remained stable in both runs
- therefore the blocking defect is in the camera path

## Target Architecture

- `Camera2`
- `ARCore Session.Feature.SHARED_CAMERA`
- adapter boundary that preserves the current `iSensorium` session in/out contract

