import type { DocumentRecord } from "./DocumentRecord";
import type { DocumentRepository } from "./DocumentRepository";

const STORAGE_KEY = "idevelop.documents";

export class BrowserDocumentRepository implements DocumentRepository {
  public constructor(private readonly seedDocuments: DocumentRecord[]) {}

  public listDocuments(): DocumentRecord[] {
    return this.readDocuments();
  }

  public saveDocument(documentId: string, body: string): DocumentRecord {
    const documents = this.readDocuments();
    const index = documents.findIndex((document) => document.id === documentId);

    if (index < 0) {
      throw new Error(`Document '${documentId}' was not found.`);
    }

    const updated = { ...documents[index], body };
    documents[index] = updated;
    this.writeDocuments(documents);
    return { ...updated, tags: [...updated.tags] };
  }

  public getSourcePolicy(): string {
    return "Seed bootstrap + localStorage save";
  }

  private readDocuments(): DocumentRecord[] {
    const storage = globalThis.localStorage;
    const raw = storage?.getItem(STORAGE_KEY);

    if (!raw) {
      const seed = this.seedDocuments.map((document) => ({ ...document, tags: [...document.tags] }));
      this.writeDocuments(seed);
      return seed;
    }

    return JSON.parse(raw) as DocumentRecord[];
  }

  private writeDocuments(documents: DocumentRecord[]): void {
    globalThis.localStorage?.setItem(STORAGE_KEY, JSON.stringify(documents));
  }
}
