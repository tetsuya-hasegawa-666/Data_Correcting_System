package com.corecamera.app

import android.Manifest
import android.os.Build
import org.json.JSONArray
import org.json.JSONObject
import java.io.File

data class UpstreamTrialPackage(
    val status: String,
    val packageVersion: String,
    val adapterSeamId: String,
    val requiredArtifacts: List<String>,
    val preservedOperations: List<String>,
    val requiredRuntimePermissions: List<String>,
    val rollbackRule: String,
    val evidenceSessionId: String,
    val blockers: List<String>,
)

object UpstreamTrialPackagePlanner {
    private const val packageVersion = "upstream-trial-package/v1"

    fun build(artifacts: SessionArtifacts, analysis: SessionAnalysis): UpstreamTrialPackage {
        val blockers = buildList {
            if (analysis.swapReadinessStatus != "READY") {
                addAll(analysis.blockers)
            }
            requiredArtifactFiles(artifacts).forEach { file ->
                if (!file.exists() || file.length() == 0L) {
                    add("missing required artifact: ${file.name}")
                }
            }
        }.distinct()

        return UpstreamTrialPackage(
            status = if (blockers.isEmpty()) "READY" else "BLOCKED",
            packageVersion = packageVersion,
            adapterSeamId = ReplacementCameraContract.adapterSeamId,
            requiredArtifacts = ReplacementCameraContract.requiredFileNames,
            preservedOperations = listOf("startSession", "stopSession", "findLatestSession"),
            requiredRuntimePermissions = buildRequiredPermissions(),
            rollbackRule = "keep the frozen CameraX + ARCore path restorable behind the adapter seam until the guarded upstream trial is accepted",
            evidenceSessionId = artifacts.sessionId,
            blockers = blockers,
        )
    }

    fun toJson(pkg: UpstreamTrialPackage): JSONObject =
        JSONObject()
            .put("status", pkg.status)
            .put("packageVersion", pkg.packageVersion)
            .put("adapterSeamId", pkg.adapterSeamId)
            .put("requiredArtifacts", JSONArray(pkg.requiredArtifacts))
            .put("preservedOperations", JSONArray(pkg.preservedOperations))
            .put("requiredRuntimePermissions", JSONArray(pkg.requiredRuntimePermissions))
            .put("rollbackRule", pkg.rollbackRule)
            .put("evidenceSessionId", pkg.evidenceSessionId)
            .put("blockers", JSONArray(pkg.blockers))

    private fun requiredArtifactFiles(artifacts: SessionArtifacts): List<File> = listOf(
        artifacts.manifestFile,
        artifacts.videoFile,
        artifacts.imuFile,
        artifacts.gnssFile,
        artifacts.bleFile,
        artifacts.arcoreFile,
        artifacts.frameTimestampFile,
        artifacts.videoEventsFile,
    )

    private fun buildRequiredPermissions(): List<String> = buildList {
        add(Manifest.permission.CAMERA)
        add(Manifest.permission.ACCESS_FINE_LOCATION)
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
            add(Manifest.permission.BLUETOOTH_SCAN)
            add(Manifest.permission.BLUETOOTH_CONNECT)
        }
    }
}
