import { readFileSync, readdirSync, statSync } from "node:fs";
import { basename, extname, join, relative, resolve, sep } from "node:path";

import type { DatasetRecord } from "../src/data-workspace/model/DatasetRecord";
import type { DocumentRecord } from "../src/document-workspace/model/DocumentRecord";
import type { CodeTargetRecord } from "../src/code-workspace/model/CodeTargetRecord";

export interface ProjectManifest {
  projectId: string;
  projectRoot: string;
  documentRoots: string[];
  dataRoots: string[];
  codeRoots: string[];
  ignoreGlobs: string[];
  readOnly: boolean;
}

export interface LiveProjectSnapshot {
  documents: DocumentRecord[];
  datasets: DatasetRecord[];
  codeTargets: CodeTargetRecord[];
  documentSourcePolicy: string;
  datasetSourcePolicy: string;
  codeSourcePolicy: string;
  readOnly: boolean;
  sourceSignature: string;
}

export function loadLiveProjectSnapshot(manifestPath: string): LiveProjectSnapshot {
  const manifest = readManifest(manifestPath);
  const documents = collectDocuments(manifest);
  const datasets = collectDatasets(manifest);
  const codeTargets = collectCodeTargets(manifest);

  return {
    documents,
    datasets,
    codeTargets,
    documentSourcePolicy: "filesystem recursive read-only",
    datasetSourcePolicy: "filesystem recursive read-only",
    codeSourcePolicy: "filesystem recursive read-only",
    readOnly: manifest.readOnly,
    sourceSignature: buildSourceSignature(documents, datasets, codeTargets)
  };
}

function readManifest(manifestPath: string): ProjectManifest {
  return JSON.parse(readFileSync(manifestPath, "utf8")) as ProjectManifest;
}

function collectDocuments(manifest: ProjectManifest): DocumentRecord[] {
  return collectFiles(manifest, manifest.documentRoots)
    .map((filePath) => {
      const body = readFileSync(filePath, "utf8");
      const projectRelativePath = toProjectRelativePath(manifest.projectRoot, filePath);

      return {
        id: projectRelativePath,
        title: resolveDocumentTitle(filePath, body),
        path: projectRelativePath,
        body,
        tags: buildDocumentTags(projectRelativePath)
      };
    })
    .sort((left, right) => left.path.localeCompare(right.path, "ja"));
}

function collectDatasets(manifest: ProjectManifest): DatasetRecord[] {
  return collectFiles(manifest, manifest.dataRoots)
    .map((filePath) => {
      const projectRelativePath = toProjectRelativePath(manifest.projectRoot, filePath);
      const stats = statSync(filePath);

      return {
        id: projectRelativePath,
        name: basename(filePath, extname(filePath)),
        category: resolveDatasetCategory(filePath),
        recordCount: countRecords(filePath),
        status: "live",
        updatedAt: stats.mtime.toISOString()
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "ja"));
}

function collectCodeTargets(manifest: ProjectManifest): CodeTargetRecord[] {
  return collectFiles(manifest, manifest.codeRoots)
    .map((filePath) => {
      const projectRelativePath = toProjectRelativePath(manifest.projectRoot, filePath);
      const stats = statSync(filePath);
      const extension = extname(filePath).replace(".", "") || "file";
      const body = readFileSync(filePath, "utf8");
      const lineCount = body.split(/\r?\n/).length;

      return {
        id: projectRelativePath,
        title: basename(filePath),
        path: projectRelativePath,
        description: `${extension} / ${lineCount} lines`,
        kind: extension,
        updatedAt: stats.mtime.toISOString()
      };
    })
    .sort((left, right) => left.path.localeCompare(right.path, "ja"));
}

function collectFiles(manifest: ProjectManifest, roots: string[]): string[] {
  const result: string[] = [];

  for (const root of roots) {
    const absoluteRoot = resolve(manifest.projectRoot, root);

    if (!isInsideRoot(manifest.projectRoot, absoluteRoot)) {
      throw new Error(`Root '${root}' is outside projectRoot.`);
    }

    let rootStat;
    try {
      rootStat = statSync(absoluteRoot);
    } catch {
      throw new Error(`Root '${root}' was not found under projectRoot.`);
    }

    if (!rootStat.isDirectory()) {
      continue;
    }

    walkDirectory(manifest, absoluteRoot, result);
  }

  return result;
}

function walkDirectory(manifest: ProjectManifest, currentPath: string, result: string[]): void {
  const relativePath = toProjectRelativePath(manifest.projectRoot, currentPath);

  if (relativePath && shouldIgnore(manifest.ignoreGlobs, relativePath)) {
    return;
  }

  const entries = readdirSync(currentPath, { withFileTypes: true });

  for (const entry of entries) {
    const absolutePath = join(currentPath, entry.name);
    const entryRelativePath = toProjectRelativePath(manifest.projectRoot, absolutePath);

    if (shouldIgnore(manifest.ignoreGlobs, entryRelativePath)) {
      continue;
    }

    if (entry.isDirectory()) {
      walkDirectory(manifest, absolutePath, result);
      continue;
    }

    if (entry.isFile()) {
      result.push(absolutePath);
    }
  }
}

function shouldIgnore(ignoreGlobs: string[], relativePath: string): boolean {
  const normalized = relativePath.replaceAll("\\", "/");
  const segments = normalized.split("/");

  return ignoreGlobs.some((pattern) => {
    const token = pattern.replaceAll("**/", "").replaceAll("/**", "").replaceAll("*", "");

    if (token.length === 0) {
      return false;
    }

    const normalizedToken = token.replaceAll("\\", "/").replace(/^\/+|\/+$/g, "");
    return segments.includes(normalizedToken);
  });
}

function toProjectRelativePath(projectRoot: string, absolutePath: string): string {
  return relative(projectRoot, absolutePath).split(sep).join("/");
}

function isInsideRoot(projectRoot: string, absolutePath: string): boolean {
  const relativePath = relative(projectRoot, absolutePath);
  return relativePath === "" || (!relativePath.startsWith("..") && !relativePath.includes(`..${sep}`));
}

function resolveDocumentTitle(filePath: string, body: string): string {
  const heading = body
    .split(/\r?\n/)
    .map((line) => line.trim())
    .find((line) => line.startsWith("# "));

  return heading ? heading.replace(/^#\s+/, "") : basename(filePath, extname(filePath));
}

function buildDocumentTags(projectRelativePath: string): string[] {
  const segments = projectRelativePath.split("/");
  const tags = new Set<string>();

  if (segments[0]) {
    tags.add(segments[0]);
  }

  const extension = extname(projectRelativePath).replace(".", "");
  if (extension) {
    tags.add(extension);
  }

  return [...tags];
}

function resolveDatasetCategory(filePath: string): string {
  const extension = extname(filePath).replace(".", "");

  switch (extension) {
    case "csv":
      return "csv";
    case "json":
      return "json";
    case "md":
      return "markdown";
    case "txt":
      return "text";
    default:
      return extension || "file";
  }
}

function countRecords(filePath: string): number {
  const extension = extname(filePath).toLowerCase();
  const body = readFileSync(filePath, "utf8");

  if (extension === ".json") {
    const parsed = JSON.parse(body) as unknown;

    if (Array.isArray(parsed)) {
      return parsed.length;
    }

    if (parsed && typeof parsed === "object") {
      return Object.keys(parsed).length;
    }

    return 1;
  }

  const lines = body.split(/\r?\n/).filter((line) => line.trim().length > 0);
  return Math.max(lines.length, 1);
}

function buildSourceSignature(
  documents: DocumentRecord[],
  datasets: DatasetRecord[],
  codeTargets: CodeTargetRecord[]
): string {
  const documentToken = documents
    .map((document) => `${document.path}:${document.body.length}`)
    .join("|");
  const datasetToken = datasets
    .map((dataset) => `${dataset.id}:${dataset.recordCount}:${dataset.updatedAt}`)
    .join("|");
  const codeToken = codeTargets.map((target) => `${target.path}:${target.updatedAt}`).join("|");

  return `${documents.length}:${datasets.length}:${codeTargets.length}:${documentToken}:${datasetToken}:${codeToken}`;
}
