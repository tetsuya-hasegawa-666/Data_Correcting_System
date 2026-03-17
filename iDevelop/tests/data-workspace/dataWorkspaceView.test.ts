import { describe, expect, it } from "vitest";

import type { DataWorkspaceState } from "../../src/data-workspace/controller/DataWorkspaceController";
import { DataWorkspaceView } from "../../src/data-workspace/view/DataWorkspaceView";

const state: DataWorkspaceState = {
  datasets: [
    {
      id: "dataset-2",
      name: "session-20260317-01",
      category: "session",
      recordCount: 5,
      status: "ready",
      updatedAt: "2026-03-14T09:30:00Z",
      path: "iSensorium/tmp/session-20260317-01",
      topDirectory: "iSensorium",
      recordingMode: "pocket_recording",
      requestedRoute: "frozen_camerax_arcore",
      activeRoute: "frozen_camerax_arcore",
      files: [
        {
          name: "session_manifest.json",
          relativePath: "iSensorium/tmp/session-20260317-01/session_manifest.json",
          sizeBytes: 512,
          present: true
        }
      ],
      download: {
        kind: "directory",
        relativePath: "iSensorium/tmp/session-20260317-01",
        fileName: "session-20260317-01.zip"
      },
      previewText: "sessionId: session-20260317-01"
    },
    {
      id: "dataset-1",
      name: "summary",
      category: "json",
      recordCount: 12,
      status: "draft",
      updatedAt: "2026-03-14T08:30:00Z",
      path: "exports/summary.json",
      topDirectory: "exports"
    }
  ],
  results: [
    {
      id: "result-1",
      datasetId: "dataset-2",
      summary: "session-20260317-01 updated to ready (5 records)",
      createdAt: "2026-03-14T09:30:00Z"
    }
  ],
  selectedDatasets: [
    {
      id: "dataset-2",
      name: "session-20260317-01",
      category: "session",
      recordCount: 5,
      status: "ready",
      updatedAt: "2026-03-14T09:30:00Z"
    }
  ],
  selectedDataset: {
    id: "dataset-2",
    name: "session-20260317-01",
    category: "session",
    recordCount: 5,
    status: "ready",
    updatedAt: "2026-03-14T09:30:00Z",
    path: "iSensorium/tmp/session-20260317-01",
    topDirectory: "iSensorium",
    recordingMode: "pocket_recording",
    requestedRoute: "frozen_camerax_arcore",
    activeRoute: "frozen_camerax_arcore",
    files: [
      {
        name: "session_manifest.json",
        relativePath: "iSensorium/tmp/session-20260317-01/session_manifest.json",
        sizeBytes: 512,
        present: true
      }
    ],
    download: {
      kind: "directory",
      relativePath: "iSensorium/tmp/session-20260317-01",
      fileName: "session-20260317-01.zip"
    },
    previewText: "sessionId: session-20260317-01"
  },
  directoryGroups: [
    {
      topDirectory: "exports",
      datasets: [
        {
          id: "dataset-1",
          name: "summary",
          category: "json",
          recordCount: 12,
          status: "draft",
          updatedAt: "2026-03-14T08:30:00Z",
          path: "exports/summary.json",
          topDirectory: "exports"
        }
      ]
    },
    {
      topDirectory: "iSensorium",
      datasets: [
        {
          id: "dataset-2",
          name: "session-20260317-01",
          category: "session",
          recordCount: 5,
          status: "ready",
          updatedAt: "2026-03-14T09:30:00Z",
          path: "iSensorium/tmp/session-20260317-01",
          topDirectory: "iSensorium",
          recordingMode: "pocket_recording",
          requestedRoute: "frozen_camerax_arcore",
          activeRoute: "frozen_camerax_arcore",
          files: [
            {
              name: "session_manifest.json",
              relativePath: "iSensorium/tmp/session-20260317-01/session_manifest.json",
              sizeBytes: 512,
              present: true
            }
          ],
          download: {
            kind: "directory",
            relativePath: "iSensorium/tmp/session-20260317-01",
            fileName: "session-20260317-01.zip"
          },
          previewText: "sessionId: session-20260317-01"
        }
      ]
    }
  ],
  sourcePolicy: "filesystem recursive read-only",
  isReadOnly: true,
  consultation: {
    selectedDatasetIds: ["dataset-2"],
    selectedDatasetId: "dataset-2",
    focusPrompt: "確認したい異常点",
    lastResponse: {
      summary: "1 件のアーカイブ候補を consultation bundle として固定しました。",
      evidence: ["session-20260317-01 (準備完了, 5 files)"],
      nextAction: "focus: 確認したい異常点"
    }
  },
  issue: null,
  summary: {
    totalDatasets: 2,
    totalRecords: 17,
    byStatus: [
      { status: "draft", datasetCount: 1, recordCount: 12 },
      { status: "ready", datasetCount: 1, recordCount: 5 }
    ]
  }
};

describe("DataWorkspaceView", () => {
  it("renders archive explorer, preview, and download action", () => {
    const container = document.createElement("section");
    const view = new DataWorkspaceView(container);

    view.render(state);

    expect(container.querySelector("[data-role='total-datasets']")?.textContent).toContain("2");
    expect(container.querySelectorAll("[data-role='dataset-row']")).toHaveLength(2);
    expect(
      container.querySelector("[data-role='chart-bar'][data-status='draft']")?.getAttribute("style")
    ).toContain("100%");
    expect(container.querySelector("[data-role='selected-dataset-title']")?.textContent).toContain(
      "session-20260317-01"
    );
    expect(container.querySelector("[data-role='download-dataset']")?.getAttribute("href")).toContain(
      "/api/dashboard/download?path="
    );
    expect(container.querySelector("[data-role='data-consultation-response']")?.textContent).toContain(
      "Summary"
    );
  });

  it("renders local draft unlock guidance for read-only live data", () => {
    const container = document.createElement("section");
    const view = new DataWorkspaceView(container);

    view.render(state);

    expect(container.textContent).toContain("Read-only");
    expect(container.querySelector("[data-role='dataset-status']")).toBeNull();
    expect(container.querySelector("[data-role='save-dataset']")).toBeNull();
    expect(container.querySelector("[data-role='unlock-data-editing']")).not.toBeNull();
    expect(container.querySelector("[data-role='unlock-data-guidance']")?.textContent).toContain(
      "local draft"
    );
  });
});
