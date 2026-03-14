import { describe, expect, it } from "vitest";

import { DataWorkspaceController } from "../../src/data-workspace/controller/DataWorkspaceController";
import type { DatasetRecord } from "../../src/data-workspace/model/DatasetRecord";
import type { DatasetRepository, DatasetResultRecord } from "../../src/data-workspace/model/DatasetRepository";

class StubDatasetRepository implements DatasetRepository {
  private readonly results: DatasetResultRecord[] = [];

  public constructor(
    private readonly datasets: DatasetRecord[],
    private readonly readOnly = false
  ) {}

  public listDatasets(): DatasetRecord[] {
    return this.datasets;
  }

  public updateDataset(datasetId: string, status: string, recordCount: number): DatasetRecord {
    const index = this.datasets.findIndex((dataset) => dataset.id === datasetId);
    const updated = {
      ...this.datasets[index],
      status,
      recordCount,
      updatedAt: "2026-03-14T10:00:00Z"
    };
    this.datasets[index] = updated;
    this.results.unshift({
      id: `result-${this.results.length + 1}`,
      datasetId,
      summary: `${updated.name} updated to ${status} (${recordCount} records)`,
      createdAt: "2026-03-14T10:00:00Z"
    });
    return updated;
  }

  public listResults(): DatasetResultRecord[] {
    return this.results;
  }

  public getSourcePolicy(): string {
    return this.readOnly ? "filesystem recursive read-only" : "Seed bootstrap + in-app update";
  }

  public isReadOnly(): boolean {
    return this.readOnly;
  }
}

describe("DataWorkspaceController", () => {
  it("returns datasets sorted by updatedAt descending and aggregates rows by status", () => {
    const controller = new DataWorkspaceController(
      new StubDatasetRepository([
        {
          id: "dataset-1",
          name: "Doc Sync Coverage",
          category: "document",
          recordCount: 12,
          status: "ready",
          updatedAt: "2026-03-14T08:30:00Z"
        },
        {
          id: "dataset-2",
          name: "Correction Result Summary",
          category: "result",
          recordCount: 5,
          status: "draft",
          updatedAt: "2026-03-14T09:30:00Z"
        },
        {
          id: "dataset-3",
          name: "Research Backlog",
          category: "process",
          recordCount: 7,
          status: "ready",
          updatedAt: "2026-03-13T20:30:00Z"
        }
      ])
    );

    const state = controller.createState();

    expect(state.datasets.map((dataset) => dataset.id)).toEqual([
      "dataset-2",
      "dataset-1",
      "dataset-3"
    ]);
    expect(state.summary.totalDatasets).toBe(3);
    expect(state.summary.totalRecords).toBe(24);
    expect(state.summary.byStatus).toEqual([
      { status: "draft", datasetCount: 1, recordCount: 5 },
      { status: "ready", datasetCount: 2, recordCount: 19 }
    ]);
    expect(state.sourcePolicy).toContain("Seed");
    expect(state.isReadOnly).toBe(false);
  });

  it("records a result summary when a dataset is updated", () => {
    const controller = new DataWorkspaceController(
      new StubDatasetRepository([
        {
          id: "dataset-1",
          name: "Doc Sync Coverage",
          category: "document",
          recordCount: 12,
          status: "ready",
          updatedAt: "2026-03-14T08:30:00Z"
        }
      ])
    );

    const state = controller.updateDataset("dataset-1", "review", 14);

    expect(state.datasets[0].status).toBe("review");
    expect(state.results[0]?.summary).toContain("review");
  });
});
