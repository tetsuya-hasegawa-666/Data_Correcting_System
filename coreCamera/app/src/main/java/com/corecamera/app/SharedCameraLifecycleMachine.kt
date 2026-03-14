package com.corecamera.app

enum class SharedCameraLifecycleState {
    IDLE,
    PREVIEW_READY,
    STARTING,
    RUNNING,
    STOPPING,
    STOPPED,
    ERROR,
}

class SharedCameraLifecycleMachine {
    var state: SharedCameraLifecycleState = SharedCameraLifecycleState.IDLE
        private set

    fun markPreviewReady() {
        if (
            state == SharedCameraLifecycleState.IDLE ||
            state == SharedCameraLifecycleState.STOPPED ||
            state == SharedCameraLifecycleState.ERROR
        ) {
            state = SharedCameraLifecycleState.PREVIEW_READY
        }
    }

    fun beginStart() {
        require(state == SharedCameraLifecycleState.PREVIEW_READY || state == SharedCameraLifecycleState.STOPPED) {
            "Cannot start from $state"
        }
        state = SharedCameraLifecycleState.STARTING
    }

    fun markRunning() {
        require(state == SharedCameraLifecycleState.STARTING) {
            "Cannot mark running from $state"
        }
        state = SharedCameraLifecycleState.RUNNING
    }

    fun beginStop() {
        require(state == SharedCameraLifecycleState.RUNNING || state == SharedCameraLifecycleState.STARTING) {
            "Cannot stop from $state"
        }
        state = SharedCameraLifecycleState.STOPPING
    }

    fun markStopped() {
        require(state == SharedCameraLifecycleState.STOPPING) {
            "Cannot mark stopped from $state"
        }
        state = SharedCameraLifecycleState.STOPPED
    }

    fun fail() {
        state = SharedCameraLifecycleState.ERROR
    }
}
