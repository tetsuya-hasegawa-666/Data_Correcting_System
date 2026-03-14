# UX Check Work Flow

## Purpose

This document defines how the replacement-camera stack will be validated once implementation begins.

## Evaluation Focus

- recording can start and stop reliably
- preview continuity remains acceptable during capture
- `ARCore ON` no longer introduces multi-second camera stalls
- output artifacts remain contract-compatible with `iSensorium`

## First UX Route For Later Sessions

1. build and install the isolated prototype
2. start one short recording with `ARCore OFF`
3. start one short recording with `ARCore ON`
4. compare preview continuity and saved session artifacts
5. compare continuity metrics against frozen baseline

## Expected Evidence

- session directory path
- file list
- continuity metrics
- explicit judgment: better than frozen baseline or not

