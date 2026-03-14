import type { DatasetRecord } from "../../data-workspace/model/DatasetRecord";
import type { DocumentRecord } from "../../document-workspace/model/DocumentRecord";
import type { CodeTargetRecord } from "../../code-workspace/model/CodeTargetRecord";

export interface DashboardBootstrap {
  mode: "seed" | "live";
  documents: DocumentRecord[];
  datasets: DatasetRecord[];
  codeTargets: CodeTargetRecord[];
  documentSourcePolicy: string;
  datasetSourcePolicy: string;
  codeSourcePolicy: string;
  readOnly: boolean;
  sourceSignature: string;
  loadedAt: string;
}

interface LiveDashboardResponse {
  documents: DocumentRecord[];
  datasets: DatasetRecord[];
  codeTargets: CodeTargetRecord[];
  documentSourcePolicy: string;
  datasetSourcePolicy: string;
  codeSourcePolicy: string;
  readOnly: boolean;
  sourceSignature: string;
}

export async function loadDashboardBootstrap(
  documentSeed: DocumentRecord[],
  datasetSeed: DatasetRecord[],
  codeTargetSeed: CodeTargetRecord[]
): Promise<DashboardBootstrap> {
  if (typeof window === "undefined") {
    return createSeedBootstrap(documentSeed, datasetSeed, codeTargetSeed);
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
      codeTargets: payload.codeTargets,
      documentSourcePolicy: payload.documentSourcePolicy,
      datasetSourcePolicy: payload.datasetSourcePolicy,
      codeSourcePolicy: payload.codeSourcePolicy,
      readOnly: payload.readOnly,
      sourceSignature: payload.sourceSignature,
      loadedAt: new Date().toISOString()
    };
  } catch {
    return createSeedBootstrap(documentSeed, datasetSeed, codeTargetSeed);
  }
}

function createSeedBootstrap(
  documentSeed: DocumentRecord[],
  datasetSeed: DatasetRecord[],
  codeTargetSeed: CodeTargetRecord[]
): DashboardBootstrap {
  return {
    mode: "seed",
    documents: documentSeed,
    datasets: datasetSeed,
    codeTargets: codeTargetSeed,
    documentSourcePolicy: "Seed bootstrap + in-app save",
    datasetSourcePolicy: "Seed bootstrap + in-app update",
    codeSourcePolicy: "seed read-only browse",
    readOnly: false,
    sourceSignature: `seed:${documentSeed.length}:${datasetSeed.length}:${codeTargetSeed.length}`,
    loadedAt: new Date().toISOString()
  };
}
