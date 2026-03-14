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
    isEditing: true,
    draftBody: "BDD and TDD operating rules.",
    lastSavedBody: "BDD and TDD operating rules.",
    saveMessage: "保存しました。"
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
    focusPrompt: "BDD の根拠を確認したい",
    lastResponse: {
      summary: "2 件の文書を consultation bundle として固定しました。",
      evidence: [
        "System Blueprint (docs/artifact/system_blueprint.md)",
        "Research Operation (docs/process/research_operation.md)"
      ],
      nextAction: "focus: BDD の根拠を確認したい"
    }
  }
};

describe("DocumentWorkspaceView", () => {
  it("renders the current query, grouped directory list, and selected document preview", () => {
    const container = document.createElement("section");
    const view = new DocumentWorkspaceView(container);

    view.render(editableState);

    expect(container.querySelector("[data-role='search-input']")?.getAttribute("value")).toBe(
      "bdd"
    );
    expect(container.querySelector("[data-role='result-count']")?.textContent).toContain("2");
    expect(container.querySelector("[data-role='directory-group-count']")?.textContent).toContain(
      "2"
    );
    expect(container.querySelector("[data-role='directory-group-title']")?.textContent).toContain(
      "docs/artifact"
    );
    expect(
      container.querySelector("[data-role='directory-group-status-label']")?.textContent
    ).toContain("編集可能");
    expect(container.querySelector("[data-role='document-title']")?.textContent).toContain(
      "Research Operation"
    );
    expect(container.querySelector("[data-role='document-body']")?.textContent).toContain("BDD");
    expect(
      (container.querySelector("[data-role='document-editor']") as HTMLTextAreaElement | null)?.value
    ).toContain("BDD");
    expect(container.querySelector("[data-role='save-message']")?.textContent).toContain(
      "保存しました。"
    );
    expect(container.textContent).toContain("文書");
    expect(container.textContent).toContain("キャンセル");
    expect(container.querySelector("[data-role='document-bundle-count']")?.textContent).toContain(
      "2"
    );
    expect(container.querySelector("[data-role='consultation-focus-input']")?.textContent).toContain(
      "BDD"
    );
    expect(
      container.querySelector("[data-role='document-consultation-response']")?.textContent
    ).toContain("Summary");
  });

  it("shows read-only guidance and hides edit controls for live documents", () => {
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
      },
      selectedBundle: editableState.selectedBundle,
      consultation: {
        selectedBundleIds: editableState.consultation.selectedBundleIds,
        focusPrompt: editableState.consultation.focusPrompt,
        lastResponse: editableState.consultation.lastResponse
      }
    });

    expect(container.textContent).toContain("読み取り専用");
    expect(
      container.querySelector("[data-role='directory-group-status-label']")?.textContent
    ).toContain("読み取り専用");
    expect(container.querySelector("[data-role='edit-document']")).toBeNull();
  });
});
