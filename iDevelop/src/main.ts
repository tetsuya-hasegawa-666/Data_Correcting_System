import codeTargetSeed from "../data/code-targets.json";
import documentSeed from "../data/documents.json";
import datasetSeed from "../data/datasets.json";
import "./styles.css";

import { StaticCodeTargetRepository } from "./code-workspace/model/StaticCodeTargetRepository";
import { BrowserDatasetRepository } from "./data-workspace/model/BrowserDatasetRepository";
import { DashboardController } from "./shared-core/controller/DashboardController";
import { BrowserDocumentRepository } from "./document-workspace/model/BrowserDocumentRepository";
import { StaticDatasetRepository } from "./data-workspace/model/StaticDatasetRepository";
import { StaticDocumentRepository } from "./document-workspace/model/StaticDocumentRepository";

const rootElement = document.querySelector<HTMLDivElement>("#app");

if (!rootElement) {
  throw new Error("Application root '#app' was not found.");
}

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
  codeTargetRepository
);

controller.start();
