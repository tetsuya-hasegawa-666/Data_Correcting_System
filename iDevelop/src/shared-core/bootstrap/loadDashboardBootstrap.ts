import type { DatasetRecord } from "../../data-workspace/model/DatasetRecord";
import type { DocumentRecord } from "../../document-workspace/model/DocumentRecord";

export interface DashboardBootstrap {
  mode: "seed" | "live";
  documents: DocumentRecord[];
  datasets: DatasetRecord[];
  documentSourcePolicy: string;
  datasetSourcePolicy: string;
  readOnly: boolean;
  sourceSignature: string;
  loadedAt: string;
}

interface LiveDashboardResponse {
  documents: DocumentRecord[];
  datasets: DatasetRecord[];
  documentSourcePolicy: string;
  datasetSourcePolicy: string;
  readOnly: boolean;
  sourceSignature: string;
}

export async function loadDashboardBootstrap(
  documentSeed: DocumentRecord[],
  datasetSeed: DatasetRecord[]
): Promise<DashboardBootstrap> {
  if (typeof window === "undefined") {
    return createSeedBootstrap(documentSeed, datasetSeed);
  }

  try {
    const response = await fetch("/api/dashboard/live-state");

    if (!response.ok) {
      throw new Error(`Live state endpoint returned ${response.status}.`);
    }

    const payload = (await response.json()) as LiveDashboardResponse;

    return {
      mode: "live",
      documents: payload.documents,
      datasets: payload.datasets,
      documentSourcePolicy: payload.documentSourcePolicy,
      datasetSourcePolicy: payload.datasetSourcePolicy,
      readOnly: payload.readOnly,
      sourceSignature: payload.sourceSignature,
      loadedAt: new Date().toISOString()
    };
  } catch {
    return createSeedBootstrap(documentSeed, datasetSeed);
  }
}

function createSeedBootstrap(
  documentSeed: DocumentRecord[],
  datasetSeed: DatasetRecord[]
): DashboardBootstrap {
  return {
    mode: "seed",
    documents: documentSeed,
    datasets: datasetSeed,
    documentSourcePolicy: "Seed bootstrap + in-app save",
    datasetSourcePolicy: "Seed bootstrap + in-app update",
    readOnly: false,
    sourceSignature: `seed:${documentSeed.length}:${datasetSeed.length}`,
    loadedAt: new Date().toISOString()
  };
}
