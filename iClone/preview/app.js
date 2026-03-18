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
    const images = (record.attachments || []).filter((item) => (item.mimeType || "").startsWith("image/"));
    return total + images.length;
  }, 0);
}

function latestQuestion(records) {
  for (const record of records) {
    if (record.questions && record.questions.length > 0) {
      return record.questions[0].body || "次の質問は準備中です。";
    }
  }
  return "まだ質問は届いていません。";
}

function renderHero(status) {
  const deviceChip = document.getElementById("deviceChip");
  const syncChip = document.getElementById("syncChip");
  const connected = Boolean(status.health.deviceConnected);
  deviceChip.textContent = connected
    ? `Xperia 5 III 接続中 (${status.health.deviceSerial || "serial unknown"})`
    : "Xperia 5 III 未接続";
  deviceChip.className = `status-chip ${connected ? "connected" : "pending"}`;

  const reverseReady = Boolean(status.health.reverseSyncReady);
  syncChip.textContent = reverseReady
    ? `次の質問を ${status.health.pushedQuestions || 0} 件返送済み`
    : "次の質問を準備中";
  syncChip.className = `status-chip ${reverseReady ? "connected" : "pending"}`;
}

function renderSummary(status, records) {
  document.getElementById("memoCount").textContent = `${records.length}`;
  document.getElementById("photoCount").textContent = `${countPhotos(records)}`;
  document.getElementById("questionCount").textContent = `${records.filter((item) => (item.questions || []).length > 0).length}`;
  document.getElementById("reverseSyncCount").textContent = `${status.counts.edgeOutboxYaml}`;
}

function renderFocus(status, records) {
  const latest = records[0];
  if (!latest) {
    return;
  }
  document.getElementById("latestHeadline").textContent = latest.headline || latest.entryId;
  document.getElementById("latestMeta").textContent = `${latest.projectId} / ${latest.capturedAt || "-"} / ${latest.inputMode || "-"}`;
  document.getElementById("latestBody").textContent = latest.body || "メモ本文はまだありません。";
  document.getElementById("latestQuestion").textContent = latestQuestion(records);
}

function renderWorkspace(records) {
  const root = document.getElementById("workspaceList");
  root.innerHTML = "";

  records.forEach((record) => {
    const card = document.createElement("article");
    card.className = "record-card";
    const tags = (record.attachments || []).map((item) => {
      const mime = item.mimeType || "attachment";
      return `<span class="tag">${mime}</span>`;
    }).join("");
    const question = (record.questions || [])[0];

    card.innerHTML = `
      <h3>${record.headline || record.entryId}</h3>
      <p class="record-meta">${record.capturedAt || "-"} / ${record.inputMode || "-"} / ${record.syncState || "-"}</p>
      <p>${record.body || ""}</p>
      ${question ? `<div class="question-box"><strong>次の質問</strong><div>${question.body || ""}</div></div>` : ""}
      <div class="record-tags">${tags || '<span class="tag">text</span>'}</div>
    `;
    root.appendChild(card);
  });
}

function renderGallery(records) {
  const gallery = document.getElementById("photoGallery");
  gallery.innerHTML = "";
  const photos = [];
  records.forEach((record) => {
    (record.attachments || []).forEach((item) => {
      if ((item.mimeType || "").startsWith("image/") && item.previewUrl) {
        photos.push({
          url: item.previewUrl,
          headline: record.headline || record.entryId,
          meta: `${record.capturedAt || "-"} / ${record.projectId}`,
        });
      }
    });
  });

  if (photos.length === 0) {
    gallery.innerHTML = "<p>写真はまだ同期されていません。</p>";
    return;
  }

  photos.slice(0, 6).forEach((photo) => {
    const card = document.createElement("article");
    card.className = "photo-card";
    card.innerHTML = `
      <img src="${photo.url}" alt="${photo.headline}">
      <div class="photo-caption">
        <strong>${photo.headline}</strong>
        <div>${photo.meta}</div>
      </div>
    `;
    gallery.appendChild(card);
  });
}

function renderSync(status) {
  const root = document.getElementById("syncList");
  const items = [
    {
      title: "端末接続",
      body: status.health.deviceConnected
        ? `Xperia 5 III (${status.health.deviceSerial || "serial unknown"}) が認識されています。`
        : "端末が未接続です。USB 接続と USB デバッグを確認してください。",
    },
    {
      title: "メモ取り込み",
      body: `${status.health.mirroredEntries || 0} 件のメモを今回取り込みました。`,
    },
    {
      title: "逆同期",
      body: `${status.health.pushedQuestions || 0} 件の質問を端末へ返送しました。`,
    },
    {
      title: "サービス",
      body: `observer=${status.services.observer} / adbBridge=${status.services.adbBridge} / syncthing=${status.services.syncthing}`,
    },
  ];

  root.innerHTML = items.map((item) => `
    <li class="sync-item">
      <strong>${item.title}</strong>
      <span>${item.body}</span>
    </li>
  `).join("");
}

function render(payload) {
  const records = [...payload.review.records].reverse();
  renderHero(payload.status);
  renderSummary(payload.status, records);
  renderFocus(payload.status, records);
  renderWorkspace(records);
  renderGallery(records);
  renderSync(payload.status);
}

try {
  render(loadSnapshot());
} catch (error) {
  document.body.insertAdjacentHTML("beforeend", `<pre>${error}</pre>`);
}
