package com.corecamera.app

import android.media.MediaRecorder
import android.util.Size
import android.view.Surface
import java.io.File

class SessionVideoRecorder(
    private val outputFile: File,
    private val recordingSize: Size,
) {
    private var mediaRecorder: MediaRecorder? = null
    val surface: Surface
        get() = checkNotNull(mediaRecorder?.surface) { "MediaRecorder is not prepared." }

    fun prepare() {
        outputFile.parentFile?.mkdirs()
        if (outputFile.exists()) {
            outputFile.delete()
        }
        mediaRecorder = buildRecorder().apply { prepare() }
    }

    fun start() {
        checkNotNull(mediaRecorder).start()
    }

    fun stopAndRelease(): Long {
        val recorder = mediaRecorder ?: return outputFile.length()
        runCatching { recorder.stop() }
        recorder.reset()
        recorder.release()
        mediaRecorder = null
        return outputFile.length()
    }

    fun release() {
        mediaRecorder?.reset()
        mediaRecorder?.release()
        mediaRecorder = null
    }

    @Suppress("DEPRECATION")
    private fun buildRecorder(): MediaRecorder = MediaRecorder().apply { configure() }

    private fun MediaRecorder.configure() {
        setVideoSource(MediaRecorder.VideoSource.SURFACE)
        setOutputFormat(MediaRecorder.OutputFormat.MPEG_4)
        setOutputFile(outputFile.absolutePath)
        setVideoEncoder(MediaRecorder.VideoEncoder.H264)
        setVideoEncodingBitRate(8_000_000)
        setVideoFrameRate(30)
        setVideoSize(recordingSize.width, recordingSize.height)
    }
}
