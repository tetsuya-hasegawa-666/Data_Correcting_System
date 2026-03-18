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

function renderHistory() {
  const list = $("historyList");
  list.innerHTML = "";
  if (!state.history.length) {
    list.innerHTML = "<p class='hint'>まだ履歴はありません。</p>";
    return;
  }
  state.history.slice(0, 5).forEach((item, index) => {
    const wrapper = document.createElement("div");
    wrapper.className = "history-item";
    const label = document.createElement("div");
    label.textContent = item;
    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "戻す";
    button.addEventListener("click", () => {
      $("rangeInput").value = item;
      $("intentRangeInput").value = item;
      $("rangeResult").textContent = `履歴 ${index + 1} を現在 range に戻しました。\n${item}`;
    });
    wrapper.append(label, button);
    list.appendChild(wrapper);
  });
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

function initShadowBar() {
  $("shadowToggle").addEventListener("click", () => {
    $("shadowBar").classList.toggle("open");
  });
}

function initModeHalo() {
  $("modeSelect").addEventListener("change", (event) => {
    $("haloIndicator").textContent = event.target.value;
  });
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
  });
  $("saveRangeHistoryButton").addEventListener("click", () => {
    const value = $("rangeInput").value.trim();
    if (!value) {
      $("rangeResult").textContent = "range を入力してから保存してください。";
      return;
    }
    state.history = [value, ...state.history.filter((item) => item !== value)].slice(0, 5);
    saveHistory();
    renderHistory();
    $("rangeResult").textContent = `履歴へ保存しました。\n${value}`;
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
  initPasteAssistant();
  initSynthesisAssistant();
  initGraphAssistant();
  initIntentAssistant();
  renderHistory();
  $("shadowBar").classList.add("open");
}

bootstrap();
