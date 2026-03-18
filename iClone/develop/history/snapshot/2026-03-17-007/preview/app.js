async function loadSnapshot() {
  const [statusResponse, reviewResponse] = await Promise.all([
    fetch("../runtime/logs/status_snapshot.json"),
    fetch("../runtime/logs/review_snapshot.json"),
  ]);
  return {
    status: await statusResponse.json(),
    review: await reviewResponse.json(),
  };
}

function render(payload) {
  const snapshot = payload.status;
  document.getElementById("hostInboxYaml").textContent = `${snapshot.counts.hostInboxYaml} yaml`;
  document.getElementById("recordsYaml").textContent = `${snapshot.counts.recordsYaml} yaml`;
  document.getElementById("llmInboxYaml").textContent = `${snapshot.counts.llmInboxYaml} yaml`;

  const services = document.getElementById("services");
  services.innerHTML = "";
  Object.entries(snapshot.services).forEach(([name, state]) => {
    const item = document.createElement("li");
    item.textContent = `${name}: ${state}`;
    services.appendChild(item);
  });

  const records = document.getElementById("records");
  records.innerHTML = "";
  payload.review.entries.forEach((entry) => {
    const card = document.createElement("article");
    card.className = "record";
    card.innerHTML = `
      <h3>${entry.entryType} / ${entry.projectId}</h3>
      <p>${entry.body || entry.suggestedMetric || "body not available"}</p>
      <small>${entry.capturedAt}</small>
      ${entry.nextQuestion ? `<p class="next">next: ${entry.nextQuestion}</p>` : ""}
    `;
    records.appendChild(card);
  });
}

loadSnapshot().then(render).catch((error) => {
  document.body.insertAdjacentHTML("beforeend", `<pre>${error}</pre>`);
});
