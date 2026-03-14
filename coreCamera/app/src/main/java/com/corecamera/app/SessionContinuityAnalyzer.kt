package com.corecamera.app

import org.json.JSONArray
import org.json.JSONObject
import java.io.File

object FrozenBaselineContinuity {
    const val arcoreOffMaxGapMs = 139.6
    const val arcoreOnMaxGapMs = 2634.0
}

data class SessionAnalysis(
    val frameSampleCount: Int,
    val poseSampleCount: Int,
    val frameMaxGapMs: Double?,
    val poseMaxGapMs: Double?,
    val improvedVsFrozenArcoreOn: Boolean,
    val withinFrozenArcoreOffBand: Boolean,
    val timestampContractSatisfied: Boolean,
    val swapReadinessStatus: String,
    val blockers: List<String>,
)

object SessionContinuityAnalyzer {
    fun analyze(artifacts: SessionArtifacts): SessionAnalysis {
        val frameSamples = readFrameSamples(artifacts.frameTimestampFile)
        val poseSamples = readPoseSamples(artifacts.arcoreFile)

        val frameSensorTimestamps = frameSamples.map { it.sensorTimestampNs }
        val poseFrameTimestamps = poseSamples.map { it.frameTimestampNs }

        val frameMaxGapMs = maxGapMs(frameSensorTimestamps)
        val poseMaxGapMs = maxGapMs(poseFrameTimestamps)

        val timestampContractSatisfied =
            frameSamples.isNotEmpty() &&
                isMonotonic(frameSensorTimestamps) &&
                isMonotonic(frameSamples.map { it.elapsedRealtimeNs }) &&
                isMonotonic(frameSamples.map { it.sessionElapsedNs }) &&
                frameSamples.all { it.sessionElapsedNs >= 0L } &&
                poseSamples.all { it.sessionElapsedNs >= 0L } &&
                isMonotonic(poseFrameTimestamps) &&
                isMonotonic(poseSamples.map { it.elapsedRealtimeNs }) &&
                isMonotonic(poseSamples.map { it.sessionElapsedNs })

        val improvedVsFrozenArcoreOn = frameMaxGapMs?.let { it < FrozenBaselineContinuity.arcoreOnMaxGapMs } ?: false
        val withinFrozenArcoreOffBand = frameMaxGapMs?.let { it <= FrozenBaselineContinuity.arcoreOffMaxGapMs } ?: false

        val blockers = buildList {
            if (frameSamples.size < 2) {
                add("insufficient video frame timestamp evidence")
            }
            if (poseSamples.size < 2) {
                add("insufficient arcore pose evidence")
            }
            if (!timestampContractSatisfied) {
                add("timestamp contract continuity failed")
            }
            if (!improvedVsFrozenArcoreOn) {
                add("camera continuity did not beat frozen ARCore ON baseline")
            }
        }

        return SessionAnalysis(
            frameSampleCount = frameSamples.size,
            poseSampleCount = poseSamples.size,
            frameMaxGapMs = frameMaxGapMs,
            poseMaxGapMs = poseMaxGapMs,
            improvedVsFrozenArcoreOn = improvedVsFrozenArcoreOn,
            withinFrozenArcoreOffBand = withinFrozenArcoreOffBand,
            timestampContractSatisfied = timestampContractSatisfied,
            swapReadinessStatus = if (blockers.isEmpty()) "READY" else "BLOCKED",
            blockers = blockers,
        )
    }

    fun toJson(analysis: SessionAnalysis): JSONObject =
        JSONObject()
            .put(
                "continuityValidation",
                JSONObject()
                    .put("frameSampleCount", analysis.frameSampleCount)
                    .put("poseSampleCount", analysis.poseSampleCount)
                    .put("frameMaxGapMs", analysis.frameMaxGapMs)
                    .put("poseMaxGapMs", analysis.poseMaxGapMs)
                    .put("improvedVsFrozenArcoreOn", analysis.improvedVsFrozenArcoreOn)
                    .put("withinFrozenArcoreOffBand", analysis.withinFrozenArcoreOffBand)
                    .put(
                        "frozenBaseline",
                        JSONObject()
                            .put("arcoreOffMaxGapMs", FrozenBaselineContinuity.arcoreOffMaxGapMs)
                            .put("arcoreOnMaxGapMs", FrozenBaselineContinuity.arcoreOnMaxGapMs),
                    ),
            )
            .put(
                "timestampContract",
                JSONObject()
                    .put("satisfied", analysis.timestampContractSatisfied)
                    .put("timebase", "elapsedRealtimeNanos + per-session monotonic origin"),
            )
            .put(
                "swapReadiness",
                JSONObject()
                    .put("status", analysis.swapReadinessStatus)
                    .put("blockers", JSONArray(analysis.blockers)),
            )

    private fun readFrameSamples(file: File): List<FrameSample> {
        if (!file.exists() || file.length() == 0L) {
            return emptyList()
        }
        return file.useLines { lines ->
            lines
                .drop(1)
                .mapNotNull { line ->
                    val columns = line.split(',')
                    if (columns.size < 5) {
                        return@mapNotNull null
                    }
                    val sensorTimestampNs = columns[0].toLongOrNull()
                    val elapsedRealtimeNs = columns[1].toLongOrNull()
                    val sessionElapsedNs = columns[4].toLongOrNull()
                    if (sensorTimestampNs == null || elapsedRealtimeNs == null || sessionElapsedNs == null || sensorTimestampNs < 0L) {
                        return@mapNotNull null
                    }
                    FrameSample(sensorTimestampNs, elapsedRealtimeNs, sessionElapsedNs)
                }
                .toList()
        }
    }

    private fun readPoseSamples(file: File): List<PoseSample> {
        if (!file.exists() || file.length() == 0L) {
            return emptyList()
        }
        return file.useLines { lines ->
            lines.mapNotNull { line ->
                val frameTimestampNs = extractLong(line, "frameTimestampNs")
                val elapsedRealtimeNs = extractLong(line, "elapsedRealtimeNanos")
                val sessionElapsedNs = extractLong(line, "sessionElapsedNanos")
                if (frameTimestampNs < 0L || elapsedRealtimeNs < 0L || sessionElapsedNs < 0L) {
                    return@mapNotNull null
                }
                PoseSample(frameTimestampNs, elapsedRealtimeNs, sessionElapsedNs)
            }.toList()
        }
    }

    private fun maxGapMs(values: List<Long>): Double? =
        values.zipWithNext()
            .map { (left, right) -> (right - left) / 1_000_000.0 }
            .maxOrNull()

    private fun isMonotonic(values: List<Long>): Boolean =
        values.zipWithNext().all { (left, right) -> right >= left }

    private fun extractLong(line: String, key: String): Long {
        val match = """"$key":(-?\d+)""".toRegex().find(line) ?: return -1L
        return match.groupValues[1].toLongOrNull() ?: -1L
    }

    private data class FrameSample(
        val sensorTimestampNs: Long,
        val elapsedRealtimeNs: Long,
        val sessionElapsedNs: Long,
    )

    private data class PoseSample(
        val frameTimestampNs: Long,
        val elapsedRealtimeNs: Long,
        val sessionElapsedNs: Long,
    )
}
