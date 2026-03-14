import { describe, expect, it } from "vitest";

import { DocumentWorkspaceController } from "../../src/document-workspace/controller/DocumentWorkspaceController";
import type { DocumentRecord } from "../../src/document-workspace/model/DocumentRecord";
import type { DocumentRepository } from "../../src/document-workspace/model/DocumentRepository";

class StubDocumentRepository implements DocumentRepository {
  public constructor(private readonly documents: DocumentRecord[]) {}

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
    return "Seed bootstrap + in-app save";
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
    expect(state.selectedDocument?.id).toBe("doc-1");
    expect(state.sourcePolicy).toContain("Seed");
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
    expect(state.selectedDocument?.id).toBe("doc-2");
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
    expect(saved.editor.saveMessage).toBe("保存しました");
  });

  it("cancels editing and restores the saved body", () => {
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

    const state = controller.cancelEditing("", "doc-1");

    expect(state.editor.isEditing).toBe(false);
    expect(state.editor.draftBody).toBe("Original body.");
    expect(state.editor.saveMessage).toBeNull();
  });
});
