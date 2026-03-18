(function bridgeBootstrap() {
  const LOCAL_ENDPOINT = "http://127.0.0.1:8765/api/bridge/state";

  function findSelectionCandidate() {
    const selectors = [
      "[aria-label*='名前']",
      "[aria-label*='Name']",
      "[data-automationid='NameBox']",
      "input[title*='Name']",
      "input[title*='名前']"
    ];
    for (const selector of selectors) {
      const element = document.querySelector(selector);
      if (element && element.value) {
        return element.value;
      }
    }
    const active = document.querySelector("[data-automationid='CellEditor'], [contenteditable='true']");
    if (active && active.dataset && active.dataset.address) {
      return active.dataset.address;
    }
    return "";
  }

  function guessMode() {
    const active = document.activeElement;
    if (!active) {
      return "selection";
    }
    if (active.matches("input, textarea, [contenteditable='true']")) {
      const value = active.value || active.textContent || "";
      return value.trim().startsWith("=") ? "formula" : "edit";
    }
    return "selection";
  }

  function collectState() {
    const title = document.title || "";
    const workbookName = title.split("-")[0]?.trim() || "";
    return {
      source: "browser_bridge",
      page_url: location.href,
      page_title: title,
      workbook_name: workbookName,
      worksheet_name: "",
      selection: findSelectionCandidate(),
      mode: guessMode(),
      ime_state: "auto",
      table_preview: []
    };
  }

  async function sendState() {
    try {
      await fetch(LOCAL_ENDPOINT, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(collectState())
      });
    } catch (error) {
      console.debug("iAgents bridge relay failed", error);
    }
  }

  window.addEventListener("focus", sendState);
  document.addEventListener("selectionchange", sendState);
  document.addEventListener("keyup", sendState);
  setInterval(sendState, 4000);
  sendState();
})();
