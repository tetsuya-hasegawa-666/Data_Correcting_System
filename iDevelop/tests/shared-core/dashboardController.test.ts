import { describe, expect, it } from "vitest";

import { StaticCodeTargetRepository } from "../../src/code-workspace/model/StaticCodeTargetRepository";
import { StaticDatasetRepository } from "../../src/data-workspace/model/StaticDatasetRepository";
import { StaticDocumentRepository } from "../../src/document-workspace/model/StaticDocumentRepository";
import { DashboardController } from "../../src/shared-core/controller/DashboardController";

function createController(container: HTMLDivElement): DashboardController {
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
    ])
  );
}

describe("DashboardController", () => {
  it("switches workspace tabs for data and code", () => {
    const container = document.createElement("div");
    const controller = createController(container);

    controller.start();

    (container.querySelector("[data-workspace-id='data']") as HTMLButtonElement).click();
    expect(container.textContent).toContain("データ");
    expect(container.textContent).toContain("更新結果");

    (container.querySelector("[data-workspace-id='code']") as HTMLButtonElement).click();
    expect(container.textContent).toContain("コード");
    expect(container.textContent).toContain("参照専用の確認画面");
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
});
