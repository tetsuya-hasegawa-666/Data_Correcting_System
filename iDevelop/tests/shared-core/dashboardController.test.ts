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
      },
      {
        id: "doc-2",
        title: "Research Operation",
        path: "docs/process/research_operation.md",
        body: "BDD and TDD operating rules.",
        tags: ["process"]
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

    expect(container.textContent).toContain("Consultation Contract");
    expect(container.textContent).toContain("North Star");
    expect(container.textContent).toContain("consultation-only");

    (container.querySelector("[data-workspace-id='data']") as HTMLButtonElement).click();
    expect(container.textContent).toContain("データ");
    expect(container.textContent).toContain("更新結果");
    expect(container.textContent).toContain("dataset-1");

    (container.querySelector("[data-workspace-id='code']") as HTMLButtonElement).click();
    expect(container.textContent).toContain("コード");
    expect(container.textContent).toContain("読み取り専用の確認対象");
    expect(container.textContent).toContain("phase-gated-read-only");
  });

  it("runs data consultation from the selected bundle", () => {
    const container = document.createElement("div");
    const controller = createController(container);

    controller.start();
    (container.querySelector("[data-workspace-id='data']") as HTMLButtonElement).click();
    const focusInput = container.querySelector(
      "[data-role='data-consultation-focus-input']"
    ) as HTMLTextAreaElement;
    focusInput.value = "anomaly を確認したい";
    focusInput.dispatchEvent(new Event("input", { bubbles: true }));
    (
      container.querySelector("[data-role='data-consultation-form']") as HTMLFormElement
    ).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(container.querySelector("[data-role='data-bundle-count']")?.textContent).toContain("1");
    expect(container.querySelector("[data-role='data-consultation-response']")?.textContent).toContain(
      "Summary"
    );
  });

  it("stores shared conversation history across document and data consultations", () => {
    const container = document.createElement("div");
    const controller = createController(container);

    controller.start();

    const documentFocus = container.querySelector(
      "[data-role='consultation-focus-input']"
    ) as HTMLTextAreaElement;
    documentFocus.value = "document focus";
    documentFocus.dispatchEvent(new Event("input", { bubbles: true }));
    (
      container.querySelector("[data-role='document-consultation-form']") as HTMLFormElement
    ).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    (container.querySelector("[data-workspace-id='data']") as HTMLButtonElement).click();
    const dataFocus = container.querySelector(
      "[data-role='data-consultation-focus-input']"
    ) as HTMLTextAreaElement;
    dataFocus.value = "data focus";
    dataFocus.dispatchEvent(new Event("input", { bubbles: true }));
    (
      container.querySelector("[data-role='data-consultation-form']") as HTMLFormElement
    ).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(container.querySelectorAll("[data-role='shared-history-item']")).toHaveLength(2);
    expect(container.querySelector("[data-role='shared-current-prompt']")?.textContent).toContain(
      "data focus"
    );
  });

  it("approves document apply after preview", () => {
    const container = document.createElement("div");
    const controller = createController(container);

    controller.start();
    const focus = container.querySelector("[data-role='consultation-focus-input']") as HTMLTextAreaElement;
    focus.value = "apply summary";
    focus.dispatchEvent(new Event("input", { bubbles: true }));
    (
      container.querySelector("[data-role='document-consultation-form']") as HTMLFormElement
    ).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    (container.querySelector("[data-role='proposal-action'][data-action='apply-request']") as HTMLButtonElement).click();
    (container.querySelector("[data-role='apply-approve']") as HTMLButtonElement).click();

    expect(container.querySelector("[data-role='apply-approved']")?.textContent).toContain(
      "approved"
    );
    expect(container.querySelector("[data-role='document-body']")?.textContent).toContain(
      "[Applied Consultation]"
    );
  });

  it("keeps code consultation behind the phase gate and blocks apply", () => {
    const container = document.createElement("div");
    const controller = createController(container);

    controller.start();
    (container.querySelector("[data-workspace-id='code']") as HTMLButtonElement).click();
    const codeFocus = container.querySelector(
      "[data-role='code-consultation-focus-input']"
    ) as HTMLTextAreaElement;
    codeFocus.value = "read-only risk";
    codeFocus.dispatchEvent(new Event("input", { bubbles: true }));
    (
      container.querySelector("[data-role='code-consultation-form']") as HTMLFormElement
    ).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));
    (container.querySelector("[data-role='proposal-action'][data-action='apply-request']") as HTMLButtonElement).click();

    expect(container.querySelector("[data-role='shared-current-approval']")?.textContent).toContain(
      "phase-gated-read-only"
    );
    expect(container.querySelector("[data-role='apply-preview']")).toBeNull();
  });

  it("runs document consultation from the selected bundle", () => {
    const container = document.createElement("div");
    const controller = createController(container);

    controller.start();

    (container.querySelector("[data-role='toggle-document-bundle'][data-document-id='doc-2']") as HTMLButtonElement).click();
    const focusInput = container.querySelector(
      "[data-role='consultation-focus-input']"
    ) as HTMLTextAreaElement;
    focusInput.value = "BDD の根拠を確認したい";
    focusInput.dispatchEvent(new Event("input", { bubbles: true }));
    (
      container.querySelector("[data-role='document-consultation-form']") as HTMLFormElement
    ).dispatchEvent(new Event("submit", { bubbles: true, cancelable: true }));

    expect(container.querySelector("[data-role='document-bundle-count']")?.textContent).toContain(
      "2"
    );
    expect(
      container.querySelector("[data-role='document-consultation-response']")?.textContent
    ).toContain("2 件の文書");
    expect(container.textContent).toContain("BDD の根拠を確認したい");
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
