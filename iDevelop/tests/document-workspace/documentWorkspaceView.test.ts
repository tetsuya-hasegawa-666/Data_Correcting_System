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
    {
      directoryPath: "docs/artifact",
      documents: [
        {
          id: "doc-1",
          title: "System Blueprint",
          path: "docs/artifact/system_blueprint.md",
          body: "MVC boundaries and module guidance.",
          tags: ["artifact"]
        }
      ]
    },
    {
      directoryPath: "docs/process",
      documents: [
        {
          id: "doc-2",
          title: "Research Operation",
          path: "docs/process/research_operation.md",
          body: "BDD and TDD operating rules.",
          tags: ["process"]
        }
      ]
    },
    {
      directoryPath: "docs/process/sub",
      documents: [
        {
          id: "doc-3",
          title: "Guide",
          path: "docs/process/sub/guide.md",
          body: "Nested folder guide.",
          tags: ["process"]
        }
      ]
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
  it("renders explorer search on the left and preview actions on the right", () => {
    const container = document.createElement("section");
    const view = new DocumentWorkspaceView(container);

    view.render(editableState);

    expect(container.querySelector("[data-role='document-layout']")?.getAttribute("data-layout")).toBe(
      "explorer-preview"
    );
    expect(container.querySelector("[data-role='search-input']")?.getAttribute("value")).toBe(
      "bdd"
    );
    expect(container.querySelector("[data-role='explorer-tree']")).not.toBeNull();
    expect(container.querySelectorAll("[data-role='tree-node'][data-kind='directory']")).toHaveLength(
      4
    );
    expect(container.querySelector("[data-role='tree-node'][data-path='docs/process/sub']"))
      .not.toBeNull();
    expect(container.querySelector("[data-role='tree-node'][data-kind='file'][data-document-id='doc-3']"))
      .not.toBeNull();
    expect(container.querySelector("[data-role='preview-action-guide']")?.textContent).toContain(
      "相談"
    );
    expect(container.querySelector("[data-role='preview-action-guide']")?.textContent).toContain(
      "Draft"
    );
    expect(container.querySelector("[data-role='consultation-focus-input']")).not.toBeNull();
    expect(container.querySelector("[data-role='edit-document']")).not.toBeNull();
  });

  it("shows read-only unlock and draft guidance in the preview pane", () => {
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
    expect(container.querySelector("[data-role='unlock-document-editing']")).not.toBeNull();
    expect(container.querySelector("[data-role='preview-action-guide']")?.textContent).toContain(
      "相談"
    );
    expect(container.querySelector("[data-role='preview-action-guide']")?.textContent).toContain(
      "Draft"
    );
    expect(container.querySelector("[data-role='explorer-panel']")?.textContent).not.toContain(
      "解除条件"
    );
  });
});
