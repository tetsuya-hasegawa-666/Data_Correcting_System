package com.corecamera.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Build
import android.os.Bundle
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.core.content.ContextCompat
import com.corecamera.app.databinding.ActivityMainBinding

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private lateinit var controller: SharedCameraSessionController
    private var lastState: SharedCameraUiState? = null

    private val permissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { result ->
            val granted = requiredPermissions.all {
                result[it] == true || ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
            }
            if (granted) {
                controller.startSession()
            } else {
                renderState(
                    SharedCameraUiState(
                        lifecycleState = SharedCameraLifecycleState.IDLE,
                        statusText = "Camera permission is required for contract-compatible shared-camera capture.",
                        currentSession = controller.findLatestSession(),
                        currentMicroRelease = "mRL-7-1",
                        nextMicroRelease = "hold",
                        blocker = "Camera permission missing",
                    ),
                )
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        controller = SharedCameraSessionController(
            context = applicationContext,
            lifecycleOwner = this,
            previewTextureView = binding.previewTextureView,
            statusListener = ::renderState,
        )

        binding.toggleButton.setOnClickListener {
            val state = lastState
            if (state?.lifecycleState == SharedCameraLifecycleState.RUNNING || state?.lifecycleState == SharedCameraLifecycleState.STARTING) {
                controller.stopSession()
            } else {
                ensurePermissionsThenStart()
            }
        }
        binding.refreshButton.setOnClickListener {
            val latest = controller.findLatestSession()
            renderState(
                SharedCameraUiState(
                    lifecycleState = SharedCameraLifecycleState.PREVIEW_READY,
                    statusText = if (latest == null) "No saved session found yet." else "Latest isolated session reloaded.",
                    currentSession = latest,
                    currentMicroRelease = "mRL-7-1",
                    nextMicroRelease = "hold",
                    blocker = null,
                ),
            )
            Toast.makeText(
                this,
                if (latest == null) "No session found" else "Session reloaded",
                Toast.LENGTH_SHORT,
            ).show()
        }

        renderState(
            SharedCameraUiState(
                lifecycleState = SharedCameraLifecycleState.IDLE,
                statusText = "Readiness check: MRL-7 implementation loaded, waiting for upstream-trial-package capture start.",
                currentSession = controller.findLatestSession(),
                currentMicroRelease = "mRL-7-1",
                nextMicroRelease = "hold",
                blocker = null,
            ),
        )
    }

    private fun ensurePermissionsThenStart() {
        if (requiredPermissions.all { ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED }) {
            controller.startSession()
        } else {
            permissionLauncher.launch(requiredPermissions)
        }
    }

    private fun renderState(state: SharedCameraUiState) {
        lastState = state
        binding.statusText.text = state.statusText
        binding.releaseLineText.text =
            "Current: ${state.currentMicroRelease}  Next: ${state.nextMicroRelease}  Blocker: ${state.blocker ?: "none"}"
        binding.sessionText.text =
            state.currentSession?.let {
                "Session: ${it.sessionId}\nDirectory: ${it.sessionDir.absolutePath}\nLifecycle: ${state.lifecycleState.name}"
            } ?: "No active session."
        binding.toggleButton.text =
            if (state.lifecycleState == SharedCameraLifecycleState.RUNNING || state.lifecycleState == SharedCameraLifecycleState.STARTING) {
                getString(R.string.stop_skeleton)
            } else {
                getString(R.string.start_skeleton)
            }
    }

    companion object {
        private val requiredPermissions: Array<String>
            get() = buildList {
                add(Manifest.permission.CAMERA)
                add(Manifest.permission.ACCESS_FINE_LOCATION)
                if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                    add(Manifest.permission.BLUETOOTH_SCAN)
                    add(Manifest.permission.BLUETOOTH_CONNECT)
                }
            }.toTypedArray()
    }
}
