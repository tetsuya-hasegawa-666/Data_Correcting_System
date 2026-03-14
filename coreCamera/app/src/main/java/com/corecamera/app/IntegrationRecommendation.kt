package com.corecamera.app

import org.json.JSONArray
import org.json.JSONObject

data class IntegrationRecommendation(
    val status: String,
    val summary: String,
    val rationale: List<String>,
    val nextMicroRelease: String,
    val blocker: String?,
)

object IntegrationRecommendationPlanner {
    fun build(analysis: SessionAnalysis, collectorStatus: Map<String, String>): IntegrationRecommendation {
        val videoStatus = collectorStatus["video"].orEmpty()
        val hasHardVideoFailure = videoStatus.startsWith("stop_failed_") && videoStatus != "stop_failed_IllegalArgumentException"
        val ready = analysis.swapReadinessStatus == "READY" && !hasHardVideoFailure

        val rationale = buildList {
            if (analysis.improvedVsFrozenArcoreOn) {
                add("shared-camera continuity beats the frozen ARCore ON baseline on the target device")
            }
            if (analysis.withinFrozenArcoreOffBand) {
                add("frame continuity stays within the frozen ARCore OFF band")
            }
            if (analysis.timestampContractSatisfied) {
                add("timestamp contract remains monotonic and contract-compatible")
            }
            if (videoStatus == "captured_with_finalize_warning" || videoStatus == "stop_failed_IllegalArgumentException") {
                add("video output was finalized with a recoverable recorder warning")
            }
            if (hasHardVideoFailure) {
                add("video recorder reported a non-recoverable finalize failure")
            }
        }

        return if (ready) {
            IntegrationRecommendation(
                status = "RECOMMEND_GUARDED_UPSTREAM_TRIAL",
                summary = "Proceed to a guarded upstream trial while preserving the adapter seam and reversible cutover path.",
                rationale = rationale,
                nextMicroRelease = "hold",
                blocker = null,
            )
        } else {
            IntegrationRecommendation(
                status = "HOLD_REPLACEMENT",
                summary = "Do not start upstream integration yet; keep collecting replacement evidence inside coreCamera only.",
                rationale = rationale + analysis.blockers,
                nextMicroRelease = "mRL-5-1",
                blocker = analysis.blockers.firstOrNull(),
            )
        }
    }

    fun toJson(recommendation: IntegrationRecommendation): JSONObject =
        JSONObject()
            .put("status", recommendation.status)
            .put("summary", recommendation.summary)
            .put("rationale", JSONArray(recommendation.rationale))
            .put("nextMicroRelease", recommendation.nextMicroRelease)
            .put("blocker", recommendation.blocker)
}
