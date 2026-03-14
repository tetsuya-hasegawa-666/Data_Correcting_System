import type { DocumentRecord } from "../model/DocumentRecord";
import type { DocumentRepository } from "../model/DocumentRepository";

export interface DocumentEditorState {
  isEditing: boolean;
  draftBody: string;
  lastSavedBody: string | null;
  saveMessage: string | null;
}

export interface DocumentWorkspaceState {
  query: string;
  documents: DocumentRecord[];
  selectedDocument: DocumentRecord | null;
  sourcePolicy: string;
  editor: DocumentEditorState;
}

export class DocumentWorkspaceController {
  public constructor(private readonly repository: DocumentRepository) {}

  public createState(
    query: string,
    selectedDocumentId?: string,
    editorState?: Partial<DocumentEditorState>
  ): DocumentWorkspaceState {
    const normalizedQuery = query.trim().toLowerCase();
    const documents = this.repository
      .listDocuments()
      .filter((document) => this.matches(document, normalizedQuery))
      .sort((left, right) => left.title.localeCompare(right.title, "ja"));

    const selectedDocument =
      documents.find((document) => document.id === selectedDocumentId) ?? documents[0] ?? null;
    const defaultDraftBody = selectedDocument?.body ?? "";

    return {
      query,
      documents,
      selectedDocument,
      sourcePolicy: this.repository.getSourcePolicy(),
      editor: {
        isEditing: editorState?.isEditing ?? false,
        draftBody: editorState?.draftBody ?? defaultDraftBody,
        lastSavedBody: editorState?.lastSavedBody ?? null,
        saveMessage: editorState?.saveMessage ?? null
      }
    };
  }

  public startEditing(query: string, documentId: string): DocumentWorkspaceState {
    const state = this.createState(query, documentId);

    if (!state.selectedDocument) {
      return state;
    }

    return this.createState(query, documentId, {
      isEditing: true,
      draftBody: state.selectedDocument.body,
      lastSavedBody: state.selectedDocument.body,
      saveMessage: null
    });
  }

  public saveDocument(query: string, documentId: string, draftBody: string): DocumentWorkspaceState {
    const savedDocument = this.repository.saveDocument(documentId, draftBody);

    return this.createState(query, savedDocument.id, {
      isEditing: false,
      draftBody: savedDocument.body,
      lastSavedBody: savedDocument.body,
      saveMessage: "保存しました"
    });
  }

  public cancelEditing(query: string, documentId: string): DocumentWorkspaceState {
    const state = this.createState(query, documentId);

    if (!state.selectedDocument) {
      return state;
    }

    return this.createState(query, documentId, {
      isEditing: false,
      draftBody: state.selectedDocument.body,
      lastSavedBody: state.selectedDocument.body,
      saveMessage: null
    });
  }

  private matches(document: DocumentRecord, query: string): boolean {
    if (query.length === 0) {
      return true;
    }

    const haystacks = [document.title, document.path, document.body, document.tags.join(" ")];

    return haystacks.some((haystack) => haystack.toLowerCase().includes(query));
  }
}
