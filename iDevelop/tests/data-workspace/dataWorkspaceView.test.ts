import { describe, expect, it } from "vitest";

import type { DataWorkspaceState } from "../../src/data-workspace/controller/DataWorkspaceController";
import { DataWorkspaceView } from "../../src/data-workspace/view/DataWorkspaceView";

const state: DataWorkspaceState = {
  datasets: [
    {
      id: "dataset-2",
      name: "Correction Result Summary",
      category: "result",
      recordCount: 5,
      status: "draft",
      updatedAt: "2026-03-14T09:30:00Z"
    },
    {
      id: "dataset-1",
      name: "Doc Sync Coverage",
      category: "document",
      recordCount: 12,
      status: "ready",
      updatedAt: "2026-03-14T08:30:00Z"
    }
  ],
  results: [
    {
      id: "result-1",
      datasetId: "dataset-2",
      summary: "Correction Result Summary updated to draft (5 records)",
      createdAt: "2026-03-14T09:30:00Z"
    }
  ],
  summary: {
    totalDatasets: 2,
    totalRecords: 17,
    byStatus: [
      { status: "draft", datasetCount: 1, recordCount: 5 },
      { status: "ready", datasetCount: 1, recordCount: 12 }
    ]
  }
};

describe("DataWorkspaceView", () => {
  it("renders aggregate metrics, dataset rows, and status chart bars", () => {
    const container = document.createElement("section");
    const view = new DataWorkspaceView(container);

    view.render(state);

    expect(container.querySelector("[data-role='total-datasets']")?.textContent).toContain("2");
    expect(container.querySelector("[data-role='total-records']")?.textContent).toContain("17");
    expect(container.querySelectorAll("[data-role='dataset-row']")).toHaveLength(2);
    expect(container.querySelector("[data-role='chart-bar'][data-status='ready']")?.getAttribute("style")).toContain("100%");
    expect(container.querySelectorAll("[data-role='result-row']")).toHaveLength(1);
  });
});
