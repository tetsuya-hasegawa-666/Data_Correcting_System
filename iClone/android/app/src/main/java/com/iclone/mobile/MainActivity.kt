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
import java.time.Instant
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
            callback.onReceiveValue(if (uri != null) arrayOf(uri) else null)
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
        private val localTrashDir = File(rootDir, "local/trash")
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
            localTrashDir.mkdirs()
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
            val trashEntries = loadTrashEntries()
            val settings = loadSettings()
            val sync = loadBridgeStatus(settings)

            return JSONObject().apply {
                put("draft", loadDraft())
                put("entries", JSONArray(entries))
                put("memoEntries", JSONArray(entries.filter { it.optString("kind") == "memo" }))
                put("photoEntries", JSONArray(entries.filter { it.optString("kind") == "photo" }))
                put("trashEntries", JSONArray(trashEntries))
                put("history", loadHistory())
                put("latestQuestion", latestQuestion ?: JSONObject.NULL)
                put("settings", settings)
                put("sync", sync)
                put(
                    "counts",
                    JSONObject().apply {
                        put("records", entries.size)
                        put("questions", if (latestQuestion != null) 1 else 0)
                        put("photos", countPhotos(entries))
                        put("trash", trashEntries.size)
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
            val entry = buildOrUpdateEntry(JSONObject(payload))
            return JSONObject().apply {
                put("entryId", entry.optString("entryId"))
                put("message", "記録しました。")
            }.toString()
        }

        @JavascriptInterface
        fun syncEntry(payload: String): String {
            val entry = buildOrUpdateEntry(JSONObject(payload))
            writeSyncPayload(entry)
            return JSONObject().apply {
                put("entryId", entry.optString("entryId"))
                put("message", "コピーを予約しました。")
            }.toString()
        }

        @JavascriptInterface
        fun deleteEntry(entryId: String): String {
            moveEntryToTrash(entryId)
            return JSONObject().apply {
                put("entryId", entryId)
                put("message", "ごみ箱へ移動しました。")
            }.toString()
        }

        @JavascriptInterface
        fun hardDeleteEntry(entryId: String): String {
            deleteEntryFile(localEntriesDir, entryId)
            deleteEntryFile(localTrashDir, entryId)
            File(syncOutboxDir, "$entryId.yaml").delete()
            writeDeleteRequest(entryId)
            return JSONObject().apply {
                put("entryId", entryId)
                put("message", "完全消去しました。")
            }.toString()
        }

        @JavascriptInterface
        fun emptyTrash(): String {
            var removed = 0
            localTrashDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.forEach { file ->
                    val entryId = JSONObject(file.readText(Charsets.UTF_8)).optString("entryId")
                    if (entryId.isNotBlank()) {
                        writeDeleteRequest(entryId)
                    }
                    file.delete()
                    removed += 1
                }
            return JSONObject().apply {
                put("removed", removed)
                put("message", "ごみ箱を空にしました。")
            }.toString()
        }

        @JavascriptInterface
        fun saveSettings(payload: String): String {
            val settings = normalizeSettings(JSONObject(payload), "mobile")
            settingsFile.writeText(settings.toString(2), Charsets.UTF_8)
            File(syncOutboxSettingsDir, "shared_settings.json").writeText(settings.toString(2), Charsets.UTF_8)
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

        private fun loadDraft(): JSONObject =
            if (draftFile.exists()) {
                JSONObject(draftFile.readText(Charsets.UTF_8))
            } else {
                JSONObject().put("headline", "").put("body", "")
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

        private fun nextSyncText(settings: JSONObject): String =
            if (!settings.optBoolean("autoSyncEnabled", true)) {
                "手動"
            } else {
                when (settings.optString("autoSyncInterval", "realtime")) {
                    "10s" -> "10秒後"
                    "1m" -> "1分後"
                    else -> "すぐ"
                }
            }

        private fun loadEntriesList(latestQuestion: JSONObject?, ackIds: Set<String>): List<JSONObject> =
            localEntriesDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.sortedByDescending { it.lastModified() }
                ?.map { file ->
                    JSONObject(file.readText(Charsets.UTF_8)).apply {
                        val entryId = optString("entryId")
                        put("syncStage", computeSyncStage(entryId, ackIds, latestQuestion))
                        put("kind", if (hasImageAttachment(optJSONArray("attachments") ?: JSONArray())) "photo" else "memo")
                    }
                }
                ?: emptyList()

        private fun loadTrashEntries(): List<JSONObject> =
            localTrashDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.sortedByDescending { it.lastModified() }
                ?.map { file ->
                    JSONObject(file.readText(Charsets.UTF_8)).apply {
                        put("kind", if (hasImageAttachment(optJSONArray("attachments") ?: JSONArray())) "photo" else "memo")
                        put("trashedAt", displayFileTime(file.lastModified()))
                    }
                }
                ?: emptyList()

        private fun loadHistory(): JSONArray =
            if (historyFile.exists()) JSONArray(historyFile.readText(Charsets.UTF_8)) else JSONArray()

        private fun loadLatestQuestion(): JSONObject? {
            val file = syncInboxQuestionsDir.listFiles()?.filter { it.extension == "json" }?.maxByOrNull { it.lastModified() } ?: return null
            return JSONObject(file.readText(Charsets.UTF_8))
        }

        private fun loadBridgeStatus(settings: JSONObject): JSONObject {
            val fallback =
                JSONObject().apply {
                    put("mobile", JSONObject().put("label", "Mobile").put("checked", true).put("level", "good"))
                    put("server", JSONObject().put("label", "Server").put("checked", false).put("level", "bad"))
                    put("connector", JSONObject().put("text", "--×--").put("level", "bad").put("label", "圏外 / server停止"))
                    put("nextSyncText", nextSyncText(settings))
                }
            val file = syncInboxStatusDir.listFiles()?.filter { it.extension == "json" }?.maxByOrNull { it.lastModified() } ?: return fallback
            val payload = JSONObject(file.readText(Charsets.UTF_8))
            return JSONObject().apply {
                put("mobile", JSONObject().put("label", "Mobile").put("checked", true).put("level", payload.optString("mobileLevel", "good")))
                put(
                    "server",
                    JSONObject()
                        .put("label", "Server")
                        .put("checked", payload.optBoolean("serverChecked", false))
                        .put("level", payload.optString("serverLevel", "bad")),
                )
                put("connector", payload.optJSONObject("connector") ?: fallback.getJSONObject("connector"))
                put("nextSyncText", payload.optString("nextSyncText", nextSyncText(settings)))
            }
        }

        private fun loadAckIds(): Set<String> =
            syncInboxAcksDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.mapNotNull {
                    runCatching { JSONObject(it.readText(Charsets.UTF_8)).optString("entryId") }.getOrNull()
                }
                ?.toSet()
                ?: emptySet()

        private fun computeSyncStage(entryId: String, ackIds: Set<String>, latestQuestion: JSONObject?): String {
            if (latestQuestion != null) {
                val related = latestQuestion.optString("entryId")
                if (related.contains(entryId.substringAfter("entry-"))) return "PC synced"
            }
            if (ackIds.contains(entryId)) return "PC"
            return "Local"
        }

        private fun buildOrUpdateEntry(source: JSONObject): JSONObject {
            val entryId = currentEntryId()
            val headline = source.optString("headline").trim()
            val body = source.optString("body").trim()
            val attachment = source.optJSONObject("attachment")
            val capturedAt = nowIso()
            val resolvedHeadline =
                when {
                    headline.isNotBlank() -> headline
                    body.isNotBlank() -> body.take(24)
                    else -> "現場メモ"
                }

            val attachmentsArray = JSONArray()
            if (attachment != null && attachment.optString("dataUrl").contains(",")) {
                val mimeType = attachment.optString("mimeType", "image/jpeg")
                val extension = when {
                    mimeType.endsWith("png") -> "png"
                    mimeType.endsWith("webp") -> "webp"
                    else -> "jpg"
                }
                val fileName = "photo-$entryId.$extension"
                val bytes = Base64.getDecoder().decode(attachment.optString("dataUrl").substringAfter(","))
                val localFile = File(localAttachmentsDir, fileName)
                localFile.writeBytes(bytes)
                attachmentsArray.put(
                    JSONObject()
                        .put("attachmentId", "photo-$entryId")
                        .put("path", "attachments/$fileName")
                        .put("mimeType", mimeType),
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
                    put("attachments", attachmentsArray)
                }

            File(localEntriesDir, "$entryId.json").writeText(entry.toString(2), Charsets.UTF_8)
            deleteEntryFile(localTrashDir, entryId)
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
            val payload = JSONObject().put("entryId", entryId).put("deletedAt", nowIso()).put("source", "mobile")
            File(syncOutboxDeletesDir, "$entryId.json").writeText(payload.toString(2), Charsets.UTF_8)
        }

        private fun moveEntryToTrash(entryId: String) {
            val source = findEntryFile(localEntriesDir, entryId) ?: return
            source.copyTo(File(localTrashDir, source.name), overwrite = true)
            source.delete()
        }

        private fun findEntryFile(root: File, entryId: String): File? =
            root.listFiles()
                ?.filter { it.extension == "json" }
                ?.firstOrNull { JSONObject(it.readText(Charsets.UTF_8)).optString("entryId") == entryId }

        private fun deleteEntryFile(root: File, entryId: String) {
            findEntryFile(root, entryId)?.delete()
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
                        if (source.exists()) source.copyTo(target, overwrite = true)
                    }
                    File(localEntriesDir, "$entryId.json").writeText(
                        JSONObject()
                            .put("entryId", entryId)
                            .put("headline", payload.optString("headline"))
                            .put("body", payload.optString("body"))
                            .put("inputMode", payload.optString("inputMode", "text"))
                            .put("updatedAt", payload.optString("capturedAt"))
                            .put("projectId", payload.optString("projectId", projectId))
                            .put("attachments", attachments)
                            .toString(2),
                        Charsets.UTF_8,
                    )
                    deleteEntryFile(localTrashDir, entryId)
                }
        }

        private fun applyIncomingDeletes() {
            syncInboxDeletesDir.listFiles()
                ?.filter { it.extension == "json" }
                ?.forEach { file ->
                    val entryId = JSONObject(file.readText(Charsets.UTF_8)).optString("entryId")
                    deleteEntryFile(localEntriesDir, entryId)
                    deleteEntryFile(localTrashDir, entryId)
                }
        }

        private fun applyIncomingSettings() {
            val incoming = syncInboxSettingsDir.listFiles()?.filter { it.extension == "json" }?.maxByOrNull { it.lastModified() } ?: return
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
                for (index in 0 until attachments.length()) {
                    if (attachments.getJSONObject(index).optString("mimeType").startsWith("image/")) total += 1
                }
            }
            return total
        }

        private fun hasImageAttachment(attachments: JSONArray): Boolean {
            for (index in 0 until attachments.length()) {
                if (attachments.getJSONObject(index).optString("mimeType").startsWith("image/")) return true
            }
            return false
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

        private fun nowIso(): String = OffsetDateTime.now(zoneId).format(DateTimeFormatter.ISO_OFFSET_DATE_TIME)

        private fun nowDisplay(): String = OffsetDateTime.now(zoneId).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))

        private fun displayFileTime(millis: Long): String =
            Instant.ofEpochMilli(millis).atZone(zoneId).format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm"))

        private fun timestampToken(): String = OffsetDateTime.now(zoneId).format(DateTimeFormatter.ofPattern("yyyyMMdd-HHmmss"))

        private fun escapeYaml(value: String): String = value.replace("\\", "\\\\").replace("\"", "\\\"").replace("\n", " ")
    }
}
