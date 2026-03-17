import { readFileSync, readdirSync, statSync, existsSync } from "node:fs";
import { basename, extname, join, relative, resolve, sep } from "node:path";

import type { DatasetFileRecord, DatasetRecord } from "../src/data-workspace/model/DatasetRecord";
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

export interface DownloadTarget {
  absolutePath: string;
  relativePath: string;
  kind: "file" | "directory";
  fileName: string;
}

interface SessionManifest {
  sessionId?: string;
  status?: string;
  recordingMode?: string;
  startedAt?: string;
  finalizedAt?: string;
  requestedRoute?: string;
  activeRoute?: string;
  recordingConfig?: {
    requestedRoute?: string;
  };
  files?: Array<{
    path?: string;
    sizeBytes?: number;
  }>;
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

export function resolveDownloadTarget(manifestPath: string, relativePath: string): DownloadTarget {
  const manifest = readManifest(manifestPath);
  const absolutePath = resolve(manifest.projectRoot, relativePath);
  const normalizedRelativePath = toProjectRelativePath(manifest.projectRoot, absolutePath);

  if (!isInsideRoot(manifest.projectRoot, absolutePath)) {
    throw new Error("Download path is outside projectRoot.");
  }
  if (!existsSync(absolutePath)) {
    throw new Error("Download source was not found.");
  }

  const allowedRoots = [...manifest.dataRoots, ...manifest.documentRoots];
  const isAllowed = allowedRoots.some((root) => {
    const absoluteRoot = resolve(manifest.projectRoot, root);
    return isInsideRoot(absoluteRoot, absolutePath) || absolutePath === absoluteRoot;
  });
  if (!isAllowed) {
    throw new Error("Download path is outside configured roots.");
  }

  const targetStat = statSync(absolutePath);
  return {
    absolutePath,
    relativePath: normalizedRelativePath,
    kind: targetStat.isDirectory() ? "directory" : "file",
    fileName: targetStat.isDirectory()
      ? `${basename(absolutePath)}.zip`
      : basename(absolutePath)
  };
}

function readManifest(manifestPath: string): ProjectManifest {
  return JSON.parse(readFileSync(manifestPath, "utf8")) as ProjectManifest;
}

function collectDocuments(manifest: ProjectManifest): DocumentRecord[] {
  return collectFiles(manifest, manifest.documentRoots)
    .filter((filePath) => extname(filePath).toLowerCase() === ".md")
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
  const sessionRoots = collectSessionArchiveRoots(manifest);
  const sessionRootSet = new Set(sessionRoots.map((sessionRoot) => sessionRoot.absolutePath));
  const sessionDatasets = sessionRoots.map((sessionRoot) => buildSessionDataset(manifest, sessionRoot));
  const fileDatasets = collectFiles(manifest, manifest.dataRoots)
    .filter((filePath) => isDataFile(filePath))
    .filter((filePath) => extname(filePath).toLowerCase() !== ".md")
    .filter((filePath) => !isInsideAnySessionRoot(filePath, sessionRootSet))
    .map((filePath) => buildFileDataset(manifest, filePath));

  return [...sessionDatasets, ...fileDatasets].sort((left, right) =>
    right.updatedAt.localeCompare(left.updatedAt)
  );
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

function collectSessionArchiveRoots(
  manifest: ProjectManifest
): Array<{ absolutePath: string; manifestPath: string }> {
  const result: Array<{ absolutePath: string; manifestPath: string }> = [];
  for (const root of manifest.dataRoots) {
    const absoluteRoot = resolve(manifest.projectRoot, root);
    if (!existsSync(absoluteRoot)) {
      continue;
    }
    walkDirectoryForSessions(manifest, absoluteRoot, result);
  }
  return result;
}

function walkDirectoryForSessions(
  manifest: ProjectManifest,
  currentPath: string,
  result: Array<{ absolutePath: string; manifestPath: string }>
): void {
  const relativePath = toProjectRelativePath(manifest.projectRoot, currentPath);
  if (relativePath && shouldIgnore(manifest.ignoreGlobs, relativePath)) {
    return;
  }

  const manifestPath = join(currentPath, "session_manifest.json");
  if (existsSync(manifestPath)) {
    result.push({ absolutePath: currentPath, manifestPath });
    return;
  }

  for (const entry of readdirSync(currentPath, { withFileTypes: true })) {
    if (!entry.isDirectory()) {
      continue;
    }
    walkDirectoryForSessions(manifest, join(currentPath, entry.name), result);
  }
}

function buildSessionDataset(
  manifest: ProjectManifest,
  sessionRoot: { absolutePath: string; manifestPath: string }
): DatasetRecord {
  const stats = statSync(sessionRoot.absolutePath);
  const sessionManifest = JSON.parse(
    readFileSync(sessionRoot.manifestPath, "utf8")
  ) as SessionManifest;
  const relativeDirectory = toProjectRelativePath(manifest.projectRoot, sessionRoot.absolutePath);
  const files = buildSessionFileList(manifest, sessionRoot.absolutePath, sessionManifest);
  const requestedRoute =
    sessionManifest.requestedRoute ?? sessionManifest.recordingConfig?.requestedRoute ?? "unknown";
  const activeRoute = sessionManifest.activeRoute ?? requestedRoute;
  const previewText = [
    `sessionId: ${sessionManifest.sessionId ?? basename(sessionRoot.absolutePath)}`,
    `recordingMode: ${sessionManifest.recordingMode ?? "standard_handheld"}`,
    `requestedRoute: ${requestedRoute}`,
    `activeRoute: ${activeRoute}`,
    `status: ${sessionManifest.status ?? "unknown"}`
  ].join("\n");

  return {
    id: relativeDirectory,
    name: sessionManifest.sessionId ?? basename(sessionRoot.absolutePath),
    category: "session",
    recordCount: files.length,
    status: normalizeStatus(sessionManifest.status),
    updatedAt: stats.mtime.toISOString(),
    path: relativeDirectory,
    topDirectory: relativeDirectory.split("/")[0] ?? "root",
    sessionId: sessionManifest.sessionId ?? basename(sessionRoot.absolutePath),
    recordingMode: sessionManifest.recordingMode ?? "standard_handheld",
    requestedRoute,
    activeRoute,
    startedAt: sessionManifest.startedAt,
    finalizedAt: sessionManifest.finalizedAt,
    statusMessage: `files: ${files.length}`,
    files,
    previewText,
    download: {
      kind: "directory",
      relativePath: relativeDirectory,
      fileName: `${basename(sessionRoot.absolutePath)}.zip`
    }
  };
}

function buildFileDataset(manifest: ProjectManifest, filePath: string): DatasetRecord {
  const projectRelativePath = toProjectRelativePath(manifest.projectRoot, filePath);
  const stats = statSync(filePath);
  const previewText = readPreviewText(filePath);

  return {
    id: projectRelativePath,
    name: basename(filePath, extname(filePath)),
    category: resolveDatasetCategory(filePath),
    recordCount: countRecords(filePath),
    status: "live",
    updatedAt: stats.mtime.toISOString(),
    path: projectRelativePath,
    topDirectory: projectRelativePath.split("/")[0] ?? "root",
    statusMessage: "single file",
    files: [
      {
        name: basename(filePath),
        relativePath: projectRelativePath,
        sizeBytes: stats.size,
        present: true
      }
    ],
    previewText,
    download: {
      kind: "file",
      relativePath: projectRelativePath,
      fileName: basename(filePath)
    }
  };
}

function buildSessionFileList(
  manifest: ProjectManifest,
  sessionRoot: string,
  sessionManifest: SessionManifest
): DatasetFileRecord[] {
  const manifestFiles = sessionManifest.files ?? [];
  if (manifestFiles.length > 0) {
    return manifestFiles.map((file) => {
      const relativePath = file.path
        ? toProjectRelativePath(manifest.projectRoot, resolve(sessionRoot, file.path))
        : toProjectRelativePath(manifest.projectRoot, sessionRoot);
      const absolutePath = file.path ? resolve(sessionRoot, file.path) : sessionRoot;
      return {
        name: basename(file.path ?? sessionRoot),
        relativePath,
        sizeBytes: file.sizeBytes ?? (existsSync(absolutePath) ? statSync(absolutePath).size : 0),
        present: existsSync(absolutePath)
      };
    });
  }

  return readdirSync(sessionRoot, { withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const absolutePath = join(sessionRoot, entry.name);
      return {
        name: entry.name,
        relativePath: toProjectRelativePath(manifest.projectRoot, absolutePath),
        sizeBytes: statSync(absolutePath).size,
        present: true
      };
    })
    .sort((left, right) => left.name.localeCompare(right.name, "ja"));
}

function collectFiles(manifest: ProjectManifest, roots: string[]): string[] {
  const result: string[] = [];

  for (const root of roots) {
    const absoluteRoot = resolve(manifest.projectRoot, root);

    if (!isInsideRoot(manifest.projectRoot, absoluteRoot)) {
      throw new Error(`Root '${root}' is outside projectRoot.`);
    }

    if (!existsSync(absoluteRoot)) {
      continue;
    }

    const rootStat = statSync(absoluteRoot);
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

  for (const entry of readdirSync(currentPath, { withFileTypes: true })) {
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

function isInsideAnySessionRoot(filePath: string, sessionRoots: Set<string>): boolean {
  for (const sessionRoot of sessionRoots) {
    if (isInsideRoot(sessionRoot, filePath) && filePath !== sessionRoot) {
      return true;
    }
  }
  return false;
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

function isDataFile(filePath: string): boolean {
  const extension = extname(filePath).toLowerCase();
  return new Set([".csv", ".json", ".jsonl", ".txt", ".mp4"]).has(extension);
}

function countRecords(filePath: string): number {
  const extension = extname(filePath).toLowerCase();
  const body = readFileSync(filePath, "utf8").replace(/^\uFEFF/, "");

  if (extension === ".json") {
    let parsed: unknown;
    try {
      parsed = JSON.parse(body) as unknown;
    } catch {
      return Math.max(body.split(/\r?\n/).filter((line) => line.trim().length > 0).length, 1);
    }
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

function readPreviewText(filePath: string): string {
  const body = readFileSync(filePath, "utf8");
  const lines = body.split(/\r?\n/).slice(0, 12);
  return lines.join("\n");
}

function normalizeStatus(status?: string): string {
  if (!status) {
    return "live";
  }
  if (status === "completed" || status === "finished" || status === "finalized") {
    return "ready";
  }
  if (status === "failed" || status === "error") {
    return "review";
  }
  return "live";
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
