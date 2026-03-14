import type { DataWorkspaceState, DatasetStatusSummary } from "../controller/DataWorkspaceController";

export class DataWorkspaceView {
  public constructor(private readonly rootElement: HTMLElement) {}

  public render(state: DataWorkspaceState): void {
    const maxRecordCount = Math.max(...state.summary.byStatus.map((item) => item.recordCount), 1);
    const rowsMarkup = state.datasets
      .map((dataset) =>
        this.renderDatasetRow(
          dataset,
          state.isReadOnly,
          state.selectedDatasets.some((selected) => selected.id === dataset.id)
        )
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
    const sourceGuidance = state.isReadOnly
      ? `
        <div class="unlock-guidance" data-role="unlock-data-guidance">
          <p><strong>解除条件:</strong> local draft を開始すると、現在の dataset 一覧をブラウザ内の編集用コピーとして複製します。</p>
          <p><strong>何が起こるか:</strong> safe apply を進めるまで元データは変わらず、変更履歴は local draft 側だけに蓄積されます。</p>
          <button class="document-item is-selected" data-role="unlock-data-editing" type="button">local draft を開始</button>
        </div>
      `
      : `
        <div class="unlock-guidance">
          <p>現在は local draft で更新中です。変更は safe apply まで元データへ反映されません。</p>
        </div>
      `;

    this.rootElement.innerHTML = `
      <section class="data-workspace">
        <div class="section-heading">
          <p class="eyebrow">データ</p>
          <h2>データの確認と集計</h2>
          <p>データ一覧、件数、更新結果の要約を確認します。</p>
          <p class="result-count">読み込みポリシー: ${this.escapeHtml(state.sourcePolicy)}</p>
          <p class="result-count" data-role="data-mode-note">${state.isReadOnly ? "Read-only / 読み取り専用" : "Editable / 編集可能"}</p>
          ${sourceGuidance}
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
        <div class="table-wrap">
          <table class="dataset-table">
            <thead>
              <tr>
                <th>名前</th>
                <th>種別</th>
                <th>状態</th>
                <th>レコード数</th>
                <th>更新日時</th>
                <th>操作</th>
                <th>相談</th>
              </tr>
            </thead>
            <tbody>${rowsMarkup}</tbody>
          </table>
        </div>
        <section class="status-chart">
          <p class="eyebrow">更新結果</p>
          <ul class="result-list">${resultMarkup || "<li>No result yet.</li>"}</ul>
        </section>
        <section class="status-chart">
          <p class="eyebrow">Data Consultation</p>
          <p data-role="data-bundle-count">選択 ${state.selectedDatasets.length} 件</p>
          <ul data-role="data-bundle-list" class="result-list">
            ${state.selectedDatasets
              .map(
                (dataset) =>
                  `<li>${this.escapeHtml(dataset.name)} <span>${this.escapeHtml(dataset.status)}</span></li>`
              )
              .join("")}
          </ul>
          <div class="capability-note" data-role="consultation-capabilities">
            <p class="eyebrow">相談でできること</p>
            <ul>
              <li><strong>Summary</strong> bundle の要点整理</li>
              <li><strong>Evidence</strong> status と件数の参照根拠を列挙</li>
              <li><strong>Next Action</strong> anomaly や次の確認項目を示す</li>
            </ul>
          </div>
          <form data-role="data-consultation-form">
            <textarea
              class="document-editor"
              data-role="data-consultation-focus-input"
              name="data-consultation-focus"
              placeholder="相談したい観点を入力"
            >${this.escapeHtml(state.consultation.focusPrompt)}</textarea>
            <button class="document-item is-selected" data-role="run-data-consultation" type="submit">相談する</button>
          </form>
          ${
            state.consultation.lastResponse
              ? `
                <div class="document-body" data-role="data-consultation-response">
                  <p><strong>Summary</strong> ${this.escapeHtml(state.consultation.lastResponse.summary)}</p>
                  <ul>
                    ${state.consultation.lastResponse.evidence
                      .map((evidence) => `<li>${this.escapeHtml(evidence)}</li>`)
                      .join("")}
                  </ul>
                  <p><strong>Next Action</strong> ${this.escapeHtml(state.consultation.lastResponse.nextAction)}</p>
                </div>
              `
              : ""
          }
        </section>
      </section>
    `;
  }

  private renderDatasetRow(
    dataset: DataWorkspaceState["datasets"][number],
    isReadOnly: boolean,
    isSelected: boolean
  ): string {
    const statusCell = isReadOnly
      ? this.escapeHtml(this.getStatusLabel(dataset.status))
      : `
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
      `;
    const recordCountCell = isReadOnly
      ? this.escapeHtml(String(dataset.recordCount))
      : `<input data-role="dataset-record-count" data-dataset-id="${this.escapeHtml(dataset.id)}" type="number" min="0" value="${dataset.recordCount}" />`;
    const actionCell = isReadOnly
      ? '<span class="eyebrow">読み取り専用</span>'
      : `<button class="document-item" data-role="save-dataset" data-dataset-id="${this.escapeHtml(dataset.id)}" type="button">保存</button>`;

    return `
      <tr data-role="dataset-row">
        <td>${this.escapeHtml(dataset.name)}</td>
        <td>${this.escapeHtml(this.getCategoryLabel(dataset.category))}</td>
        <td>${statusCell}</td>
        <td>${recordCountCell}</td>
        <td>${this.escapeHtml(dataset.updatedAt)}</td>
        <td>${actionCell}</td>
        <td>
          <button
            class="document-item ${isSelected ? "is-selected" : ""}"
            data-role="toggle-dataset-bundle"
            data-dataset-id="${this.escapeHtml(dataset.id)}"
            type="button"
          >
            ${isSelected ? "相談対象から外す" : "相談対象に追加"}
          </button>
        </td>
      </tr>
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
      case "live":
        return "ライブ";
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
        return "プロセス";
      case "csv":
        return "CSV";
      case "json":
        return "JSON";
      case "markdown":
        return "Markdown";
      case "text":
        return "Text";
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
