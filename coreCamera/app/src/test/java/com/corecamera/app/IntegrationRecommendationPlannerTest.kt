package com.corecamera.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class IntegrationRecommendationPlannerTest {
    @Test
    fun recommends_guarded_trial_when_swap_readiness_is_ready() {
        val analysis = SessionAnalysis(
            frameSampleCount = 100,
            poseSampleCount = 90,
            frameMaxGapMs = 33.3,
            poseMaxGapMs = 66.7,
            improvedVsFrozenArcoreOn = true,
            withinFrozenArcoreOffBand = true,
            timestampContractSatisfied = true,
            swapReadinessStatus = "READY",
            blockers = emptyList(),
        )

        val recommendation = IntegrationRecommendationPlanner.build(
            analysis,
            mapOf("video" to "captured"),
        )

        assertEquals("RECOMMEND_GUARDED_UPSTREAM_TRIAL", recommendation.status)
        assertEquals("hold", recommendation.nextMicroRelease)
        assertNull(recommendation.blocker)
        assertTrue(recommendation.rationale.any { it.contains("frozen ARCore ON baseline") })
    }

    @Test
    fun holds_replacement_when_hard_video_failure_remains() {
        val analysis = SessionAnalysis(
            frameSampleCount = 100,
            poseSampleCount = 90,
            frameMaxGapMs = 33.3,
            poseMaxGapMs = 66.7,
            improvedVsFrozenArcoreOn = true,
            withinFrozenArcoreOffBand = true,
            timestampContractSatisfied = true,
            swapReadinessStatus = "READY",
            blockers = emptyList(),
        )

        val recommendation = IntegrationRecommendationPlanner.build(
            analysis,
            mapOf("video" to "stop_failed_RuntimeException"),
        )

        assertEquals("HOLD_REPLACEMENT", recommendation.status)
        assertEquals("mRL-5-1", recommendation.nextMicroRelease)
        assertTrue(recommendation.rationale.any { it.contains("non-recoverable") })
    }
}
