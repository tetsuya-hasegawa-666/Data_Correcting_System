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

        val assetLoader =
            WebViewAssetLoader.Builder()
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
        private val rootDir = File(getExternalFilesDir(null), "iclone")
        private val localEntriesDir = File(rootDir, "local/entries")
        private val localAttachmentsDir = File(rootDir, "local/attachments")
        private val stateDir = File(rootDir, "local/state")
        private val historyFile = File(rootDir, "local/history/history.json")
        private val syncOutboxDir = File(rootDir, "sync-outbox")
        private val syncOutboxAttachmentsDir = File(syncOutboxDir, "attachments")
        private val syncOutboxDeletesDir = File(syncOutboxDir, "deletes")
        private val syncOutboxSettingsDir = File(syncOutboxDir, "settings")
        private val syncInboxQuestionsDir = File(rootDir, "sync-inbox/questions")
        private val syncInboxEntriesDir = File(rootDir, "sync-inbox/entries")
        private val syncInboxAttachmentsDir = File(rootDir, "sync-inbox/attachments")
        private val syncInboxDeletesDir = File(rootDir, "sync-inbox/deletes")
        private val syncInboxSettingsDir = File(rootDir, "sync-inbox/settings")
        private val syncInboxStatusDir = File(rootDir, "sync-inbox/status")
        private val syncInboxAcksDir = File(rootDir, "sync-inbox/acks")
        private val draftFile = File(stateDir, "draft.json")
        private val currentEntryFile = File(stateDir, "current_entry.json")
        private val settingsFile = File(stateDir, "settings.json")

        init {
            localEntriesDir.mkdirs()
            localAttachmentsDir.mkdirs()
            stateDir.mkdirs()
            historyFile.parentFile?.mkdirs()
            syncOutboxDir.mkdirs()
            syncOutboxAttachmentsDir.mkdirs()
            syncOutboxDeletesDir.mkdirs()
            syncOutboxSettingsDir.mkdirs()
            syncInboxQuestionsDir.mkdirs()
            syncInboxEntriesDir.mkdirs()
            syncInboxAttachmentsDir.mkdirs()
            syncInboxDeletesDir.mkdirs()
            syncInboxSettingsDir.mkdirs()
            syncInboxStatusDir.mkdirs()
            syncInboxAcksDir.mkdirs()
        }

        @JavascriptInterface
        fun bootstrapState(): String {
            ingestIncomingEntries()
            applyIncomingDeletes()
            applyIncomingSettings()

            val latestQuestion = loadLatestQuestion()
            val entries = loadEntriesList(latestQuestion, loadAckIds())
            val settings = loadSettings()
            val status = loadBridgeStatus()

            return JSONObject().apply {
                put("draft", loadDraft())
                put("entries", JSONArray(entries))
                put("history", loadHistory())
                put("latestQuestion", latestQuestion ?: JSONObject.NULL)
                put("settings", settings)
                put("sync", status)
                put(
                    "counts",
                    JSONObject().apply {
                        put("records", entries.size)
                        put("questions", if (latestQuestion != null) 1 else 0)
                        put("photos", countPhotos(entries))
                    },
                )
            }.toString()
        }

        @JavascriptInterface
        fun saveDraft(payload: String): String {
            val source = JSONObject(payload)
            val draft =
                JSONObject().apply {
                    put("headline", source.optString("headline"))
                    put("body", source.optString("body"))
                    put("updatedAt", nowIso())
                }
            draftFile.writeText(draft.toString(2), Charsets.UTF_8)
            return draft.toString()
        }

        @JavascriptInterface
        fun saveLocalEntry(payload: String): String {
            val source = JSONObject(payload)
            val entry = buildOrUpdateEntry(source)
            return JSONObject().apply {
                put("entryId", entry.optString("entryId"))
                put("message", "\u4fdd\u5b58\u3057\u307e\u3057\u305f\u3002")
            }.toString()
        }

        @JavascriptInterface
        fun syncEntry(payload: String): String {
            val source = JSONObject(payload)
            val entry = buildOrUpdateEntry(source)
            writeSyncPayload(entry)
            return JSONObject().apply {
                put("entryId", entry.optString("entryId"))
                put("message", "\u30b3\u30d4\u30fc\u3092\u4e88\u7d04\u3057\u307e\u3057\u305f\u3002")
            }.toString()
        }

        @JavascriptInterface
        fun deleteEntry(entryId: String): String {
            localEntriesDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.firstOrNull {
                    JSONObject(it.readText(Charsets.UTF_8)).optString("entryId") == entryId
                }
                ?.delete()
            File(syncOutboxDir, "$entryId.yaml").delete()
            writeDeleteRequest(entryId)
            return JSONObject().apply {
                put("entryId", entryId)
                put("message", "\u524a\u9664\u3057\u307e\u3057\u305f\u3002")
            }.toString()
        }

        @JavascriptInterface
        fun saveSettings(payload: String): String {
            val source = JSONObject(payload)
            val settings = normalizeSettings(source, "mobile")
            settingsFile.writeText(settings.toString(2), Charsets.UTF_8)
            val target = File(syncOutboxSettingsDir, "shared_settings.json")
            target.writeText(settings.toString(2), Charsets.UTF_8)
            return settings.toString()
        }

        @JavascriptInterface
        fun markViewed(entryId: String): String {
            val target = loadEntriesList(loadLatestQuestion(), loadAckIds()).find { it.optString("entryId") == entryId } ?: return ""
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
            if (!draftFile.exists()) {
                return JSONObject().apply {
                    put("headline", "")
                    put("body", "")
                }
            }
            return JSONObject(draftFile.readText(Charsets.UTF_8))
        }

        private fun loadSettings(): JSONObject {
            if (!settingsFile.exists()) {
                val defaults = normalizeSettings(JSONObject(), "mobile")
                settingsFile.writeText(defaults.toString(2), Charsets.UTF_8)
                return defaults
            }
            return JSONObject(settingsFile.readText(Charsets.UTF_8))
        }

        private fun normalizeSettings(source: JSONObject, origin: String): JSONObject =
            JSONObject().apply {
                put("autoSaveEnabled", source.optBoolean("autoSaveEnabled", true))
                put("autoSaveInterval", normalizeInterval(source.optString("autoSaveInterval", "realtime")))
                put("autoSyncEnabled", source.optBoolean("autoSyncEnabled", true))
                put("autoSyncInterval", normalizeInterval(source.optString("autoSyncInterval", "realtime")))
                put("updatedAt", nowIso())
                put("source", origin)
            }

        private fun normalizeInterval(value: String): String =
            when (value) {
                "10s", "1m", "realtime" -> value
                else -> "realtime"
            }

        private fun nextSyncText(settings: JSONObject): String {
            if (!settings.optBoolean("autoSyncEnabled", true)) {
                return "\u624b\u52d5"
            }
            return when (settings.optString("autoSyncInterval", "realtime")) {
                "10s" -> "10s"
                "1m" -> "1m"
                else -> "\u3059\u3050"
            }
        }

        private fun loadEntriesList(latestQuestion: JSONObject?, ackIds: Set<String>): List<JSONObject> =
            localEntriesDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.sortedByDescending { it.lastModified() }
                ?.map { file ->
                    val item = JSONObject(file.readText(Charsets.UTF_8))
                    val entryId = item.optString("entryId")
                    item.put("syncStage", computeSyncStage(entryId, ackIds, latestQuestion))
                    item
                }
                ?: emptyList()

        private fun loadHistory(): JSONArray {
            if (!historyFile.exists()) {
                return JSONArray()
            }
            return JSONArray(historyFile.readText(Charsets.UTF_8))
        }

        private fun loadLatestQuestion(): JSONObject? {
            val file =
                syncInboxQuestionsDir.listFiles()
                    ?.filter { it.extension == "json" }
                    ?.maxByOrNull { it.lastModified() }
                    ?: return null
            return JSONObject(file.readText(Charsets.UTF_8))
        }

        private fun loadBridgeStatus(): JSONObject {
            val fallback =
                JSONObject().apply {
                    put("mobile", JSONObject().put("label", "Mobile").put("checked", true))
                    put("server", JSONObject().put("label", "Server").put("checked", false))
                    put(
                        "connector",
                        JSONObject().put("text", "--×--").put("level", "bad").put("label", "圏外 / server停止"),
                    )
                    put("nextSyncText", nextSyncText(loadSettings()))
                }

            val file =
                syncInboxStatusDir.listFiles()
                    ?.filter { it.extension == "json" }
                    ?.maxByOrNull { it.lastModified() }
                    ?: return fallback
            val payload = JSONObject(file.readText(Charsets.UTF_8))
            return JSONObject().apply {
                put("mobile", JSONObject().put("label", "Mobile").put("checked", true))
                put(
                    "server",
                    JSONObject()
                        .put("label", "Server")
                        .put("checked", payload.optBoolean("serverChecked", false)),
                )
                put("connector", payload.optJSONObject("connector") ?: fallback.getJSONObject("connector"))
                put("nextSyncText", payload.optString("nextSyncText", nextSyncText(loadSettings())))
            }
        }

        private fun loadAckIds(): Set<String> =
            syncInboxAcksDir.listFiles()
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

        private fun computeSyncStage(
            entryId: String,
            ackIds: Set<String>,
            latestQuestion: JSONObject?,
        ): String {
            if (latestQuestion != null) {
                val related = latestQuestion.optString("entryId")
                if (related.contains(entryId.substringAfter("entry-"))) {
                    return "PC synced"
                }
            }
            if (ackIds.contains(entryId)) {
                return "PC"
            }
            return "Local"
        }

        private fun buildOrUpdateEntry(source: JSONObject): JSONObject {
            val entryId = currentEntryId()
            val headline = source.optString("headline").trim()
            val body = source.optString("body").trim()
            val attachment = source.optJSONObject("attachment")
            val capturedAt = nowIso()
            val resolvedHeadline =
                if (headline.isNotBlank()) {
                    headline
                } else if (body.isNotBlank()) {
                    body.take(24)
                } else {
                    "\u73fe\u5834\u30e1\u30e2"
                }

            val attachmentsArray = JSONArray()
            if (attachment != null && attachment.optString("dataUrl").contains(",")) {
                val mimeType = attachment.optString("mimeType", "image/jpeg")
                val extension = if (mimeType.endsWith("png")) "png" else if (mimeType.endsWith("webp")) "webp" else "jpg"
                val fileName = "photo-$entryId.$extension"
                val bytes = Base64.getDecoder().decode(attachment.optString("dataUrl").substringAfter(","))
                val localFile = File(localAttachmentsDir, fileName)
                localFile.writeBytes(bytes)
                attachmentsArray.put(
                    JSONObject().apply {
                        put("attachmentId", "photo-$entryId")
                        put("path", "attachments/$fileName")
                        put("mimeType", mimeType)
                    },
                )
            }

            val entry =
                JSONObject().apply {
                    put("entryId", entryId)
                    put("headline", resolvedHeadline)
                    put("body", body)
                    put("inputMode", if (attachmentsArray.length() > 0) "photo" else "text")
                    put("updatedAt", capturedAt)
                    put("projectId", projectId)
                    put("syncStage", "Local")
                    put("attachments", attachmentsArray)
                }

            File(localEntriesDir, "$entryId.json").writeText(entry.toString(2), Charsets.UTF_8)
            currentEntryFile.writeText(JSONObject().put("entryId", entryId).put("updatedAt", capturedAt).toString(2), Charsets.UTF_8)
            return entry
        }

        private fun writeSyncPayload(entry: JSONObject) {
            val attachments = entry.optJSONArray("attachments") ?: JSONArray()
            val yaml = StringBuilder()
            yaml.appendLine("schemaVersion: \"1.0.0\"")
            yaml.appendLine("entryId: \"${entry.optString("entryId")}\"")
            yaml.appendLine("entryType: \"memo\"")
            yaml.appendLine("projectId: \"$projectId\"")
            yaml.appendLine("sessionId: \"session-${entry.optString("entryId")}\"")
            yaml.appendLine("capturedAt: \"${entry.optString("updatedAt")}\"")
            yaml.appendLine("deviceId: \"$deviceId\"")
            yaml.appendLine("inputMode: \"${entry.optString("inputMode", "text")}\"")
            yaml.appendLine("body: \"${escapeYaml(entry.optString("body"))}\"")
            if (attachments.length() > 0) {
                yaml.appendLine("attachments:")
                for (index in 0 until attachments.length()) {
                    val item = attachments.getJSONObject(index)
                    yaml.appendLine("  - attachmentId: \"${item.optString("attachmentId")}\"")
                    yaml.appendLine("    path: \"${item.optString("path")}\"")
                    yaml.appendLine("    mimeType: \"${item.optString("mimeType")}\"")
                    val localFile = File(localAttachmentsDir, item.optString("path").substringAfter("/"))
                    if (localFile.exists()) {
                        localFile.copyTo(File(syncOutboxAttachmentsDir, localFile.name), overwrite = true)
                    }
                }
            }
            yaml.appendLine("projectContext:")
            yaml.appendLine("  customer: \"field-user\"")
            yaml.appendLine("  phase: \"validation\"")
            yaml.appendLine("  topic: \"onsite_context\"")
            yaml.appendLine("sync:")
            yaml.appendLine("  peerId: \"USB-ADB-XPERIA\"")
            yaml.appendLine("  state: \"local_saved\"")
            yaml.appendLine("headline: \"${escapeYaml(entry.optString("headline"))}\"")
            File(syncOutboxDir, "${entry.optString("entryId")}.yaml").writeText(yaml.toString(), Charsets.UTF_8)
        }

        private fun writeDeleteRequest(entryId: String) {
            val payload =
                JSONObject().apply {
                    put("entryId", entryId)
                    put("deletedAt", nowIso())
                    put("source", "mobile")
                }
            File(syncOutboxDeletesDir, "$entryId.json").writeText(payload.toString(2), Charsets.UTF_8)
        }

        private fun ingestIncomingEntries() {
            syncInboxEntriesDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.forEach { file ->
                    val payload = JSONObject(file.readText(Charsets.UTF_8))
                    val entryId = payload.optString("entryId")
                    if (entryId.isBlank()) return@forEach
                    val attachments = payload.optJSONArray("attachments") ?: JSONArray()
                    for (index in 0 until attachments.length()) {
                        val item = attachments.getJSONObject(index)
                        val source = File(syncInboxAttachmentsDir, item.optString("path").substringAfter("/"))
                        val target = File(localAttachmentsDir, item.optString("path").substringAfter("/"))
                        if (source.exists()) {
                            source.copyTo(target, overwrite = true)
                        }
                    }
                    File(localEntriesDir, "$entryId.json").writeText(
                        JSONObject().apply {
                            put("entryId", entryId)
                            put("headline", payload.optString("headline"))
                            put("body", payload.optString("body"))
                            put("inputMode", payload.optString("inputMode", "text"))
                            put("updatedAt", payload.optString("capturedAt"))
                            put("projectId", payload.optString("projectId", projectId))
                            put("syncStage", "PC synced")
                            put("attachments", attachments)
                        }.toString(2),
                        Charsets.UTF_8,
                    )
                }
        }

        private fun applyIncomingDeletes() {
            syncInboxDeletesDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.forEach { file ->
                    val payload = JSONObject(file.readText(Charsets.UTF_8))
                    val entryId = payload.optString("entryId")
                    localEntriesDir.listFiles()
                        ?.filter { it.extension == "json" }
                        ?.firstOrNull { JSONObject(it.readText(Charsets.UTF_8)).optString("entryId") == entryId }
                        ?.delete()
                }
        }

        private fun applyIncomingSettings() {
            val incoming =
                syncInboxSettingsDir.listFiles()
                    ?.filter { it.extension == "json" }
                    ?.maxByOrNull { it.lastModified() }
                    ?: return
            val incomingPayload = JSONObject(incoming.readText(Charsets.UTF_8))
            val current = loadSettings()
            val incomingAt = OffsetDateTime.parse(incomingPayload.optString("updatedAt", nowIso()))
            val currentAt = OffsetDateTime.parse(current.optString("updatedAt", nowIso()))
            if (incomingAt.isAfter(currentAt)) {
                settingsFile.writeText(incomingPayload.toString(2), Charsets.UTF_8)
            }
        }

        private fun countPhotos(entries: List<JSONObject>): Int {
            var total = 0
            entries.forEach { item ->
                val attachments = item.optJSONArray("attachments") ?: JSONArray()
                for (inner in 0 until attachments.length()) {
                    if (attachments.getJSONObject(inner).optString("mimeType").startsWith("image/")) {
                        total += 1
                    }
                }
            }
            return total
        }

        private fun currentEntryId(): String {
            if (!currentEntryFile.exists()) {
                val entryId = "entry-${timestampToken()}"
                currentEntryFile.writeText(JSONObject().put("entryId", entryId).put("updatedAt", nowIso()).toString(2), Charsets.UTF_8)
                return entryId
            }
            val payload = JSONObject(currentEntryFile.readText(Charsets.UTF_8))
            return payload.optString("entryId").ifBlank { "entry-${timestampToken()}" }
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
}
