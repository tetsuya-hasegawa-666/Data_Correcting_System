package com.corecamera.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertTrue
import org.junit.Test

class IntegrationCutoverPlannerTest {
    @Test
    fun manifestSection_preservesFrozenAdapterSeamAndOperations() {
        val analysis = SessionAnalysis(
            frameSampleCount = 3,
            poseSampleCount = 3,
            frameMaxGapMs = 80.0,
            poseMaxGapMs = 80.0,
            improvedVsFrozenArcoreOn = true,
            withinFrozenArcoreOffBand = true,
            timestampContractSatisfied = true,
            swapReadinessStatus = "READY",
            blockers = emptyList(),
        )

        val plan = IntegrationCutoverPlanner.buildPlan(analysis)

        assertEquals(ReplacementCameraContract.adapterSeamId, plan.adapterSeamId)
        assertEquals(3, plan.bindings.size)
        assertEquals(
            listOf("startSession", "stopSession", "findLatestSession"),
            plan.bindings.map { it.preservedOperation },
        )
        assertTrue(plan.readyForCutoverPlanning)
    }

    @Test
    fun buildPlan_carriesBlockers_whenReadinessIsBlocked() {
        val plan = IntegrationCutoverPlanner.buildPlan(
            SessionAnalysis(
                frameSampleCount = 1,
                poseSampleCount = 0,
                frameMaxGapMs = null,
                poseMaxGapMs = null,
                improvedVsFrozenArcoreOn = false,
                withinFrozenArcoreOffBand = false,
                timestampContractSatisfied = false,
                swapReadinessStatus = "BLOCKED",
                blockers = listOf("insufficient video frame timestamp evidence"),
            ),
        )

        assertEquals("awaiting_blocker_clearance", plan.currentGate)
        assertEquals("insufficient video frame timestamp evidence", plan.blockers.first())
        assertEquals(4, plan.cutoverSteps.size)
    }
}
