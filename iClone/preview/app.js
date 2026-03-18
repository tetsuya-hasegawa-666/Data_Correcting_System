const TEXT = {
  eyebrow: "Xperia 5 III / Windows workspace",
  title: "\u30c7\u30fc\u30bf\u30af\u30ed\u30fc\u30f3\u3092\u3059\u3050\u4f7f\u3046",
  editorLabel: "\u30af\u30ed\u30fc\u30f3",
  editorTitle: "\u305d\u306e\u307e\u307e\u30b3\u30d4\u30fc\u3059\u308b",
  listLabel: "\u30ef\u30fc\u30af\u30b9\u30da\u30fc\u30b9",
  listTitle: "\u3059\u3050\u89e6\u308c\u308b\u30c7\u30fc\u30bf",
  settingsToggleOpen: "\u8a2d\u5b9a",
  settingsToggleClose: "\u8a2d\u5b9a\u3092\u9589\u3058\u308b",
  headline: "\u898b\u51fa\u3057",
  body: "\u30e1\u30e2",
  attach: "\u5199\u771f",
  detach: "\u5916\u3059",
  delete: "\u524a\u9664",
  save: "\u8a18\u9332\u3059\u308b",
  sync: "\u4eca\u3059\u3050\u30b3\u30d4\u30fc",
  autoSave: "\u81ea\u52d5\u4fdd\u5b58",
  autoSaveInterval: "\u4fdd\u5b58\u9593\u9694",
  autoSync: "\u81ea\u52d5\u540c\u671f",
  autoSyncInterval: "\u540c\u671f\u9593\u9694",
  settingsNote: "\u6b21\u306e\u540c\u671f",
  questionPrefix: "\u6b21\u306e\u8cea\u554f",
  noQuestion: "\u307e\u3060\u306a\u3057",
  actionReady: "\u3059\u3050\u30af\u30ed\u30fc\u30f3\u3067\u304d\u307e\u3059",
  empty: "\u307e\u3060\u30c7\u30fc\u30bf\u304c\u3042\u308a\u307e\u305b\u3093",
  footerRecords: "\u30e1\u30e2",
  footerPhotos: "\u5199\u771f",
  footerQuestions: "\u8cea\u554f",
  footerNextSync: "\u6b21\u540c\u671f",
  on: "ON",
  off: "OFF",
  realtime: "\u30ea\u30a2\u30eb\u30bf\u30a4\u30e0",
  tenSec: "10\u79d2",
  oneMin: "1\u5206",
  mobile: "Mobile",
  server: "Server",
};

const state = {
  bootstrap: null,
  selectedRecordId: "",
  pendingPhoto: null,
  saveTimer: null,
  syncTimer: null,
  settingsOpen: false,
};

const refs = {
  topEyebrow: document.getElementById("topEyebrow"),
  topTitle: document.getElementById("topTitle"),
  statusRail: document.getElementById("statusRail"),
  editorLabel: document.getElementById("editorLabel"),
  editorTitle: document.getElementById("editorTitle"),
  listLabel: document.getElementById("listLabel"),
  listTitle: document.getElementById("listTitle"),
  settingsToggle: document.getElementById("settingsToggle"),
  settingsPanel: document.getElementById("settingsPanel"),
  autoSaveLabel: document.getElementById("autoSaveLabel"),
  autoSaveEnabled: document.getElementById("autoSaveEnabled"),
  autoSaveIntervalLabel: document.getElementById("autoSaveIntervalLabel"),
  autoSaveInterval: document.getElementById("autoSaveInterval"),
  autoSyncLabel: document.getElementById("autoSyncLabel"),
  autoSyncEnabled: document.getElementById("autoSyncEnabled"),
  autoSyncIntervalLabel: document.getElementById("autoSyncIntervalLabel"),
  autoSyncInterval: document.getElementById("autoSyncInterval"),
  settingsNote: document.getElementById("settingsNote"),
  headlineLabel: document.getElementById("headlineLabel"),
  headlineInput: document.getElementById("headlineInput"),
  bodyLabel: document.getElementById("bodyLabel"),
  bodyInput: document.getElementById("bodyInput"),
  photoInput: document.getElementById("photoInput"),
  photoButton: document.getElementById("photoButton"),
  clearPhotoButton: document.getElementById("clearPhotoButton"),
  deleteButton: document.getElementById("deleteButton"),
  photoPreviewCard: document.getElementById("photoPreviewCard"),
  photoPreviewImage: document.getElementById("photoPreviewImage"),
  saveButton: document.getElementById("saveButton"),
  syncButton: document.getElementById("syncButton"),
  actionNote: document.getElementById("actionNote"),
  questionInline: document.getElementById("questionInline"),
  recordList: document.getElementById("recordList"),
  footerCounts: document.getElementById("footerCounts"),
  footerNextSync: document.getElementById("footerNextSync"),
};

function jsonFetch(url, options = {}) {
  return fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  }).then((response) => response.json());
}

function setStaticText() {
  refs.topEyebrow.textContent = TEXT.eyebrow;
  refs.topTitle.textContent = TEXT.title;
  refs.editorLabel.textContent = TEXT.editorLabel;
  refs.editorTitle.textContent = TEXT.editorTitle;
  refs.listLabel.textContent = TEXT.listLabel;
  refs.listTitle.textContent = TEXT.listTitle;
  refs.settingsToggle.textContent = TEXT.settingsToggleOpen;
  refs.autoSaveLabel.textContent = TEXT.autoSave;
  refs.autoSaveIntervalLabel.textContent = TEXT.autoSaveInterval;
  refs.autoSyncLabel.textContent = TEXT.autoSync;
  refs.autoSyncIntervalLabel.textContent = TEXT.autoSyncInterval;
  refs.headlineLabel.textContent = TEXT.headline;
  refs.bodyLabel.textContent = TEXT.body;
  refs.photoButton.textContent = TEXT.attach;
  refs.clearPhotoButton.textContent = TEXT.detach;
  refs.deleteButton.textContent = TEXT.delete;
  refs.saveButton.textContent = TEXT.save;
  refs.syncButton.textContent = TEXT.sync;
  refs.headlineInput.placeholder = "\u898b\u51fa\u3057\u3092\u77ed\u304f\u5165\u308c\u307e\u3059";
  refs.bodyInput.placeholder = "\u30e1\u30e2\u3092\u305d\u306e\u307e\u307e\u5165\u308c\u307e\u3059";
}

function fillSelect(select, items) {
  select.innerHTML = items
    .map((item) => `<option value="${item.value}">${item.label}</option>`)
    .join("");
}

function bootstrapSettingsUI() {
  fillSelect(refs.autoSaveEnabled, [
    { value: "true", label: TEXT.on },
    { value: "false", label: TEXT.off },
  ]);
  fillSelect(refs.autoSyncEnabled, [
    { value: "true", label: TEXT.on },
    { value: "false", label: TEXT.off },
  ]);
  fillSelect(refs.autoSaveInterval, [
    { value: "realtime", label: TEXT.realtime },
    { value: "10s", label: TEXT.tenSec },
    { value: "1m", label: TEXT.oneMin },
  ]);
  fillSelect(refs.autoSyncInterval, [
    { value: "realtime", label: TEXT.realtime },
    { value: "10s", label: TEXT.tenSec },
    { value: "1m", label: TEXT.oneMin },
  ]);
}

function syncSettingsToForm(settings) {
  refs.autoSaveEnabled.value = String(Boolean(settings.autoSaveEnabled));
  refs.autoSaveInterval.value = settings.autoSaveInterval;
  refs.autoSyncEnabled.value = String(Boolean(settings.autoSyncEnabled));
  refs.autoSyncInterval.value = settings.autoSyncInterval;
  refs.settingsNote.textContent = `${TEXT.settingsNote}: ${state.bootstrap.sync.nextSyncText}`;
}

function endpointMarkup(endpoint, muted) {
  const marker = endpoint.checked ? "\u2611" : "\u00d7";
  const className = endpoint.checked ? (muted ? "muted" : "good") : "bad";
  return `<span class="status-pill ${className}">${marker}${endpoint.label}</span>`;
}

function renderStatus() {
  const sync = state.bootstrap.sync;
  const connector = sync.connector || { text: "--×--", level: "bad", label: "" };
  const mobileMuted = Boolean(sync.server?.checked);
  refs.statusRail.innerHTML = [
    endpointMarkup(sync.mobile || { label: TEXT.mobile, checked: false }, mobileMuted),
    `<span class="status-connector ${connector.level}" title="${connector.label}">${connector.text}</span>`,
    endpointMarkup(sync.server || { label: TEXT.server, checked: false }, false),
  ].join("");
}

function renderFooter() {
  const counts = state.bootstrap.counts;
  refs.footerCounts.innerHTML = [
    `${TEXT.footerRecords} ${counts.records}`,
    `${TEXT.footerPhotos} ${counts.photos}`,
    `${TEXT.footerQuestions} ${counts.questions}`,
  ]
    .map((item) => `<span class="footer-pill">${item}</span>`)
    .join("");
  refs.footerNextSync.textContent = `${TEXT.footerNextSync}: ${state.bootstrap.sync.nextSyncText}`;
}

function renderQuestion(record) {
  const body = record && record.question && record.question.body ? record.question.body : TEXT.noQuestion;
  refs.questionInline.textContent = `${TEXT.questionPrefix}: ${body}`;
}

function renderSelection() {
  const records = state.bootstrap.records || [];
  const record = records.find((item) => item.entryId === state.selectedRecordId) || null;
  if (!record) {
    refs.headlineInput.value = "";
    refs.bodyInput.value = "";
    refs.photoPreviewCard.classList.add("hidden");
    refs.actionNote.textContent = TEXT.actionReady;
    renderQuestion(null);
    return;
  }

  refs.headlineInput.value = record.headline || "";
  refs.bodyInput.value = record.body || "";
  const photo = (record.attachments || []).find((item) => String(item.mimeType || "").startsWith("image/"));
  if (photo && photo.previewUrl) {
    refs.photoPreviewImage.src = photo.previewUrl;
    refs.photoPreviewCard.classList.remove("hidden");
  } else {
    refs.photoPreviewCard.classList.add("hidden");
  }
  refs.actionNote.textContent = "\u9078\u629e\u4e2d\u306e\u30c7\u30fc\u30bf\u3092\u305d\u306e\u307e\u307e\u30b3\u30d4\u30fc\u3067\u304d\u307e\u3059";
  renderQuestion(record);
}

function renderRecords() {
  const records = state.bootstrap.records || [];
  if (records.length === 0) {
    refs.recordList.innerHTML = `<div class="record-card">${TEXT.empty}</div>`;
    return;
  }

  refs.recordList.innerHTML = records
    .map((record) => {
      const active = record.entryId === state.selectedRecordId ? " active" : "";
      return `
        <article class="record-card${active}" data-entry-id="${record.entryId}">
          <div class="record-head">
            <div>
              <h3>${record.headline || record.entryId}</h3>
              <div class="record-meta">
                <span>${record.capturedAt || "-"}</span>
                <span>${record.inputMode || "text"}</span>
              </div>
            </div>
            <div class="record-actions">
              <button class="mini-button sync" type="button" data-action="sync" data-entry-id="${record.entryId}">${TEXT.sync}</button>
              <button class="mini-button delete" type="button" data-action="delete" data-entry-id="${record.entryId}">${TEXT.delete}</button>
            </div>
          </div>
          <p class="record-body">${record.body || ""}</p>
        </article>
      `;
    })
    .join("");

  refs.recordList.querySelectorAll("[data-entry-id]").forEach((element) => {
    element.addEventListener("click", (event) => {
      const entryId = element.getAttribute("data-entry-id");
      const action = event.target.getAttribute("data-action");
      if (action === "sync") {
        event.stopPropagation();
        syncExisting(entryId);
        return;
      }
      if (action === "delete") {
        event.stopPropagation();
        removeEntry(entryId);
        return;
      }
      state.selectedRecordId = entryId;
      renderRecords();
      renderSelection();
    });
  });
}

function payloadFromForm() {
  return {
    entryId: state.selectedRecordId || undefined,
    headline: refs.headlineInput.value,
    body: refs.bodyInput.value,
    attachment: state.pendingPhoto,
  };
}

function delayFor(interval) {
  if (interval === "10s") return 10000;
  if (interval === "1m") return 60000;
  return 250;
}

function scheduleSaveAndSync() {
  const settings = state.bootstrap.settings;
  if (settings.autoSaveEnabled) {
    window.clearTimeout(state.saveTimer);
    state.saveTimer = window.setTimeout(() => saveEntry(false), delayFor(settings.autoSaveInterval));
  }
  if (settings.autoSyncEnabled) {
    window.clearTimeout(state.syncTimer);
    state.syncTimer = window.setTimeout(() => syncEntry(false), delayFor(settings.autoSyncInterval));
    refs.actionNote.textContent = `${TEXT.footerNextSync}: ${state.bootstrap.sync.nextSyncText}`;
  }
}

async function reload() {
  state.bootstrap = await jsonFetch("/api/workspace/bootstrap");
  if (!state.selectedRecordId && state.bootstrap.records.length > 0) {
    state.selectedRecordId = state.bootstrap.records[0].entryId;
  }
  syncSettingsToForm(state.bootstrap.settings);
  renderStatus();
  renderRecords();
  renderSelection();
  renderFooter();
}

async function saveEntry(showToast = true) {
  const result = await jsonFetch("/api/workspace/entries", {
    method: "POST",
    body: JSON.stringify({ ...payloadFromForm(), syncNow: false }),
  });
  state.selectedRecordId = result.entryId;
  await reload();
  if (showToast) refs.actionNote.textContent = "\u8a18\u9332\u3057\u307e\u3057\u305f";
}

async function syncEntry(showToast = true) {
  const result = await jsonFetch("/api/workspace/entries", {
    method: "POST",
    body: JSON.stringify({ ...payloadFromForm(), syncNow: true }),
  });
  state.selectedRecordId = result.entryId;
  await reload();
  if (showToast) refs.actionNote.textContent = "\u30b3\u30d4\u30fc\u3092\u4e88\u7d04\u3057\u307e\u3057\u305f";
}

async function syncExisting(entryId) {
  await jsonFetch("/api/workspace/sync-now", {
    method: "POST",
    body: JSON.stringify({ entryId }),
  });
  await reload();
  refs.actionNote.textContent = "\u30b3\u30d4\u30fc\u3092\u4e88\u7d04\u3057\u307e\u3057\u305f";
}

async function removeEntry(entryId) {
  await fetch(`/api/workspace/entries/${entryId}`, { method: "DELETE" });
  if (state.selectedRecordId === entryId) {
    state.selectedRecordId = "";
    state.pendingPhoto = null;
  }
  await reload();
  refs.actionNote.textContent = "\u524a\u9664\u3057\u307e\u3057\u305f";
}

async function saveSettings() {
  const payload = {
    autoSaveEnabled: refs.autoSaveEnabled.value === "true",
    autoSaveInterval: refs.autoSaveInterval.value,
    autoSyncEnabled: refs.autoSyncEnabled.value === "true",
    autoSyncInterval: refs.autoSyncInterval.value,
  };
  state.bootstrap.settings = await jsonFetch("/api/workspace/settings", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  await reload();
  refs.actionNote.textContent = "\u8a2d\u5b9a\u3092\u66f4\u65b0\u3057\u307e\u3057\u305f";
}

function loadPhoto(file) {
  if (!file) {
    state.pendingPhoto = null;
    refs.photoPreviewCard.classList.add("hidden");
    return;
  }
  const reader = new FileReader();
  reader.onload = () => {
    state.pendingPhoto = {
      name: file.name,
      mimeType: file.type || "image/jpeg",
      dataUrl: reader.result,
    };
    refs.photoPreviewImage.src = reader.result;
    refs.photoPreviewCard.classList.remove("hidden");
    scheduleSaveAndSync();
  };
  reader.readAsDataURL(file);
}

function toggleSettings() {
  state.settingsOpen = !state.settingsOpen;
  refs.settingsPanel.classList.toggle("hidden", !state.settingsOpen);
  refs.settingsToggle.textContent = state.settingsOpen ? TEXT.settingsToggleClose : TEXT.settingsToggleOpen;
}

function bindEvents() {
  refs.settingsToggle.addEventListener("click", toggleSettings);
  refs.headlineInput.addEventListener("input", scheduleSaveAndSync);
  refs.bodyInput.addEventListener("input", scheduleSaveAndSync);
  refs.photoButton.addEventListener("click", () => refs.photoInput.click());
  refs.clearPhotoButton.addEventListener("click", () => {
    refs.photoInput.value = "";
    state.pendingPhoto = null;
    refs.photoPreviewCard.classList.add("hidden");
  });
  refs.photoInput.addEventListener("change", (event) => {
    const file = event.target.files && event.target.files[0];
    loadPhoto(file);
  });
  refs.saveButton.addEventListener("click", () => saveEntry(true));
  refs.syncButton.addEventListener("click", () => syncEntry(true));
  refs.deleteButton.addEventListener("click", () => {
    if (state.selectedRecordId) removeEntry(state.selectedRecordId);
  });
  [refs.autoSaveEnabled, refs.autoSaveInterval, refs.autoSyncEnabled, refs.autoSyncInterval].forEach((element) => {
    element.addEventListener("change", saveSettings);
  });
}

async function main() {
  setStaticText();
  bootstrapSettingsUI();
  bindEvents();
  await reload();
}

main().catch((error) => {
  refs.actionNote.textContent = error.message;
});
