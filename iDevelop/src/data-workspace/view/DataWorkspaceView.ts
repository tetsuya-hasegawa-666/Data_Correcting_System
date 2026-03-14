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
            <td>${this.escapeHtml(this.getCategoryLabel(dataset.category))}</td>
            <td>
              <select data-role="dataset-status" data-dataset-id="${this.escapeHtml(dataset.id)}">
                ${["draft", "ready", "review"]
                  .map(
                    (status) =>
                      `<option value="${status}" ${
                        dataset.status === status ? "selected" : ""
                      }>${this.getStatusLabel(status)}</option>`
                  )
                  .join("")}
              </select>
            </td>
            <td>
              <input data-role="dataset-record-count" data-dataset-id="${this.escapeHtml(dataset.id)}" type="number" min="0" value="${dataset.recordCount}" />
            </td>
            <td>${this.escapeHtml(dataset.updatedAt)}</td>
            <td><button class="document-item" data-role="save-dataset" data-dataset-id="${this.escapeHtml(dataset.id)}" type="button">更新</button></td>
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
          <p class="eyebrow">データ</p>
          <h2>ダミーデータの確認と更新</h2>
          <p>データ一覧、件数、状態別サマリーを確認し、仮更新の体験を試せます。</p>
        </div>
        <div class="metric-grid">
          <article class="metric-card">
            <p class="eyebrow">データセット数</p>
            <strong data-role="total-datasets">${state.summary.totalDatasets}</strong>
          </article>
          <article class="metric-card">
            <p class="eyebrow">総レコード数</p>
            <strong data-role="total-records">${state.summary.totalRecords}</strong>
          </article>
        </div>
        <div class="status-chart">${chartMarkup}</div>
        <table class="dataset-table">
          <thead>
            <tr>
              <th>名称</th>
              <th>分類</th>
              <th>状態</th>
              <th>レコード数</th>
              <th>更新日時</th>
              <th>操作</th>
            </tr>
          </thead>
          <tbody>${rowsMarkup}</tbody>
        </table>
        <section class="status-chart">
          <p class="eyebrow">更新結果</p>
          <ul class="result-list">${resultMarkup || "<li>まだ更新結果はありません。</li>"}</ul>
        </section>
      </section>
    `;
  }

  private renderChartBar(item: DatasetStatusSummary, maxRecordCount: number): string {
    const ratio = Math.round((item.recordCount / maxRecordCount) * 100);

    return `
      <div class="chart-row">
        <span>${this.escapeHtml(this.getStatusLabel(item.status))}</span>
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

  private getStatusLabel(status: string): string {
    switch (status) {
      case "draft":
        return "下書き";
      case "ready":
        return "準備完了";
      case "review":
        return "レビュー中";
      default:
        return status;
    }
  }

  private getCategoryLabel(category: string): string {
    switch (category) {
      case "document":
        return "文書";
      case "result":
        return "結果";
      case "process":
        return "運用";
      default:
        return category;
    }
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
