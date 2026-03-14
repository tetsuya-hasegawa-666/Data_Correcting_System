import type { DatasetRecord } from "../model/DatasetRecord";
import type { DatasetRepository, DatasetResultRecord } from "../model/DatasetRepository";

export interface DatasetStatusSummary {
  status: string;
  datasetCount: number;
  recordCount: number;
}

export interface DataWorkspaceState {
  datasets: DatasetRecord[];
  results: DatasetResultRecord[];
  summary: {
    totalDatasets: number;
    totalRecords: number;
    byStatus: DatasetStatusSummary[];
  };
}

export class DataWorkspaceController {
  public constructor(private readonly repository: DatasetRepository) {}

  public createState(): DataWorkspaceState {
    const datasets = this.repository
      .listDatasets()
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));

    const byStatusMap = new Map<string, DatasetStatusSummary>();
    let totalRecords = 0;

    for (const dataset of datasets) {
      totalRecords += dataset.recordCount;

      const current = byStatusMap.get(dataset.status) ?? {
        status: dataset.status,
        datasetCount: 0,
        recordCount: 0
      };

      current.datasetCount += 1;
      current.recordCount += dataset.recordCount;
      byStatusMap.set(dataset.status, current);
    }

    return {
      datasets,
      results: this.repository
        .listResults()
        .sort((left, right) => right.createdAt.localeCompare(left.createdAt))
        .slice(0, 5),
      summary: {
        totalDatasets: datasets.length,
        totalRecords,
        byStatus: [...byStatusMap.values()].sort((left, right) =>
          left.status.localeCompare(right.status, "ja")
        )
      }
    };
  }

  public updateDataset(datasetId: string, status: string, recordCount: number): DataWorkspaceState {
    this.repository.updateDataset(datasetId, status, recordCount);
    return this.createState();
  }
}
