import codeTargetSeed from "../data/code-targets.json";
import documentSeed from "../data/documents.json";
import datasetSeed from "../data/datasets.json";
import "./styles.css";

import { StaticCodeTargetRepository } from "./code-workspace/model/StaticCodeTargetRepository";
import { BrowserDatasetRepository } from "./data-workspace/model/BrowserDatasetRepository";
import { StaticDatasetRepository } from "./data-workspace/model/StaticDatasetRepository";
import { BrowserDocumentRepository } from "./document-workspace/model/BrowserDocumentRepository";
import { StaticDocumentRepository } from "./document-workspace/model/StaticDocumentRepository";
import type { DashboardBootstrap } from "./shared-core/bootstrap/loadDashboardBootstrap";
import { loadDashboardBootstrap } from "./shared-core/bootstrap/loadDashboardBootstrap";
import { DashboardController } from "./shared-core/controller/DashboardController";

const rootElement = document.querySelector<HTMLDivElement>("#app");

if (!rootElement) {
  throw new Error("Application root '#app' was not found.");
}

const bootstrap = await loadDashboardBootstrap(documentSeed, datasetSeed, codeTargetSeed);

if (bootstrap.mode === "live") {
  const documentRepository = new StaticDocumentRepository(bootstrap.documents, {
    sourcePolicy: bootstrap.documentSourcePolicy,
    readOnly: bootstrap.readOnly
  });
  const datasetRepository = new StaticDatasetRepository(bootstrap.datasets, {
    sourcePolicy: bootstrap.datasetSourcePolicy,
    readOnly: bootstrap.readOnly
  });
  const codeTargetRepository = new StaticCodeTargetRepository(
    bootstrap.codeTargets,
    bootstrap.codeSourcePolicy
  );
  const controller = new DashboardController(
    rootElement,
    documentRepository,
    datasetRepository,
    codeTargetRepository,
    bootstrap,
    async (): Promise<DashboardBootstrap> => {
      const nextBootstrap = await loadDashboardBootstrap(documentSeed, datasetSeed, codeTargetSeed);

      if (nextBootstrap.mode !== "live") {
        throw new Error("live source を再取得できませんでした。");
      }

      documentRepository.replaceDocuments(nextBootstrap.documents, {
        sourcePolicy: nextBootstrap.documentSourcePolicy,
        readOnly: nextBootstrap.readOnly
      });
      datasetRepository.replaceDatasets(nextBootstrap.datasets, {
        sourcePolicy: nextBootstrap.datasetSourcePolicy,
        readOnly: nextBootstrap.readOnly
      });
      codeTargetRepository.replaceTargets(
        nextBootstrap.codeTargets,
        nextBootstrap.codeSourcePolicy
      );

      return nextBootstrap;
    }
  );

  controller.start();
} else {
  const documentRepository =
    typeof window === "undefined"
      ? new StaticDocumentRepository(documentSeed)
      : new BrowserDocumentRepository(documentSeed);
  const datasetRepository =
    typeof window === "undefined"
      ? new StaticDatasetRepository(datasetSeed)
      : new BrowserDatasetRepository(datasetSeed);
  const codeTargetRepository = new StaticCodeTargetRepository(codeTargetSeed);

  const controller = new DashboardController(
    rootElement,
    documentRepository,
    datasetRepository,
    codeTargetRepository,
    bootstrap
  );

  controller.start();
}
