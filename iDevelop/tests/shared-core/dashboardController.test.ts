import { beforeEach, describe, expect, it, vi } from "vitest";

import { StaticCodeTargetRepository } from "../../src/code-workspace/model/StaticCodeTargetRepository";
import { StaticDatasetRepository } from "../../src/data-workspace/model/StaticDatasetRepository";
import { StaticDocumentRepository } from "../../src/document-workspace/model/StaticDocumentRepository";
import type { DashboardBootstrap } from "../../src/shared-core/bootstrap/loadDashboardBootstrap";
import { DashboardController } from "../../src/shared-core/controller/DashboardController";

function createController(
  container: HTMLDivElement,
  bootstrap?: Partial<DashboardBootstrap>,
  refreshDashboard?: () => Promise<DashboardBootstrap>
): DashboardController {
  return new DashboardController(
    container,
    new StaticDocumentRepository([
      {
        id: "doc-1",
        title: "North Star",
        path: "docs/artifact/north_star.md",
        body: "Original body.",
        tags: ["artifact"]
      }
    ]),
    new StaticDatasetRepository([
      {
        id: "dataset-1",
        name: "Doc Sync Coverage",
        category: "document",
        recordCount: 12,
        status: "ready",
        updatedAt: "2026-03-14T08:30:00Z"
      }
    ]),
    new StaticCodeTargetRepository([
      {
        id: "document-controller",
        title: "Document Controller",
        path: "src/document-workspace/controller/DocumentWorkspaceController.ts",
        description: "Search and save flow."
      }
    ]),
    {
      loadedAt: bootstrap?.loadedAt ?? "2026-03-14T10:00:00Z",
      sourceSignature: bootstrap?.sourceSignature ?? "seed:1:1"
    },
    refreshDashboard
  );
}

describe("DashboardController", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    window.localStorage.clear();
  });

  it("switches workspace tabs for data and code", () => {
    const container = document.createElement("div");
    const controller = createController(container);

    controller.start();

    (container.querySelector("[data-workspace-id='data']") as HTMLButtonElement).click();
    expect(container.textContent).toContain("データ");
    expect(container.textContent).toContain("更新結果");

    (container.querySelector("[data-workspace-id='code']") as HTMLButtonElement).click();
    expect(container.textContent).toContain("コード");
    expect(container.textContent).toContain("読み取り専用の確認対象");
  });

  it("cancels editing when cancel is clicked", () => {
    const container = document.createElement("div");
    const controller = createController(container);

    controller.start();
    (container.querySelector("[data-role='edit-document']") as HTMLButtonElement).click();
    (container.querySelector("[data-role='cancel-document']") as HTMLButtonElement).click();

    expect(container.querySelector("[data-role='document-editor']")).toBeNull();
    expect(container.querySelector("[data-role='edit-document']")).not.toBeNull();
  });

  it("cancels editing when clicking outside the editor", () => {
    const container = document.createElement("div");
    const controller = createController(container);

    controller.start();
    (container.querySelector("[data-role='edit-document']") as HTMLButtonElement).click();

    const event = new MouseEvent("click", { bubbles: true });
    container.dispatchEvent(event);

    expect(container.querySelector("[data-role='document-editor']")).toBeNull();
  });

  it("renders stale status when loadedAt is older than the stale threshold", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-14T10:10:00Z"));

    const container = document.createElement("div");
    const controller = createController(container, {
      loadedAt: "2026-03-14T10:00:00Z"
    });

    controller.start();

    expect(container.querySelector("[data-role='stale-indicator']")?.textContent).toContain("stale");

    vi.useRealTimers();
  });

  it("stores refresh evidence and marks refreshed when source signature changed", async () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date("2026-03-14T10:05:30Z"));

    const container = document.createElement("div");
    const refreshDashboard = vi.fn(async (): Promise<DashboardBootstrap> => ({
      mode: "live",
      documents: [],
      datasets: [],
      codeTargets: [],
      documentSourcePolicy: "filesystem recursive read-only",
      datasetSourcePolicy: "filesystem recursive read-only",
      codeSourcePolicy: "filesystem recursive read-only",
      readOnly: true,
      sourceSignature: "live:changed",
      loadedAt: "2026-03-14T10:05:00Z"
    }));
    const controller = createController(
      container,
      { sourceSignature: "live:before" },
      refreshDashboard
    );

    controller.start();
    (container.querySelector("[data-role='refresh-dashboard']") as HTMLButtonElement).click();
    await Promise.resolve();
    await Promise.resolve();

    expect(refreshDashboard).toHaveBeenCalledTimes(1);
    expect(container.querySelector("[data-role='stale-indicator']")?.textContent).toContain("refreshed");
    expect(container.querySelector("[data-role='refresh-evidence']")?.textContent).toContain("changed");

    vi.useRealTimers();
  });
});
