import type { DatasetRecord } from "../model/DatasetRecord";
import type { DatasetRepository, DatasetResultRecord } from "../model/DatasetRepository";

export interface DatasetStatusSummary {
  status: string;
  datasetCount: number;
  recordCount: number;
}

export interface DataConsultationResponse {
  summary: string;
  evidence: string[];
  nextAction: string;
}

export interface DataConsultationState {
  selectedDatasetIds: string[];
  focusPrompt: string;
  lastResponse: DataConsultationResponse | null;
}

export interface DataWorkspaceState {
  datasets: DatasetRecord[];
  results: DatasetResultRecord[];
  selectedDatasets: DatasetRecord[];
  sourcePolicy: string;
  isReadOnly: boolean;
  consultation: DataConsultationState;
  summary: {
    totalDatasets: number;
    totalRecords: number;
    byStatus: DatasetStatusSummary[];
  };
}

export class DataWorkspaceController {
  public constructor(private readonly repository: DatasetRepository) {}

  public createState(
    consultationState?: Partial<DataConsultationState>
  ): DataWorkspaceState {
    const datasets = this.repository
      .listDatasets()
      .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt));
    const selectedDatasetIds =
      consultationState?.selectedDatasetIds?.filter((datasetId) =>
        datasets.some((dataset) => dataset.id === datasetId)
      ) ?? (datasets[0] ? [datasets[0].id] : []);

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
      selectedDatasets: datasets.filter((dataset) => selectedDatasetIds.includes(dataset.id)),
      sourcePolicy: this.repository.getSourcePolicy(),
      isReadOnly: this.repository.isReadOnly(),
      consultation: {
        selectedDatasetIds,
        focusPrompt: consultationState?.focusPrompt ?? "",
        lastResponse: consultationState?.lastResponse ?? null
      },
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

  public toggleDatasetSelection(
    datasetId: string,
    consultationState?: Partial<DataConsultationState>
  ): DataWorkspaceState {
    const state = this.createState(consultationState);
    const nextSelectedDatasetIds = state.consultation.selectedDatasetIds.includes(datasetId)
      ? state.consultation.selectedDatasetIds.filter((selectedId) => selectedId !== datasetId)
      : [...state.consultation.selectedDatasetIds, datasetId];

    return this.createState({
      ...state.consultation,
      selectedDatasetIds: nextSelectedDatasetIds,
      lastResponse: null
    });
  }

  public updateConsultationFocus(
    focusPrompt: string,
    consultationState?: Partial<DataConsultationState>
  ): DataWorkspaceState {
    const state = this.createState(consultationState);
    return this.createState({
      ...state.consultation,
      focusPrompt
    });
  }

  public consultDatasets(
    consultationState?: Partial<DataConsultationState>
  ): DataWorkspaceState {
    const state = this.createState(consultationState);
    const selectedDatasets = state.selectedDatasets;
    const focusPrompt = state.consultation.focusPrompt.trim();
    const hasSelection = selectedDatasets.length > 0;

    return this.createState({
      ...state.consultation,
      lastResponse: {
        summary: hasSelection
          ? `${selectedDatasets.length} 件の dataset を consultation bundle として固定しました。`
          : "相談対象の dataset を 1 件以上選択してください。",
        evidence: selectedDatasets.map(
          (dataset) => `${dataset.name} (${dataset.status}, ${dataset.recordCount} records)`
        ),
        nextAction: hasSelection
          ? focusPrompt.length > 0
            ? `focus: ${focusPrompt}`
            : "focus を補足して anomaly や次 action を明確にする"
          : "dataset を選択してから再実行する"
      }
    });
  }
}
