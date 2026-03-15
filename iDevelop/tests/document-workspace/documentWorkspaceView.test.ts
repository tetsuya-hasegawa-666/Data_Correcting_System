import { describe, expect, it } from "vitest";

import type { DocumentWorkspaceState } from "../../src/document-workspace/controller/DocumentWorkspaceController";
import { DocumentWorkspaceView } from "../../src/document-workspace/view/DocumentWorkspaceView";

const editableState: DocumentWorkspaceState = {
  query: "bdd",
  documents: [
    {
      id: "doc-1",
      title: "System Blueprint",
      path: "docs/artifact/system_blueprint.md",
      body: "MVC boundaries and module guidance.",
      tags: ["artifact"]
    },
    {
      id: "doc-2",
      title: "Research Operation",
      path: "docs/process/research_operation.md",
      body: "BDD and TDD operating rules.",
      tags: ["process"]
    },
    {
      id: "doc-3",
      title: "Guide",
      path: "docs/process/sub/guide.md",
      body: "Nested folder guide.",
      tags: ["process"]
    }
  ],
  directoryGroups: [
    { directoryPath: "docs/artifact", documents: [] },
    { directoryPath: "docs/process", documents: [] },
    { directoryPath: "docs/process/sub", documents: [] }
  ],
  selectedDocument: {
    id: "doc-2",
    title: "Research Operation",
    path: "docs/process/research_operation.md",
    body: "BDD and TDD operating rules.",
    tags: ["process"]
  },
  sourcePolicy: "Seed bootstrap + in-app save",
  isReadOnly: false,
  editor: {
    isEditing: false,
    draftBody: "BDD and TDD operating rules.",
    lastSavedBody: "BDD and TDD operating rules.",
    saveMessage: "Saved."
  },
  selectedBundle: [
    {
      id: "doc-1",
      title: "System Blueprint",
      path: "docs/artifact/system_blueprint.md",
      body: "MVC boundaries and module guidance.",
      tags: ["artifact"]
    },
    {
      id: "doc-2",
      title: "Research Operation",
      path: "docs/process/research_operation.md",
      body: "BDD and TDD operating rules.",
      tags: ["process"]
    }
  ],
  consultation: {
    selectedBundleIds: ["doc-1", "doc-2"],
    focusPrompt: "Explain the BDD guidance.",
    lastResponse: {
      summary: "Two documents were consulted.",
      evidence: [
        "System Blueprint (docs/artifact/system_blueprint.md)",
        "Research Operation (docs/process/research_operation.md)"
      ],
      nextAction: "focus: Explain the BDD guidance."
    }
  }
};

describe("DocumentWorkspaceView", () => {
  it("renders aligned consultation and draft panels with the same information structure", () => {
    const container = document.createElement("section");
    const view = new DocumentWorkspaceView(container);

    view.render(editableState);

    expect(container.querySelector("[data-role='preview-columns']")).not.toBeNull();
    expect(container.querySelector("[data-role='consultation-panel']")?.textContent).toContain(
      "目的:"
    );
    expect(container.querySelector("[data-role='consultation-panel']")?.textContent).toContain(
      "返る内容:"
    );
    expect(container.querySelector("[data-role='consultation-panel']")?.textContent).toContain(
      "変更範囲:"
    );
    expect(container.querySelector("[data-role='draft-panel']")?.textContent).toContain("目的:");
    expect(container.querySelector("[data-role='draft-panel']")?.textContent).toContain("反映内容:");
    expect(container.querySelector("[data-role='draft-panel']")?.textContent).toContain("元ソース:");
    expect(container.querySelector("[data-role='consultation-column']")?.textContent).toContain(
      "相談"
    );
    expect(container.querySelector("[data-role='draft-column']")?.textContent).toContain("Draft");
  });

  it("shows read-only unlock inside the draft panel only", () => {
    const container = document.createElement("section");
    const view = new DocumentWorkspaceView(container);

    view.render({
      ...editableState,
      isReadOnly: true,
      sourcePolicy: "filesystem recursive read-only",
      editor: {
        isEditing: false,
        draftBody: editableState.selectedDocument?.body ?? "",
        lastSavedBody: null,
        saveMessage: null
      }
    });

    expect(container.querySelector("[data-role='unlock-document-guidance']")).not.toBeNull();
    expect(container.querySelector("[data-role='draft-column']")?.textContent).toContain("解除条件:");
    expect(container.querySelector("[data-role='consultation-column']")?.textContent).not.toContain(
      "解除条件:"
    );
    expect(container.querySelector("[data-role='unlock-document-editing']")).not.toBeNull();
  });
});
