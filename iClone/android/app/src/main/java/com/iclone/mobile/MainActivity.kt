package com.iclone.mobile

import android.annotation.SuppressLint
import android.net.Uri
import android.os.Bundle
import android.webkit.JavascriptInterface
import android.webkit.ValueCallback
import android.webkit.WebChromeClient
import android.webkit.WebResourceRequest
import android.webkit.WebResourceResponse
import android.webkit.WebSettings
import android.webkit.WebView
import androidx.activity.result.contract.ActivityResultContracts
import androidx.appcompat.app.AppCompatActivity
import androidx.webkit.WebViewAssetLoader
import androidx.webkit.WebViewClientCompat
import com.iclone.mobile.databinding.ActivityMainBinding
import org.json.JSONArray
import org.json.JSONObject
import java.io.File
import java.time.OffsetDateTime
import java.time.ZoneId
import java.time.format.DateTimeFormatter
import java.util.Base64

class MainActivity : AppCompatActivity() {
    private lateinit var binding: ActivityMainBinding
    private var fileChooserCallback: ValueCallback<Array<Uri>>? = null

    private val filePickerLauncher =
        registerForActivityResult(ActivityResultContracts.GetContent()) { uri ->
            val callback = fileChooserCallback ?: return@registerForActivityResult
            if (uri != null) {
                callback.onReceiveValue(arrayOf(uri))
            } else {
                callback.onReceiveValue(null)
            }
            fileChooserCallback = null
        }

    @SuppressLint("SetJavaScriptEnabled")
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        binding = ActivityMainBinding.inflate(layoutInflater)
        setContentView(binding.root)

        val assetLoader = WebViewAssetLoader.Builder()
            .addPathHandler("/assets/", WebViewAssetLoader.AssetsPathHandler(this))
            .build()

        binding.webView.settings.javaScriptEnabled = true
        binding.webView.settings.domStorageEnabled = true
        binding.webView.settings.cacheMode = WebSettings.LOAD_DEFAULT
        binding.webView.addJavascriptInterface(ICloneBridge(), "iCloneBridge")
        binding.webView.webChromeClient =
            object : WebChromeClient() {
                override fun onShowFileChooser(
                    webView: WebView,
                    filePathCallback: ValueCallback<Array<Uri>>,
                    fileChooserParams: FileChooserParams,
                ): Boolean {
                    fileChooserCallback?.onReceiveValue(null)
                    fileChooserCallback = filePathCallback
                    filePickerLauncher.launch("image/*")
                    return true
                }
            }
        binding.webView.webViewClient =
            object : WebViewClientCompat() {
                override fun shouldInterceptRequest(
                    view: WebView,
                    request: WebResourceRequest,
                ): WebResourceResponse? = assetLoader.shouldInterceptRequest(request.url)
            }
        binding.webView.loadUrl("https://appassets.androidplatform.net/assets/mobile_quick_capture.html")
    }

    override fun onBackPressed() {
        if (binding.webView.canGoBack()) {
            binding.webView.goBack()
        } else {
            super.onBackPressed()
        }
    }

    private inner class ICloneBridge {
        private val zoneId = ZoneId.systemDefault()
        private val deviceId = "xperia5iii-edge-001"
        private val projectId = "project-alpha"
        private val sessionId = "session-${timestampToken()}"
        private val rootDir = File(getExternalFilesDir(null), "iclone")
        private val localEntriesDir = File(rootDir, "local/entries")
        private val stateDir = File(rootDir, "local/state")
        private val historyFile = File(rootDir, "local/history/history.json")
        private val syncOutboxDir = File(rootDir, "sync-outbox")
        private val syncAttachmentDir = File(syncOutboxDir, "attachments")
        private val syncInboxQuestionsDir = File(rootDir, "sync-inbox/questions")
        private val syncInboxAcksDir = File(rootDir, "sync-inbox/acks")

        init {
            localEntriesDir.mkdirs()
            stateDir.mkdirs()
            historyFile.parentFile?.mkdirs()
            syncOutboxDir.mkdirs()
            syncAttachmentDir.mkdirs()
            syncInboxQuestionsDir.mkdirs()
            syncInboxAcksDir.mkdirs()
        }

        @JavascriptInterface
        fun bootstrapState(): String {
            val draft = loadDraft()
            val entries = loadEntriesList()
            val history = loadHistory()
            val latestQuestion = loadLatestQuestion()
            val latestEntry = entries.firstOrNull()
            val ackIds = loadAckIds()

            val sync = JSONObject().apply {
                put("local", latestEntry != null)
                put("pc", latestEntry != null && ackIds.contains(latestEntry?.optString("entryId")))
                put("pcSynced", latestQuestion != null)
                put(
                    "modeHelp",
                    when {
                        latestQuestion != null -> "スマホと PC のワークスペースが同期されています。次の質問まで続けて確認できます。"
                        latestEntry != null && ackIds.contains(latestEntry.optString("entryId")) ->
                            "スマホと PC のワークスペースへメモが届いています。次の質問はまだ準備中です。"
                        latestEntry != null ->
                            "スマホだけでメモを残せます。PC の質問確認とワークスペース反映はまだできません。"
                        else -> "まだ端末内に確定メモはありません。"
                    },
                )
            }

            return JSONObject().apply {
                put("draft", draft)
                put("entries", JSONArray(entries))
                put("history", history)
                put("latestQuestion", latestQuestion ?: JSONObject.NULL)
                put("sync", sync)
            }.toString()
        }

        @JavascriptInterface
        fun saveDraft(payload: String): String {
            val source = JSONObject(payload)
            val draft = JSONObject().apply {
                put("headline", source.optString("headline"))
                put("body", source.optString("body"))
                put("updatedAt", nowIso())
            }
            File(stateDir, "draft.json").writeText(draft.toString(2), Charsets.UTF_8)
            return draft.toString()
        }

        @JavascriptInterface
        fun saveEntry(payload: String): String {
            val source = JSONObject(payload)
            val entryId = "entry-${timestampToken()}"
            val capturedAt = nowIso()
            val headline = buildHeadline(source)
            val attachment = source.optJSONObject("attachment")
            val attachmentsJson = JSONArray()
            val yamlAttachments = mutableListOf<String>()
            var inputMode = "text"

            if (attachment != null && attachment.optString("dataUrl").isNotBlank()) {
                inputMode = "photo"
                val attachmentMeta = persistAttachment(entryId, attachment)
                attachmentsJson.put(
                    JSONObject().apply {
                        put("attachmentId", attachmentMeta.id)
                        put("path", attachmentMeta.relativePath)
                        put("mimeType", attachmentMeta.mimeType)
                    },
                )
                yamlAttachments += """
  - attachmentId: "${attachmentMeta.id}"
    path: "${attachmentMeta.relativePath}"
    mimeType: "${attachmentMeta.mimeType}"
""".trimEnd()
            }

            val entryJson =
                JSONObject().apply {
                    put("entryId", entryId)
                    put("headline", headline)
                    put("body", source.optString("body"))
                    put("inputMode", inputMode)
                    put("updatedAt", capturedAt)
                    put("projectId", projectId)
                    put("syncStage", "Local")
                    put("attachments", attachmentsJson)
                }
            File(localEntriesDir, "$entryId.json").writeText(entryJson.toString(2), Charsets.UTF_8)
            writeYamlEntry(entryId, capturedAt, headline, source.optString("body"), inputMode, yamlAttachments)

            File(stateDir, "draft.json").writeText("""{"headline":"","body":""}""", Charsets.UTF_8)

            return JSONObject().apply {
                put("message", "端末へ保存し、PC 側ワークスペースの同期対象に追加しました。")
                put("entryId", entryId)
            }.toString()
        }

        @JavascriptInterface
        fun markViewed(entryId: String): String {
            val target = loadEntriesList().find { it.optString("entryId") == entryId } ?: return ""
            val history = loadHistory()
            history.put(
                0,
                JSONObject().apply {
                    put("entryId", entryId)
                    put("headline", target.optString("headline"))
                    put("viewedAt", nowDisplay())
                    put("projectId", target.optString("projectId"))
                },
            )
            historyFile.writeText(history.toString(2), Charsets.UTF_8)
            return "ok"
        }

        private fun loadDraft(): JSONObject {
            val file = File(stateDir, "draft.json")
            if (!file.exists()) {
                return JSONObject().apply {
                    put("headline", "")
                    put("body", "")
                }
            }
            return JSONObject(file.readText(Charsets.UTF_8))
        }

        private fun loadEntriesList(): List<JSONObject> {
            return localEntriesDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.sortedByDescending { it.lastModified() }
                ?.map { JSONObject(it.readText(Charsets.UTF_8)) }
                ?: emptyList()
        }

        private fun loadHistory(): JSONArray {
            if (!historyFile.exists()) {
                return JSONArray()
            }
            return JSONArray(historyFile.readText(Charsets.UTF_8))
        }

        private fun loadLatestQuestion(): JSONObject? {
            val file = syncInboxQuestionsDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.maxByOrNull { it.lastModified() }
                ?: return null
            return JSONObject(file.readText(Charsets.UTF_8))
        }

        private fun loadAckIds(): Set<String> {
            return syncInboxAcksDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.mapNotNull {
                    try {
                        JSONObject(it.readText(Charsets.UTF_8)).optString("entryId")
                    } catch (_: Exception) {
                        null
                    }
                }
                ?.toSet()
                ?: emptySet()
        }

        private fun buildHeadline(source: JSONObject): String {
            val explicit = source.optString("headline").trim()
            if (explicit.isNotBlank()) {
                return explicit
            }
            val body = source.optString("body").trim()
            return if (body.isBlank()) "現場メモ" else body.take(24)
        }

        private fun writeYamlEntry(
            entryId: String,
            capturedAt: String,
            headline: String,
            body: String,
            inputMode: String,
            attachments: List<String>,
        ) {
            val builder = StringBuilder()
            builder.appendLine("schemaVersion: \"1.0.0\"")
            builder.appendLine("entryId: \"$entryId\"")
            builder.appendLine("entryType: \"memo\"")
            builder.appendLine("projectId: \"$projectId\"")
            builder.appendLine("sessionId: \"$sessionId\"")
            builder.appendLine("capturedAt: \"$capturedAt\"")
            builder.appendLine("deviceId: \"$deviceId\"")
            builder.appendLine("inputMode: \"$inputMode\"")
            builder.appendLine("body: \"${escapeYaml(body)}\"")
            if (attachments.isNotEmpty()) {
                builder.appendLine("attachments:")
                attachments.forEach { builder.appendLine(it) }
            }
            builder.appendLine("projectContext:")
            builder.appendLine("  customer: \"field-user\"")
            builder.appendLine("  phase: \"validation\"")
            builder.appendLine("  topic: \"onsite_context\"")
            builder.appendLine("sync:")
            builder.appendLine("  peerId: \"USB-ADB-XPERIA\"")
            builder.appendLine("  state: \"local_saved\"")
            builder.appendLine("headline: \"${escapeYaml(headline)}\"")

            File(syncOutboxDir, "$entryId.yaml").writeText(builder.toString(), Charsets.UTF_8)
        }

        private fun persistAttachment(entryId: String, attachment: JSONObject): AttachmentMeta {
            val mimeType = attachment.optString("mimeType").ifBlank { "image/jpeg" }
            val extension = when {
                mimeType.endsWith("png") -> "png"
                mimeType.endsWith("webp") -> "webp"
                else -> "jpg"
            }
            val attachmentId = "photo-$entryId"
            val fileName = "$attachmentId.$extension"
            val target = File(syncAttachmentDir, fileName)
            val dataUrl = attachment.optString("dataUrl")
            val bytes = Base64.getDecoder().decode(dataUrl.substringAfter(","))
            target.writeBytes(bytes)
            return AttachmentMeta(
                id = attachmentId,
                relativePath = "attachments/$fileName",
                mimeType = mimeType,
            )
        }

        private fun nowIso(): String =
            OffsetDateTime.now(zoneId).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)

        private fun nowDisplay(): String =
            OffsetDateTime.now(zoneId).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))

        private fun timestampToken(): String =
            OffsetDateTime.now(zoneId).format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"))

        private fun escapeYaml(value: String): String =
            value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ")
    }

    private data class AttachmentMeta(
        val id: String,
        val relativePath: String,
        val mimeType: String,
    )
}
