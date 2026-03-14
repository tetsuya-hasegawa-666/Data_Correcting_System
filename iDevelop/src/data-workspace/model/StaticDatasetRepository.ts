import type { DatasetRecord } from "./DatasetRecord";
import type { DatasetRepository, DatasetResultRecord } from "./DatasetRepository";

export class StaticDatasetRepository implements DatasetRepository {
  private readonly datasetsById: Map<string, DatasetRecord>;
  private readonly results: DatasetResultRecord[] = [];

  public constructor(datasets: DatasetRecord[]) {
    this.datasetsById = new Map(datasets.map((dataset) => [dataset.id, { ...dataset }]));
  }

  public listDatasets(): DatasetRecord[] {
    return [...this.datasetsById.values()].map((dataset) => ({ ...dataset }));
  }

  public updateDataset(datasetId: string, status: string, recordCount: number): DatasetRecord {
    const current = this.datasetsById.get(datasetId);

    if (!current) {
      throw new Error(`Dataset '${datasetId}' was not found.`);
    }

    const updatedAt = new Date().toISOString();
    const updated = { ...current, status, recordCount, updatedAt };
    this.datasetsById.set(datasetId, updated);
    this.results.unshift({
      id: `result-${this.results.length + 1}`,
      datasetId,
      summary: `${updated.name} updated to ${status} (${recordCount} records)`,
      createdAt: updatedAt
    });
    return { ...updated };
  }

  public listResults(): DatasetResultRecord[] {
    return this.results.map((result) => ({ ...result }));
  }
}
