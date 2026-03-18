const state = {
  history: loadHistory(),
};

function $(id) {
  return document.getElementById(id);
}

function loadHistory() {
  try {
    return JSON.parse(localStorage.getItem("iagents-range-history") || "[]");
  } catch {
    return [];
  }
}

function saveHistory() {
  localStorage.setItem("iagents-range-history", JSON.stringify(state.history.slice(0, 5)));
}

async function postJson(url, payload) {
  const response = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return response.json();
}

function showJson(targetId, payload) {
  $(targetId).textContent = JSON.stringify(payload, null, 2);
}

function syncRangeFields(value) {
  $("rangeInput").value = value;
  $("snapRangeInput").value = value;
  $("intentRangeInput").value = value;
}

function renderHistory() {
  const list = $("historyList");
  list.innerHTML = "";
  if (!state.history.length) {
    list.innerHTML = "<p class='hint'>まだ履歴はありません。</p>";
    return;
  }
  state.history.slice(0, 5).forEach((item) => {
    const wrapper = document.createElement("div");
    wrapper.className = "history-item";
    const label = document.createElement("div");
    label.textContent = item;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "復元";
    button.addEventListener("click", () => {
      syncRangeFields(item);
      $("historyResult").textContent = `復元候補を反映しました。\n${item}`;
    });
    wrapper.append(label, button);
    list.appendChild(wrapper);
  });
}

function initShadowBar() {
  $("shadowToggle").addEventListener("click", () => {
    $("shadowBar").classList.toggle("open");
  });
}

async function refreshHalo() {
  const result = await postJson("/api/halo/state", {
    mode: $("modeSelect").value,
    ime_state: $("imeSelect").value,
  });
  $("haloIndicator").textContent = `${result.mode} / ${result.ime_state}`;
  showJson("haloResult", result);
}

function initModeHalo() {
  $("refreshHaloButton").addEventListener("click", refreshHalo);
  $("modeSelect").addEventListener("change", refreshHalo);
  $("imeSelect").addEventListener("change", refreshHalo);
}

function initRangeAssistant() {
  $("suggestRangeButton").addEventListener("click", async () => {
    const payload = {
      range_text: $("rangeInput").value.trim(),
      visible_rows: Number($("visibleRows").value || 20),
      visible_cols: Number($("visibleCols").value || 8),
    };
    const result = await postJson("/api/range/suggest", payload);
    showJson("rangeResult", result);
    if (payload.range_text) {
      syncRangeFields(payload.range_text);
    }
  });

  $("saveRangeHistoryButton").addEventListener("click", async () => {
    const value = $("rangeInput").value.trim();
    if (!value) {
      $("historyResult").textContent = "range を入れてから保存してください。";
      return;
    }
    const result = await postJson("/api/history/record", {
      history: state.history,
      new_range: value,
    });
    state.history = result.history;
    saveHistory();
    renderHistory();
    showJson("historyResult", result);
  });
}

function initSnapAssistant() {
  $("previewSnapButton").addEventListener("click", async () => {
    const payload = {
      range_text: $("snapRangeInput").value.trim(),
      occupied_rows: Number($("occupiedRows").value || 20),
      occupied_cols: Number($("occupiedCols").value || 8),
    };
    const result = await postJson("/api/snap/preview", payload);
    showJson("snapResult", result);
  });
}

function initPasteAssistant() {
  $("cleanPasteButton").addEventListener("click", async () => {
    const result = await postJson("/api/paste/clean", {
      text: $("pasteInput").value,
      single_cell: $("singleCellInput").checked,
    });
    showJson("pasteResult", result);
  });
}

function initSynthesisAssistant() {
  $("synthesizeButton").addEventListener("click", async () => {
    const result = await postJson("/api/data/synthesize", {
      datasets: [$("datasetA").value, $("datasetB").value],
    });
    showJson("synthesisResult", result);
  });
}

function initGraphAssistant() {
  $("graphSuggestButton").addEventListener("click", async () => {
    const result = await postJson("/api/graph/suggest", {
      table_text: $("graphInput").value,
    });
    showJson("graphResult", result);
  });
}

function initIntentAssistant() {
  $("interpretButton").addEventListener("click", async () => {
    const result = await postJson("/api/intent/interpret", {
      command: $("intentInput").value,
      current_range: $("intentRangeInput").value,
    });
    showJson("intentResult", result);
  });
}

function bootstrap() {
  initShadowBar();
  initModeHalo();
  initRangeAssistant();
  initSnapAssistant();
  initPasteAssistant();
  initSynthesisAssistant();
  initGraphAssistant();
  initIntentAssistant();
  renderHistory();
  refreshHalo();
}

bootstrap();
