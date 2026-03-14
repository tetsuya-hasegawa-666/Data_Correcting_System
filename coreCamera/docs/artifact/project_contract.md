# Project Contract

## Purpose

This project exists to replace the current `iSensorium` camera implementation without changing downstream assumptions.

## Required Inputs

- start/stop recording lifecycle
- camera sensor frames
- ARCore shared camera session
- optional sensor streams later aligned with `iSensorium`

## Required Outputs

- session-oriented file tree
- file names compatible with `iSensorium`
- timestamp contract based on monotonic alignment
- manifest carrying enough metadata for later parser compatibility

## Explicit Non-Goals In The Isolated Phase

- editing `iSensorium/app/`
- redesigning end-user UX inside `iSensorium`
- changing existing release-line governance

