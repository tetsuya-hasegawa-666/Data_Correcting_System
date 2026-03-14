package com.isensorium.app

import android.Manifest
import android.content.pm.PackageManager
import android.os.Bundle
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
            if (requiredPermissions.all { result[it] == true }) {
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
            refreshSessionDetails(currentSession)
        }

        renderState("Ready. Start mRL-0-1 session initialization.")
        ensurePermissionsAndStartPreview()
    }

    override fun onDestroy() {
        recordingCoordinator.shutdown()
        super.onDestroy()
    }

    private fun ensurePermissionsAndStartPreview() {
        if (hasRequiredPermissions()) {
            startCamera()
        } else {
            permissionLauncher.launch(requiredPermissions)
        }
    }

    private fun ensurePermissionsAndStart() {
        if (hasRequiredPermissions()) {
            recordingCoordinator.startSession()
        } else {
            permissionLauncher.launch(requiredPermissions)
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

    private fun refreshSessionDetails(session: RecordingSession?) {
        if (session == null) {
            binding.sessionText.text = "No active session."
            binding.filesText.text = ""
            return
        }

        val summary = buildString {
            appendLine("Session: ${session.sessionId}")
            appendLine("Directory: ${session.sessionDir.absolutePath}")
            appendLine(
                "Started: wall=${session.timebase.sessionStartWallTimeMs} ms, mono=${session.timebase.sessionStartElapsedRealtimeNanos} ns",
            )
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
            Manifest.permission.ACCESS_FINE_LOCATION,
            Manifest.permission.BLUETOOTH_SCAN,
            Manifest.permission.BLUETOOTH_CONNECT,
        )
    }
}
