package com.corecamera.app

import android.graphics.ImageFormat
import android.media.Image
import android.media.ImageReader
import android.media.MediaCodec
import android.media.MediaCodecInfo
import android.media.MediaFormat
import android.media.MediaMuxer
import android.os.Handler
import android.util.Size
import android.view.Surface
import java.io.File
import java.nio.ByteBuffer

class CpuImageVideoRecorder(
    private val outputFile: File,
    private val recordingSize: Size,
    private val callbackHandler: Handler,
    private val targetFrameRate: Int = 10,
) {
    private val minFrameIntervalNs = 1_000_000_000L / targetFrameRate
    private val frames = mutableListOf<VideoFrame>()
    private val frameLock = Any()

    private var imageReader: ImageReader? = null
    private var recording = false
    private var startSensorTimestampNs: Long? = null
    private var lastAcceptedTimestampNs = Long.MIN_VALUE

    val surface: Surface
        get() = checkNotNull(imageReader?.surface) { "ImageReader is not prepared." }

    fun prepare() {
        outputFile.parentFile?.mkdirs()
        if (outputFile.exists()) {
            outputFile.delete()
        }
        imageReader?.close()
        imageReader = ImageReader.newInstance(
            recordingSize.width,
            recordingSize.height,
            ImageFormat.YUV_420_888,
            3,
        ).apply {
            setOnImageAvailableListener({ reader ->
                val image = reader.acquireLatestImage() ?: return@setOnImageAvailableListener
                handleImage(image)
            }, callbackHandler)
        }
        synchronized(frameLock) {
            frames.clear()
        }
        startSensorTimestampNs = null
        lastAcceptedTimestampNs = Long.MIN_VALUE
        recording = false
    }

    fun start() {
        recording = true
    }

    fun stopAndRelease(): Long {
        recording = false
        val capturedFrames = synchronized(frameLock) { frames.toList() }
        if (capturedFrames.isNotEmpty()) {
            encodeFrames(capturedFrames)
        }
        imageReader?.close()
        imageReader = null
        synchronized(frameLock) {
            frames.clear()
        }
        startSensorTimestampNs = null
        lastAcceptedTimestampNs = Long.MIN_VALUE
        return outputFile.length()
    }

    fun release() {
        recording = false
        imageReader?.close()
        imageReader = null
        synchronized(frameLock) {
            frames.clear()
        }
        startSensorTimestampNs = null
        lastAcceptedTimestampNs = Long.MIN_VALUE
    }

    private fun handleImage(image: Image) {
        image.use { current ->
            if (!recording) {
                return
            }
            val timestampNs = current.timestamp
            if (timestampNs <= 0L) {
                return
            }
            if (lastAcceptedTimestampNs != Long.MIN_VALUE && timestampNs - lastAcceptedTimestampNs < minFrameIntervalNs) {
                return
            }
            val startTimestamp = startSensorTimestampNs ?: timestampNs.also { startSensorTimestampNs = it }
            val frameBytes = yuv420888ToI420(current)
            synchronized(frameLock) {
                frames += VideoFrame(
                    presentationTimeUs = ((timestampNs - startTimestamp) / 1_000L).coerceAtLeast(0L),
                    data = frameBytes,
                )
            }
            lastAcceptedTimestampNs = timestampNs
        }
    }

    private fun encodeFrames(capturedFrames: List<VideoFrame>) {
        val codec = MediaCodec.createEncoderByType(MediaFormat.MIMETYPE_VIDEO_AVC)
        val format = MediaFormat.createVideoFormat(
            MediaFormat.MIMETYPE_VIDEO_AVC,
            recordingSize.width,
            recordingSize.height,
        ).apply {
            setInteger(MediaFormat.KEY_COLOR_FORMAT, MediaCodecInfo.CodecCapabilities.COLOR_FormatYUV420Flexible)
            setInteger(MediaFormat.KEY_BIT_RATE, recordingSize.width * recordingSize.height * 4)
            setInteger(MediaFormat.KEY_FRAME_RATE, targetFrameRate)
            setInteger(MediaFormat.KEY_I_FRAME_INTERVAL, 1)
        }
        val bufferInfo = MediaCodec.BufferInfo()
        val muxer = MediaMuxer(outputFile.absolutePath, MediaMuxer.OutputFormat.MUXER_OUTPUT_MPEG_4)
        var trackIndex = -1
        var muxerStarted = false

        try {
            codec.configure(format, null, null, MediaCodec.CONFIGURE_FLAG_ENCODE)
            codec.start()

            for (frame in capturedFrames) {
                val inputIndex = codec.dequeueInputBuffer(TIMEOUT_US)
                if (inputIndex >= 0) {
                    codec.getInputBuffer(inputIndex)?.apply {
                        clear()
                        put(frame.data)
                    }
                    codec.queueInputBuffer(inputIndex, 0, frame.data.size, frame.presentationTimeUs, 0)
                }
                val drainState = drainCodec(codec, muxer, bufferInfo, trackIndex, muxerStarted)
                trackIndex = drainState.trackIndex
                muxerStarted = drainState.muxerStarted
            }

            val eosInputIndex = codec.dequeueInputBuffer(TIMEOUT_US)
            if (eosInputIndex >= 0) {
                codec.queueInputBuffer(eosInputIndex, 0, 0, capturedFrames.last().presentationTimeUs, MediaCodec.BUFFER_FLAG_END_OF_STREAM)
            }
            val drainState = drainCodec(codec, muxer, bufferInfo, trackIndex, muxerStarted, endOfStream = true)
            trackIndex = drainState.trackIndex
            muxerStarted = drainState.muxerStarted
        } finally {
            runCatching { codec.stop() }
            codec.release()
            if (muxerStarted && trackIndex >= 0) {
                runCatching { muxer.stop() }
            }
            muxer.release()
        }
    }

    private fun drainCodec(
        codec: MediaCodec,
        muxer: MediaMuxer,
        bufferInfo: MediaCodec.BufferInfo,
        initialTrackIndex: Int,
        initialMuxerStarted: Boolean,
        endOfStream: Boolean = false,
    ): DrainState {
        var trackIndex = initialTrackIndex
        var muxerStarted = initialMuxerStarted
        while (true) {
            val outputIndex = codec.dequeueOutputBuffer(bufferInfo, TIMEOUT_US)
            when {
                outputIndex == MediaCodec.INFO_TRY_AGAIN_LATER && !endOfStream -> return DrainState(trackIndex, muxerStarted)
                outputIndex == MediaCodec.INFO_TRY_AGAIN_LATER -> continue
                outputIndex == MediaCodec.INFO_OUTPUT_FORMAT_CHANGED -> {
                    if (!muxerStarted) {
                        trackIndex = muxer.addTrack(codec.outputFormat)
                        muxer.start()
                        muxerStarted = true
                    }
                }
                outputIndex >= 0 -> {
                    val outputBuffer = codec.getOutputBuffer(outputIndex) ?: break
                    if (bufferInfo.size > 0 && muxerStarted && trackIndex >= 0) {
                        outputBuffer.position(bufferInfo.offset)
                        outputBuffer.limit(bufferInfo.offset + bufferInfo.size)
                        muxer.writeSampleData(trackIndex, outputBuffer, bufferInfo)
                    }
                    codec.releaseOutputBuffer(outputIndex, false)
                    if ((bufferInfo.flags and MediaCodec.BUFFER_FLAG_END_OF_STREAM) != 0) {
                        return DrainState(trackIndex, muxerStarted)
                    }
                }
            }
        }
        return DrainState(trackIndex, muxerStarted)
    }

    private fun yuv420888ToI420(image: Image): ByteArray {
        val width = image.width
        val height = image.height
        val ySize = width * height
        val uvSize = width * height / 4
        val output = ByteArray(ySize + uvSize * 2)
        copyPlane(image.planes[0], width, height, output, 0, 1)
        copyPlane(image.planes[1], width / 2, height / 2, output, ySize, 1)
        copyPlane(image.planes[2], width / 2, height / 2, output, ySize + uvSize, 1)
        return output
    }

    private fun copyPlane(
        plane: Image.Plane,
        width: Int,
        height: Int,
        output: ByteArray,
        outputOffset: Int,
        outputPixelStride: Int,
    ) {
        val buffer = plane.buffer.duplicate()
        val rowStride = plane.rowStride
        val pixelStride = plane.pixelStride
        var outputIndex = outputOffset
        val rowData = ByteArray(rowStride)

        for (row in 0 until height) {
            val rowLength = if (pixelStride == 1 && outputPixelStride == 1) width else (width - 1) * pixelStride + 1
            buffer.get(rowData, 0, rowLength)
            if (pixelStride == 1 && outputPixelStride == 1) {
                System.arraycopy(rowData, 0, output, outputIndex, width)
                outputIndex += width
            } else {
                var inputIndex = 0
                repeat(width) {
                    output[outputIndex] = rowData[inputIndex]
                    outputIndex += outputPixelStride
                    inputIndex += pixelStride
                }
            }
            if (row < height - 1) {
                buffer.position(buffer.position() + rowStride - rowLength)
            }
        }
    }

    private data class VideoFrame(
        val presentationTimeUs: Long,
        val data: ByteArray,
    )

    private data class DrainState(
        val trackIndex: Int,
        val muxerStarted: Boolean,
    )

    private companion object {
        const val TIMEOUT_US = 10_000L
    }
}
