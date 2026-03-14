package com.corecamera.app

import org.json.JSONArray
import org.json.JSONObject

data class AdapterBinding(
    val preservedOperation: String,
    val replacementEntryPoint: String,
    val integrationRule: String,
)

data class CutoverStep(
    val stepId: String,
    val title: String,
    val exitCriteria: String,
)

data class IntegrationAdapterPlan(
    val adapterSeamId: String,
    val adapterPlanVersion: String,
    val readyForCutoverPlanning: Boolean,
    val currentGate: String,
    val blockers: List<String>,
    val bindings: List<AdapterBinding>,
    val cutoverSteps: List<CutoverStep>,
)

object IntegrationCutoverPlanner {
    const val adapterPlanVersion = "shared-camera-session-adapter/v1"

    val bindings = listOf(
        AdapterBinding(
            preservedOperation = "startSession",
            replacementEntryPoint = "SharedCameraSessionAdapter.startSession",
            integrationRule = "keep the outer session lifecycle signature unchanged",
        ),
        AdapterBinding(
            preservedOperation = "stopSession",
            replacementEntryPoint = "SharedCameraSessionAdapter.stopSession",
            integrationRule = "finalize contract-compatible artifacts before returning control upstream",
        ),
        AdapterBinding(
            preservedOperation = "findLatestSession",
            replacementEntryPoint = "SharedCameraSessionAdapter.findLatestSession",
            integrationRule = "preserve latest-session discovery semantics and session directory shape",
        ),
    )

    val cutoverSteps = listOf(
        CutoverStep(
            stepId = "mRL-4-1-step-1",
            title = "Bind preserved outer operations to the isolated adapter seam",
            exitCriteria = "only `startSession`, `stopSession`, and `findLatestSession` are re-routed; no UX or parser contract changes leak upstream",
        ),
        CutoverStep(
            stepId = "mRL-4-1-step-2",
            title = "Gate swap behind recorded readiness evidence",
            exitCriteria = "latest replacement session manifest reports `swapReadiness.status = READY` and no blocker remains",
        ),
        CutoverStep(
            stepId = "mRL-4-2-step-1",
            title = "Stage cutover behind a reversible toggle",
            exitCriteria = "frozen `CameraX + ARCore` path can be restored without data-shape migration",
        ),
        CutoverStep(
            stepId = "mRL-4-2-step-2",
            title = "Keep downstream consumers on the frozen artifact contract",
            exitCriteria = "file names, monotonic timestamp basis, and parser-visible manifest fields remain backward compatible",
        ),
    )

    fun buildPlan(analysis: SessionAnalysis): IntegrationAdapterPlan =
        IntegrationAdapterPlan(
            adapterSeamId = ReplacementCameraContract.adapterSeamId,
            adapterPlanVersion = adapterPlanVersion,
            readyForCutoverPlanning = analysis.swapReadinessStatus == "READY",
            currentGate = if (analysis.swapReadinessStatus == "READY") {
                "adapter_plan_ready"
            } else {
                "awaiting_blocker_clearance"
            },
            blockers = analysis.blockers,
            bindings = bindings,
            cutoverSteps = cutoverSteps,
        )

    fun buildManifestSection(analysis: SessionAnalysis): JSONObject {
        val plan = buildPlan(analysis)
        return JSONObject()
            .put("adapterSeamId", plan.adapterSeamId)
            .put("adapterPlanVersion", plan.adapterPlanVersion)
            .put("readyForCutoverPlanning", plan.readyForCutoverPlanning)
            .put("currentGate", plan.currentGate)
            .put("blockers", JSONArray(plan.blockers))
            .put(
                "bindings",
                JSONArray().apply {
                    plan.bindings.forEach { binding ->
                        put(
                            JSONObject()
                                .put("preservedOperation", binding.preservedOperation)
                                .put("replacementEntryPoint", binding.replacementEntryPoint)
                                .put("integrationRule", binding.integrationRule),
                        )
                    }
                },
            )
            .put(
                "cutoverSteps",
                JSONArray().apply {
                    plan.cutoverSteps.forEach { step ->
                        put(
                            JSONObject()
                                .put("stepId", step.stepId)
                                .put("title", step.title)
                                .put("exitCriteria", step.exitCriteria),
                        )
                    }
                },
            )
    }
}
