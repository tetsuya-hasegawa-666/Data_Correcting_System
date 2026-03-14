package com.isensorium.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
import android.os.SystemClock
import android.widget.Toast
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.camera.core.CameraSelector
import androidx.core.content.ContextCompat
import com.isensorium.app.databinding.ActivityMainBinding
import java.util.Locale

class MainActivity : AppCompatActivity() {

    private lateinit var binding: ActivityMainBinding
    private lateinit var recordingCoordinator: RecordingCoordinator
    private var currentSession: RecordingSession? = null

    private val permissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestMultiplePermissions()) { result ->
            val requiredGranted = requiredPermissions.all {
                result[it] == true || ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
            }
            if (requiredGranted) {
                startCamera()
            } else {
                renderState("Camera / audio permission is required to start recording sessions.")
            }
        }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        recordingCoordinator = RecordingCoordinator(
            context = applicationContext,
            lifecycleOwner = this,
            previewView = binding.previewView,
            arCoreGlSurfaceView = binding.arCoreGlSurfaceView,
            statusListener = ::onSessionStateChanged,
        )

        binding.recordButton.setOnClickListener {
            if (recordingCoordinator.isRecording()) {
                recordingCoordinator.stopSession()
            } else {
                ensurePermissionsAndStart()
            }
        }

        binding.refreshButton.setOnClickListener {
            refreshLatestSessionDetails()
        }
        binding.advancedSensorsSwitch.setOnCheckedChangeListener { _, isChecked ->
            recordingCoordinator.setAdvancedSensorsEnabled(isChecked)
            renderModeState(isChecked)
        }

        renderState("Ready. Start mRL-0-1 session initialization.")
        renderModeState(false)
        ensurePermissionsAndStartPreview()
    }

    override fun onDestroy() {
        recordingCoordinator.shutdown()
        super.onDestroy()
    }

    override fun onResume() {
        super.onResume()
        recordingCoordinator.onHostResume()
    }

    override fun onPause() {
        recordingCoordinator.onHostPause()
        super.onPause()
    }

    private fun ensurePermissionsAndStartPreview() {
        if (hasRequiredPermissions()) {
            startCamera()
        } else {
            permissionLauncher.launch(allRequestedPermissions)
        }
    }

    private fun ensurePermissionsAndStart() {
        if (hasRequiredPermissions()) {
            recordingCoordinator.setAdvancedSensorsEnabled(binding.advancedSensorsSwitch.isChecked)
            recordingCoordinator.startSession()
        } else {
            permissionLauncher.launch(allRequestedPermissions)
        }
    }

    private fun hasRequiredPermissions(): Boolean =
        requiredPermissions.all {
            ContextCompat.checkSelfPermission(this, it) == PackageManager.PERMISSION_GRANTED
        }

    private fun startCamera() {
        recordingCoordinator.startPreview(CameraSelector.DEFAULT_BACK_CAMERA)
    }

    private fun onSessionStateChanged(state: SessionUiState) {
        runOnUiThread {
            currentSession = state.session
            binding.recordButton.text =
                if (state.recording) getString(R.string.stop_recording) else getString(R.string.start_recording)
            binding.advancedSensorsSwitch.isEnabled = !state.recording
            renderState(state.statusText)
            refreshSessionDetails(state.session)
            state.toastMessage?.let {
                Toast.makeText(this, it, Toast.LENGTH_SHORT).show()
            }
        }
    }

    private fun renderState(message: String) {
        binding.statusText.text = message
    }

    private fun renderModeState(advancedSensorsEnabled: Boolean) {
        binding.recordingModeText.text =
            if (advancedSensorsEnabled) {
                "Mode: Extended recording. Video + IMU + GNSS + BLE + ARCore. Beta stability."
            } else {
                "Mode: Stable recording. Video + IMU only. Recommended for UX check."
            }
    }

    private fun refreshLatestSessionDetails() {
        val refreshed = recordingCoordinator.findLatestSession()
        currentSession = refreshed ?: currentSession
        refreshSessionDetails(currentSession)
        renderState(
            if (currentSession == null) {
                "No saved session found yet."
            } else {
                "Latest session reloaded from storage."
            },
        )
    }

    private fun refreshSessionDetails(session: RecordingSession?) {
        if (session == null) {
            binding.sessionText.text = "No active session."
            binding.filesText.text = ""
            return
        }

        val sessionElapsedSec =
            if (session.timebase.sessionStartElapsedRealtimeNanos > 0L) {
                (SystemClock.elapsedRealtimeNanos() - session.timebase.sessionStartElapsedRealtimeNanos) / 1_000_000_000.0
            } else {
                -1.0
            }
        val summary = buildString {
            appendLine("Session: ${session.sessionId}")
            appendLine("Directory: ${session.sessionDir.absolutePath}")
            appendLine(
                "Started: wall=${session.timebase.sessionStartWallTimeMs} ms, mono=${session.timebase.sessionStartElapsedRealtimeNanos} ns",
            )
            if (sessionElapsedSec >= 0.0) {
                appendLine(String.format(Locale.US, "Elapsed since start: %.1f sec", sessionElapsedSec))
            }
        }.trim()

        val fileLines = session.listOutputFiles().joinToString("\n") { file ->
            String.format(
                Locale.US,
                "%s (%d bytes)",
                file.name,
                file.length(),
            )
        }

        binding.sessionText.text = summary
        binding.filesText.text = fileLines.ifBlank { "No session outputs yet." }
    }

    companion object {
        private val requiredPermissions = arrayOf(
            Manifest.permission.CAMERA,
            Manifest.permission.RECORD_AUDIO,
        )

        private val optionalPermissions = arrayOf(
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_CONNECT,
        )

        private val allRequestedPermissions = requiredPermissions + optionalPermissions
    }
}
