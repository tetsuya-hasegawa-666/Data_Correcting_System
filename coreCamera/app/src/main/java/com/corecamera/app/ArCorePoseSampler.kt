package com.corecamera.app

import android.opengl.EGL14
import android.opengl.EGLConfig
import android.opengl.EGLContext
import android.opengl.EGLDisplay
import android.opengl.EGLSurface
import android.opengl.GLES11Ext
import android.opengl.GLES20
import android.os.Handler
import com.google.ar.core.Session

class ArCorePoseSampler(
    private val handler: Handler,
    private val artifactStore: SessionArtifactStore,
    private val artifacts: SessionArtifacts,
) {
    private var session: Session? = null
    private var running = false
    private var lastFrameTimestampNs = -1L

    private var eglDisplay: EGLDisplay = EGL14.EGL_NO_DISPLAY
    private var eglContext: EGLContext = EGL14.EGL_NO_CONTEXT
    private var eglSurface: EGLSurface = EGL14.EGL_NO_SURFACE
    private var cameraTextureId = 0

    private val samplingRunnable = object : Runnable {
        override fun run() {
            if (!running) {
                return
            }
            val arSession = session
            if (arSession != null) {
                runCatching {
                    makeCurrent()
                    val frame = arSession.update()
                    val timestampNs = frame.timestamp
                    if (timestampNs > 0L && timestampNs != lastFrameTimestampNs) {
                        val camera = frame.camera
                        val pose = camera.pose
                        artifactStore.appendArCorePose(
                            artifacts = artifacts,
                            frameTimestampNs = timestampNs,
                            trackingState = camera.trackingState.name,
                            translation = pose.translation,
                            rotationQuaternion = pose.rotationQuaternion,
                        )
                        lastFrameTimestampNs = timestampNs
                    }
                }
            }
            handler.postDelayed(this, SAMPLE_INTERVAL_MS)
        }
    }

    fun start(session: Session) {
        if (running) {
            return
        }
        running = true
        this.session = session
        handler.post {
            if (!running) {
                return@post
            }
            initializeGl(session)
            handler.post(samplingRunnable)
        }
    }

    fun stop() {
        running = false
        handler.removeCallbacks(samplingRunnable)
        handler.post {
            releaseGl()
            session = null
            lastFrameTimestampNs = -1L
        }
    }

    private fun initializeGl(session: Session) {
        eglDisplay = EGL14.eglGetDisplay(EGL14.EGL_DEFAULT_DISPLAY)
        check(eglDisplay != EGL14.EGL_NO_DISPLAY) { "Unable to acquire EGL display for ARCore pose sampling." }
        val eglVersion = IntArray(2)
        check(EGL14.eglInitialize(eglDisplay, eglVersion, 0, eglVersion, 1)) {
            "Unable to initialize EGL for ARCore pose sampling."
        }

        val config = chooseConfig()
        eglContext = EGL14.eglCreateContext(
            eglDisplay,
            config,
            EGL14.EGL_NO_CONTEXT,
            intArrayOf(EGL14.EGL_CONTEXT_CLIENT_VERSION, 2, EGL14.EGL_NONE),
            0,
        )
        check(eglContext != EGL14.EGL_NO_CONTEXT) { "Unable to create EGL context for ARCore pose sampling." }

        eglSurface = EGL14.eglCreatePbufferSurface(
            eglDisplay,
            config,
            intArrayOf(EGL14.EGL_WIDTH, 1, EGL14.EGL_HEIGHT, 1, EGL14.EGL_NONE),
            0,
        )
        check(eglSurface != EGL14.EGL_NO_SURFACE) { "Unable to create EGL surface for ARCore pose sampling." }
        makeCurrent()

        val textureIds = IntArray(1)
        GLES20.glGenTextures(1, textureIds, 0)
        cameraTextureId = textureIds[0]
        GLES20.glBindTexture(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, cameraTextureId)
        GLES20.glTexParameteri(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, GLES20.GL_TEXTURE_MIN_FILTER, GLES20.GL_LINEAR)
        GLES20.glTexParameteri(GLES11Ext.GL_TEXTURE_EXTERNAL_OES, GLES20.GL_TEXTURE_MAG_FILTER, GLES20.GL_LINEAR)
        session.setCameraTextureNames(intArrayOf(cameraTextureId))
    }

    private fun chooseConfig(): EGLConfig {
        val configs = arrayOfNulls<EGLConfig>(1)
        val configCount = IntArray(1)
        val attributes = intArrayOf(
            EGL14.EGL_RENDERABLE_TYPE, EGL14.EGL_OPENGL_ES2_BIT,
            EGL14.EGL_SURFACE_TYPE, EGL14.EGL_PBUFFER_BIT,
            EGL14.EGL_RED_SIZE, 8,
            EGL14.EGL_GREEN_SIZE, 8,
            EGL14.EGL_BLUE_SIZE, 8,
            EGL14.EGL_ALPHA_SIZE, 8,
            EGL14.EGL_NONE,
        )
        check(EGL14.eglChooseConfig(eglDisplay, attributes, 0, configs, 0, configs.size, configCount, 0)) {
            "Unable to choose EGL config for ARCore pose sampling."
        }
        return checkNotNull(configs[0]) { "No EGL config available for ARCore pose sampling." }
    }

    private fun makeCurrent() {
        check(EGL14.eglMakeCurrent(eglDisplay, eglSurface, eglSurface, eglContext)) {
            "Unable to make EGL context current for ARCore pose sampling."
        }
    }

    private fun releaseGl() {
        if (cameraTextureId != 0) {
            GLES20.glDeleteTextures(1, intArrayOf(cameraTextureId), 0)
            cameraTextureId = 0
        }
        if (eglDisplay != EGL14.EGL_NO_DISPLAY) {
            EGL14.eglMakeCurrent(
                eglDisplay,
                EGL14.EGL_NO_SURFACE,
                EGL14.EGL_NO_SURFACE,
                EGL14.EGL_NO_CONTEXT,
            )
        }
        if (eglSurface != EGL14.EGL_NO_SURFACE) {
            EGL14.eglDestroySurface(eglDisplay, eglSurface)
            eglSurface = EGL14.EGL_NO_SURFACE
        }
        if (eglContext != EGL14.EGL_NO_CONTEXT) {
            EGL14.eglDestroyContext(eglDisplay, eglContext)
            eglContext = EGL14.EGL_NO_CONTEXT
        }
        if (eglDisplay != EGL14.EGL_NO_DISPLAY) {
            EGL14.eglTerminate(eglDisplay)
            eglDisplay = EGL14.EGL_NO_DISPLAY
        }
    }

    private companion object {
        const val SAMPLE_INTERVAL_MS = 33L
    }
}
