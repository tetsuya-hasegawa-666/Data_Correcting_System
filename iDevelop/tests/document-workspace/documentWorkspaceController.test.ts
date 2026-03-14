import { describe, expect, it } from "vitest";

import { DocumentWorkspaceController } from "../../src/document-workspace/controller/DocumentWorkspaceController";
import type { DocumentRecord } from "../../src/document-workspace/model/DocumentRecord";
import type { DocumentRepository } from "../../src/document-workspace/model/DocumentRepository";

class StubDocumentRepository implements DocumentRepository {
  public constructor(
    private readonly documents: DocumentRecord[],
    private readonly readOnly = false
  ) {}

  public listDocuments(): DocumentRecord[] {
    return this.documents;
  }

  public saveDocument(documentId: string, body: string): DocumentRecord {
    const index = this.documents.findIndex((document) => document.id === documentId);

    if (index < 0) {
      throw new Error("not found");
    }

    this.documents[index] = { ...this.documents[index], body };
    return this.documents[index];
  }

  public getSourcePolicy(): string {
    return this.readOnly ? "filesystem recursive read-only" : "Seed bootstrap + in-app save";
  }

  public isReadOnly(): boolean {
    return this.readOnly;
  }
}

describe("DocumentWorkspaceController", () => {
  it("returns all documents sorted by title when no query is provided", () => {
    const controller = new DocumentWorkspaceController(
      new StubDocumentRepository([
        {
          id: "doc-2",
          title: "System Blueprint",
          path: "docs/artifact/system_blueprint.md",
          body: "MVC boundaries and module guidance.",
          tags: ["artifact"]
        },
        {
          id: "doc-1",
          title: "North Star",
          path: "docs/artifact/north_star.md",
          body: "Human goal and non-negotiables.",
          tags: ["artifact"]
        }
      ])
    );

    const state = controller.createState("");

    expect(state.query).toBe("");
    expect(state.documents.map((document) => document.title)).toEqual([
      "North Star",
      "System Blueprint"
    ]);
    expect(state.directoryGroups.map((group) => group.directoryPath)).toEqual(["docs/artifact"]);
    expect(state.directoryGroups[0]?.documents.map((document) => document.title)).toEqual([
      "North Star",
      "System Blueprint"
    ]);
    expect(state.selectedDocument?.id).toBe("doc-1");
    expect(state.sourcePolicy).toContain("Seed");
    expect(state.isReadOnly).toBe(false);
  });

  it("filters documents by case-insensitive keyword match across title, path, and body", () => {
    const controller = new DocumentWorkspaceController(
      new StubDocumentRepository([
        {
          id: "doc-1",
          title: "North Star",
          path: "docs/artifact/north_star.md",
          body: "Human goal and non-negotiables.",
          tags: ["artifact"]
        },
        {
          id: "doc-2",
          title: "Research Operation",
          path: "docs/process/research_operation.md",
          body: "BDD and TDD operating rules.",
          tags: ["process"]
        }
      ])
    );

    const state = controller.createState("bdd");

    expect(state.documents.map((document) => document.id)).toEqual(["doc-2"]);
    expect(state.directoryGroups.map((group) => group.directoryPath)).toEqual(["docs/process"]);
    expect(state.selectedDocument?.id).toBe("doc-2");
  });

  it("keeps a multi-document consultation bundle and returns a consultation response", () => {
    const controller = new DocumentWorkspaceController(
      new StubDocumentRepository([
        {
          id: "doc-1",
          title: "North Star",
          path: "docs/artifact/north_star.md",
          body: "Human goal and non-negotiables.",
          tags: ["artifact"]
        },
        {
          id: "doc-2",
          title: "Research Operation",
          path: "docs/process/research_operation.md",
          body: "BDD and TDD operating rules.",
          tags: ["process"]
        }
      ])
    );

    const selected = controller.toggleBundleSelection("", "doc-2", "doc-1");
    const consulted = controller.consultDocuments("", "doc-1", undefined, {
      ...selected.consultation,
      focusPrompt: "BDD の根拠を確認したい"
    });

    expect(selected.consultation.selectedBundleIds).toEqual(["doc-1", "doc-2"]);
    expect(consulted.selectedBundle.map((document) => document.id)).toEqual(["doc-1", "doc-2"]);
    expect(consulted.consultation.lastResponse?.summary).toContain("2 件");
    expect(consulted.consultation.lastResponse?.evidence[0]).toContain("North Star");
    expect(consulted.consultation.lastResponse?.nextAction).toContain("BDD");
  });

  it("enters edit mode and saves the edited body", () => {
    const controller = new DocumentWorkspaceController(
      new StubDocumentRepository([
        {
          id: "doc-1",
          title: "North Star",
          path: "docs/artifact/north_star.md",
          body: "Original body.",
          tags: ["artifact"]
        }
      ])
    );

    const editing = controller.startEditing("", "doc-1");
    const saved = controller.saveDocument("", "doc-1", "Updated body.");

    expect(editing.editor.isEditing).toBe(true);
    expect(editing.editor.draftBody).toBe("Original body.");
    expect(saved.selectedDocument?.body).toBe("Updated body.");
    expect(saved.editor.saveMessage).toBe("保存しました。");
  });

  it("keeps the document read-only when the repository is read-only", () => {
    const controller = new DocumentWorkspaceController(
      new StubDocumentRepository(
        [
          {
            id: "doc-1",
            title: "North Star",
            path: "docs/artifact/north_star.md",
            body: "Original body.",
            tags: ["artifact"]
          }
        ],
        true
      )
    );

    const state = controller.startEditing("", "doc-1");

    expect(state.isReadOnly).toBe(true);
    expect(state.editor.isEditing).toBe(false);
  });
});
