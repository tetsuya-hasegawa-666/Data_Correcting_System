package com.corecamera.app

import org.junit.Assert.assertEquals
import org.junit.Test

class SharedCameraLifecycleMachineTest {
    @Test
    fun previewStartRunStop_sequence_is_valid() {
        val machine = SharedCameraLifecycleMachine()

        machine.markPreviewReady()
        machine.beginStart()
        machine.markRunning()
        machine.beginStop()
        machine.markStopped()

        assertEquals(SharedCameraLifecycleState.STOPPED, machine.state)
    }

    @Test(expected = IllegalArgumentException::class)
    fun beginStart_requiresPreviewReady() {
        SharedCameraLifecycleMachine().beginStart()
    }
}
