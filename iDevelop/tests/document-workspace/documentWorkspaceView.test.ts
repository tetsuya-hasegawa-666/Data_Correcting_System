import { describe, expect, it } from "vitest";

import type { DocumentWorkspaceState } from "../../src/document-workspace/controller/DocumentWorkspaceController";
import { DocumentWorkspaceView } from "../../src/document-workspace/view/DocumentWorkspaceView";

const state: DocumentWorkspaceState = {
  query: "bdd",
  documents: [
    {
      id: "doc-2",
      title: "Research Operation",
      path: "docs/process/research_operation.md",
      body: "BDD and TDD operating rules.",
      tags: ["process"]
    }
  ],
  selectedDocument: {
    id: "doc-2",
    title: "Research Operation",
    path: "docs/process/research_operation.md",
    body: "BDD and TDD operating rules.",
    tags: ["process"]
  },
  sourcePolicy: "Seed bootstrap + in-app save",
  editor: {
    isEditing: true,
    draftBody: "BDD and TDD operating rules.",
    lastSavedBody: "BDD and TDD operating rules.",
    saveMessage: "Saved"
  }
};

describe("DocumentWorkspaceView", () => {
  it("renders the current query, result count, and selected document preview", () => {
    const container = document.createElement("section");
    const view = new DocumentWorkspaceView(container);

    view.render(state);

    expect(container.querySelector("[data-role='search-input']")?.getAttribute("value")).toBe(
      "bdd"
    );
    expect(container.querySelector("[data-role='result-count']")?.textContent).toContain("1");
    expect(container.querySelector("[data-role='document-title']")?.textContent).toContain(
      "Research Operation"
    );
    expect(container.querySelector("[data-role='document-body']")?.textContent).toContain("BDD");
    expect(
      (container.querySelector("[data-role='document-editor']") as HTMLTextAreaElement | null)?.value
    ).toContain("BDD");
    expect(container.querySelector("[data-role='save-message']")?.textContent).toContain("Saved");
  });
});
