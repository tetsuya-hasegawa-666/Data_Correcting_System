function loadSnapshot() {
  const status = window.__ICLONE_STATUS_SNAPSHOT__;
  const review = window.__ICLONE_REVIEW_SNAPSHOT__;
  if (!status || !review) {
    throw new Error("preview data not found. Run the snapshot builders first.");
  }
  return { status, review };
}

function countPhotos(records) {
  return records.reduce((total, record) => {
    const images = (record.attachments || []).filter((item) => String(item.mimeType || "").startsWith("image/"));
    return total + images.length;
  }, 0);
}

function currentStage(status, records) {
  const hasLocal = records.length > 0;
  const hasPc = Number(status.health.mirroredEntries || 0) > 0;
  const hasSynced = Number(status.health.pushedQuestions || 0) > 0 || records.some((record) => (record.questions || []).length > 0);
  if (hasSynced) return "pcSynced";
  if (hasPc) return "pc";
  if (hasLocal) return "local";
  return "none";
}

function applyStatusCard(element, labelElement, marker, className) {
  element.className = `status-card ${className}`;
  labelElement.textContent = `${marker} ${labelElement.dataset.name}`;
}

function renderStatusRail(stage) {
  const cards = {
    local: document.getElementById("desktopLocalCard"),
    pc: document.getElementById("desktopPcCard"),
    pcSynced: document.getElementById("desktopPcSyncedCard"),
  };
  const labels = {
    local: document.getElementById("desktopLocalLabel"),
    pc: document.getElementById("desktopPcLabel"),
    pcSynced: document.getElementById("desktopPcSyncedLabel"),
  };

  labels.local.dataset.name = "Local";
  labels.pc.dataset.name = "PC";
  labels.pcSynced.dataset.name = "PC synced";

  if (stage === "pcSynced") {
    applyStatusCard(cards.local, labels.local, "✓", "complete");
    applyStatusCard(cards.pc, labels.pc, "✓", "complete");
    applyStatusCard(cards.pcSynced, labels.pcSynced, "✓", "current");
    return;
  }
  if (stage === "pc") {
    applyStatusCard(cards.local, labels.local, "✓", "complete");
    applyStatusCard(cards.pc, labels.pc, "✓", "current");
    applyStatusCard(cards.pcSynced, labels.pcSynced, "×", "pending");
    return;
  }
  if (stage === "local") {
    applyStatusCard(cards.local, labels.local, "✓", "current");
    applyStatusCard(cards.pc, labels.pc, "×", "pending");
    applyStatusCard(cards.pcSynced, labels.pcSynced, "×", "pending");
    return;
  }
  applyStatusCard(cards.local, labels.local, "×", "pending");
  applyStatusCard(cards.pc, labels.pc, "×", "pending");
  applyStatusCard(cards.pcSynced, labels.pcSynced, "×", "pending");
}

function renderSummary(status, records) {
  document.getElementById("memoCount").textContent = String(records.length);
  document.getElementById("photoCount").textContent = String(countPhotos(records));
  document.getElementById("questionCount").textContent = String(records.filter((record) => (record.questions || []).length > 0).length);
  document.getElementById("reverseSyncCount").textContent = String(status.counts.edgeOutboxYaml || 0);
}

function firstQuestion(record) {
  return (record.questions || [])[0] || null;
}

function renderFocus(records) {
  const latest = records[0];
  const questionRoot = document.getElementById("latestQuestion");
  if (!latest) {
    document.getElementById("latestHeadline").textContent = "まだメモがありません。";
    document.getElementById("latestMeta").textContent = "-";
    document.getElementById("latestBody").textContent = "スマホでメモすると、ここへコピーされます。";
    questionRoot.textContent = "まだ質問がありません。";
    questionRoot.classList.add("waiting");
    return;
  }

  document.getElementById("latestHeadline").textContent = latest.headline || latest.entryId;
  document.getElementById("latestMeta").textContent = `${latest.projectId || "-"} / ${latest.capturedAt || "-"} / ${latest.inputMode || "-"}`;
  document.getElementById("latestBody").textContent = latest.body || "本文はまだありません。";

  const question = firstQuestion(latest);
  if (question && question.body) {
    questionRoot.textContent = question.body;
    questionRoot.classList.remove("waiting");
  } else {
    questionRoot.textContent = "まだ質問がありません。";
    questionRoot.classList.add("waiting");
  }
}

function renderWorkspace(records) {
  const root = document.getElementById("workspaceList");
  if (records.length === 0) {
    root.innerHTML = '<div class="empty">まだ PC に届いたメモがありません。</div>';
    return;
  }

  root.innerHTML = records.map((record) => {
    const tags = (record.attachments || []).map((item) => `<span class="tag">${item.mimeType || "attachment"}</span>`).join("");
    const question = firstQuestion(record);
    return `
      <article class="record-card">
        <div class="record-head">
          <h3>${record.headline || record.entryId}</h3>
          <span class="record-stage">${record.syncState || "local_saved"}</span>
        </div>
        <p class="record-meta">${record.capturedAt || "-"} / ${record.inputMode || "-"} / ${record.projectId || "-"}</p>
        <p class="record-body">${record.body || ""}</p>
        ${question ? `<div class="question-box"><strong>次の質問</strong><span>${question.body || ""}</span></div>` : ""}
        <div class="record-tags">${tags || '<span class="tag">text</span>'}</div>
      </article>
    `;
  }).join("");
}

function renderGallery(records) {
  const root = document.getElementById("photoGallery");
  const photos = [];
  records.forEach((record) => {
    (record.attachments || []).forEach((item) => {
      if (String(item.mimeType || "").startsWith("image/") && item.previewUrl) {
        photos.push({
          headline: record.headline || record.entryId,
          meta: `${record.capturedAt || "-"} / ${record.projectId || "-"}`,
          url: item.previewUrl,
        });
      }
    });
  });

  if (photos.length === 0) {
    root.innerHTML = '<div class="empty">まだ写真がありません。</div>';
    return;
  }

  root.innerHTML = photos.slice(0, 8).map((photo) => `
    <article class="photo-card">
      <img src="${photo.url}" alt="${photo.headline}">
      <div class="photo-caption">
        <strong>${photo.headline}</strong>
        <div>${photo.meta}</div>
      </div>
    </article>
  `).join("");
}

function renderSync(status) {
  const items = [
    {
      title: "端末接続",
      body: status.health.deviceConnected
        ? `Xperia 5 III (${status.health.deviceSerial || "serial unknown"}) を確認しています。`
        : "Xperia 5 III の接続待ちです。",
    },
    {
      title: "PC コピー",
      body: `${status.health.mirroredEntries || 0} 件のメモを PC ワークスペースへ反映しています。`,
    },
    {
      title: "質問返送",
      body: `${status.health.pushedQuestions || 0} 件の質問をスマホへ戻しています。`,
    },
    {
      title: "サービス",
      body: `observer=${status.services.observer} / adbBridge=${status.services.adbBridge} / syncthing=${status.services.syncthing}`,
    },
  ];

  document.getElementById("syncList").innerHTML = items.map((item) => `
    <li class="sync-item">
      <strong>${item.title}</strong>
      <span>${item.body}</span>
    </li>
  `).join("");
}

function render(payload) {
  const records = [...payload.review.records].reverse();
  renderStatusRail(currentStage(payload.status, records));
  renderSummary(payload.status, records);
  renderFocus(records);
  renderWorkspace(records);
  renderGallery(records);
  renderSync(payload.status);
}

try {
  render(loadSnapshot());
} catch (error) {
  document.body.insertAdjacentHTML("beforeend", `<pre>${error}</pre>`);
}
