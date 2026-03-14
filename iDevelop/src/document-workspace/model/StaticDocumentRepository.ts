import type { DocumentRecord } from "./DocumentRecord";
import type { DocumentRepository } from "./DocumentRepository";

export class StaticDocumentRepository implements DocumentRepository {
  private readonly documentsById: Map<string, DocumentRecord>;

  public constructor(documents: DocumentRecord[]) {
    this.documentsById = new Map(documents.map((document) => [document.id, { ...document }]));
  }

  public listDocuments(): DocumentRecord[] {
    return [...this.documentsById.values()].map((document) => ({ ...document, tags: [...document.tags] }));
  }

  public saveDocument(documentId: string, body: string): DocumentRecord {
    const current = this.documentsById.get(documentId);

    if (!current) {
      throw new Error(`Document '${documentId}' was not found.`);
    }

    const updated = { ...current, body };
    this.documentsById.set(documentId, updated);
    return { ...updated, tags: [...updated.tags] };
  }

  public getSourcePolicy(): string {
    return "Seed bootstrap + in-app save";
  }
}
