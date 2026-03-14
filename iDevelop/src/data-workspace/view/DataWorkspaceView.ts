import type { DataWorkspaceState, DatasetStatusSummary } from "../controller/DataWorkspaceController";

export class DataWorkspaceView {
  public constructor(private readonly rootElement: HTMLElement) {}

  public render(state: DataWorkspaceState): void {
    const maxRecordCount = Math.max(...state.summary.byStatus.map((item) => item.recordCount), 1);

    const rowsMarkup = state.datasets
      .map(
        (dataset) => `
          <tr data-role="dataset-row">
            <td>${this.escapeHtml(dataset.name)}</td>
            <td>${this.escapeHtml(dataset.category)}</td>
            <td>
              <select data-role="dataset-status" data-dataset-id="${this.escapeHtml(dataset.id)}">
                ${["draft", "ready", "review"].map((status) => `<option value="${status}" ${dataset.status === status ? "selected" : ""}>${status}</option>`).join("")}
              </select>
            </td>
            <td>
              <input data-role="dataset-record-count" data-dataset-id="${this.escapeHtml(dataset.id)}" type="number" min="0" value="${dataset.recordCount}" />
            </td>
            <td>${this.escapeHtml(dataset.updatedAt)}</td>
            <td><button class="document-item" data-role="save-dataset" data-dataset-id="${this.escapeHtml(dataset.id)}" type="button">Update</button></td>
          </tr>
        `
      )
      .join("");

    const resultMarkup = state.results
      .map(
        (result) => `
          <li data-role="result-row">
            <strong>${this.escapeHtml(result.datasetId)}</strong> ${this.escapeHtml(result.summary)}
          </li>
        `
      )
      .join("");

    const chartMarkup = state.summary.byStatus
      .map((item) => this.renderChartBar(item, maxRecordCount))
      .join("");

    this.rootElement.innerHTML = `
      <section class="data-workspace">
        <div class="section-heading">
          <p class="eyebrow">Data Workspace</p>
          <h2>Browse seeded datasets</h2>
          <p>Must scope slice: inspect records, aggregate by status, and render a lightweight chart.</p>
        </div>
        <div class="metric-grid">
          <article class="metric-card">
            <p class="eyebrow">Datasets</p>
            <strong data-role="total-datasets">${state.summary.totalDatasets}</strong>
          </article>
          <article class="metric-card">
            <p class="eyebrow">Records</p>
            <strong data-role="total-records">${state.summary.totalRecords}</strong>
          </article>
        </div>
        <div class="status-chart">${chartMarkup}</div>
        <table class="dataset-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Category</th>
              <th>Status</th>
              <th>Records</th>
              <th>Updated</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>${rowsMarkup}</tbody>
        </table>
        <section class="status-chart">
          <p class="eyebrow">Recent Results</p>
          <ul class="result-list">${resultMarkup || "<li>No updates yet.</li>"}</ul>
        </section>
      </section>
    `;
  }

  private renderChartBar(item: DatasetStatusSummary, maxRecordCount: number): string {
    const ratio = Math.round((item.recordCount / maxRecordCount) * 100);

    return `
      <div class="chart-row">
        <span>${this.escapeHtml(item.status)}</span>
        <div class="chart-track">
          <span
            class="chart-bar"
            data-role="chart-bar"
            data-status="${this.escapeHtml(item.status)}"
            style="width: ${ratio}%"
          ></span>
        </div>
        <strong>${item.recordCount}</strong>
      </div>
    `;
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
}
