// @vitest-environment node

import { mkdtempSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { loadLiveProjectSnapshot } from "../../tools/liveProjectSnapshot";

const tempRoots: string[] = [];

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("loadLiveProjectSnapshot", () => {
  it("reads document roots recursively and skips ignored directories", () => {
    const { manifestPath } = createProjectFixture();

    const snapshot = loadLiveProjectSnapshot(manifestPath);

    expect(snapshot.documents.map((document) => document.path)).toEqual([
      "develop/index.md",
      "docs/guide/intro.md"
    ]);
    expect(snapshot.documents[0]?.title).toBe("Plan");
    expect(snapshot.documents[1]?.body).toContain("Guide body");
    expect(snapshot.documentSourcePolicy).toContain("read-only");
  });

  it("reads data roots recursively and derives dataset metrics from files", () => {
    const { manifestPath } = createProjectFixture();

    const snapshot = loadLiveProjectSnapshot(manifestPath);

    expect(snapshot.datasets.map((dataset) => dataset.name)).toEqual([
      "events",
      "summary"
    ]);
    expect(snapshot.datasets[0]?.recordCount).toBe(3);
    expect(snapshot.datasets[0]?.status).toBe("live");
    expect(snapshot.datasets[1]?.recordCount).toBe(2);
    expect(snapshot.datasetSourcePolicy).toContain("filesystem");
  });

  it("reads code roots recursively and returns read-only browse targets", () => {
    const { manifestPath } = createProjectFixture();

    const snapshot = loadLiveProjectSnapshot(manifestPath);

    expect(snapshot.codeTargets.map((target) => target.path)).toEqual([
      "src/app.ts",
      "tools/build.ts"
    ]);
    expect(snapshot.codeTargets[0]?.description).toContain("lines");
    expect(snapshot.codeSourcePolicy).toContain("read-only");
  });
});

function createProjectFixture(): { manifestPath: string } {
  const root = mkdtempSync(join(tmpdir(), "idevelop-live-read-"));
  tempRoots.push(root);

  mkdirSync(join(root, "docs", "guide"), { recursive: true });
  mkdirSync(join(root, "develop"), { recursive: true });
  mkdirSync(join(root, "data", "nested"), { recursive: true });
  mkdirSync(join(root, "src"), { recursive: true });
  mkdirSync(join(root, "tools"), { recursive: true });
  mkdirSync(join(root, "build"), { recursive: true });

  writeFileSync(join(root, "docs", "guide", "intro.md"), "# Intro\nGuide body\n", "utf8");
  writeFileSync(join(root, "develop", "index.md"), "# Plan\nPlan body\n", "utf8");
  writeFileSync(join(root, "data", "events.csv"), "time,value\n1,ok\n2,ng\n", "utf8");
  writeFileSync(
    join(root, "data", "nested", "summary.json"),
    JSON.stringify([{ id: 1 }, { id: 2 }], null, 2),
    "utf8"
  );
  writeFileSync(join(root, "src", "app.ts"), "export const app = 1;\nconsole.log(app);\n", "utf8");
  writeFileSync(join(root, "tools", "build.ts"), "export function build() {}\n", "utf8");
  writeFileSync(join(root, "build", "ignored.md"), "ignored", "utf8");

  const manifestPath = join(root, "project-manifest.json");
  writeFileSync(
    manifestPath,
    JSON.stringify(
      {
        projectId: "fixture-project",
        projectRoot: root,
        documentRoots: ["docs", "develop"],
        dataRoots: ["data"],
        codeRoots: ["src", "tools"],
        ignoreGlobs: ["**/node_modules/**", "**/.git/**", "**/dist/**", "**/build/**"],
        readOnly: true
      },
      null,
      2
    ),
    "utf8"
  );

  return { manifestPath };
}
