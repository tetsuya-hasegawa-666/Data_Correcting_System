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
    isComposerOpen: false,
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
  it("renders aligned consultation and draft panels with paired action boxes", () => {
    const container = document.createElement("section");
    const view = new DocumentWorkspaceView(container);

    view.render(editableState);

    expect(container.querySelector("[data-role='preview-columns']")).not.toBeNull();
    expect(container.querySelector("[data-role='consultation-panel']")).not.toBeNull();
    expect(container.querySelector("[data-role='draft-panel']")).not.toBeNull();
    expect(container.querySelector("[data-role='consultation-action-box']")).not.toBeNull();
    expect(container.querySelector("[data-role='draft-action-box']")).not.toBeNull();
    expect(container.querySelector("[data-role='open-consultation-composer']")).not.toBeNull();
  });

  it("shows read-only unlock inside the draft action box only", () => {
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
    expect(container.querySelector("[data-role='draft-action-box']")?.textContent).toContain("Draft");
    expect(container.querySelector("[data-role='consultation-action-box']")?.textContent).not.toContain(
      "safe apply"
    );
    expect(container.querySelector("[data-role='unlock-document-editing']")).not.toBeNull();
  });

  it("renders a consultation composer with save and cancel controls when opened", () => {
    const container = document.createElement("section");
    const view = new DocumentWorkspaceView(container);

    view.render({
      ...editableState,
      consultation: {
        ...editableState.consultation,
        focusPrompt: "Need a concise summary.",
        isComposerOpen: true
      }
    });

    expect(container.querySelector("[data-role='document-consultation-form']")).not.toBeNull();
    expect(container.querySelector("[data-role='consultation-save']")).not.toBeNull();
    expect(container.querySelector("[data-role='consultation-cancel']")).not.toBeNull();
  });
});
