# Documentation Index

`coreCamera/` is a standalone replacement-camera project dedicated to a `Camera2 + ARCore Shared Camera` implementation that can later replace the current `iSensorium` camera spine.

## Position

- project status: prepared, implementation not started
- entry point for next session: `coreCamera/develop/index.md`
- integration target: future replacement of the current `iSensorium` camera implementation

## Boundary Rule

- do not modify `iSensorium/` implementation from this project during the isolated build phase
- do not modify `iDevelop/` implementation from this project
- preserve the current `iSensorium` in/out contract so the replacement can be swapped in later

