package com.isensorium.app

import org.junit.Assert.assertEquals
import org.junit.Assert.assertNotNull
import org.junit.Assert.assertNull
import org.junit.Assert.assertTrue
import org.junit.Test

class GuardedUpstreamTrialContractTest {

    @Test
    fun resolveKeepsFrozenRouteActiveByDefault() {
        val resolution = GuardedUpstreamTrialContract.resolve("frozen_camerax_arcore")

        assertEquals(CameraStackRoute.FROZEN_CAMERAX_ARCORE, resolution.requestedRoute)
        assertEquals(CameraStackRoute.FROZEN_CAMERAX_ARCORE, resolution.activeRoute)
        assertNull(resolution.fallbackReason)
    }

    @Test
    fun resolveFallsBackWhenReplacementRouteIsRequested() {
        val resolution = GuardedUpstreamTrialContract.resolve("corecamera_shared_camera_trial")
        val metadata = GuardedUpstreamTrialContract.buildSessionAdapterMetadata(resolution)

        assertEquals(CameraStackRoute.CORECAMERA_SHARED_CAMERA_TRIAL, resolution.requestedRoute)
        assertEquals(CameraStackRoute.FROZEN_CAMERAX_ARCORE, resolution.activeRoute)
        assertNotNull(resolution.fallbackReason)
        assertEquals("shared-camera-session-adapter", metadata.adapterSeamId)
        assertEquals("rollback-isensorium-pre-upstream-trial-2026-03-15-001", metadata.rollbackAnchorTag)
        assertTrue(metadata.preservedOperations.contains("startSession"))
    }
}
