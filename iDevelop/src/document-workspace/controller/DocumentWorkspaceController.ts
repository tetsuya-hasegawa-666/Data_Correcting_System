import type { DocumentRecord } from "../model/DocumentRecord";
import type { DocumentRepository } from "../model/DocumentRepository";

export interface DocumentEditorState {
  isEditing: boolean;
  draftBody: string;
  lastSavedBody: string | null;
  saveMessage: string | null;
}

export interface DocumentConsultationResponse {
  summary: string;
  evidence: string[];
  nextAction: string;
}

export interface DocumentConsultationState {
  selectedBundleIds: string[];
  focusPrompt: string;
  lastResponse: DocumentConsultationResponse | null;
  isComposerOpen: boolean;
}

export interface DocumentDirectoryGroup {
  directoryPath: string;
  documents: DocumentRecord[];
}

export interface DocumentWorkspaceState {
  query: string;
  documents: DocumentRecord[];
  directoryGroups: DocumentDirectoryGroup[];
  selectedDocument: DocumentRecord | null;
  selectedBundle: DocumentRecord[];
  sourcePolicy: string;
  isReadOnly: boolean;
  editor: DocumentEditorState;
  consultation: DocumentConsultationState;
}

export class DocumentWorkspaceController {
  public constructor(private readonly repository: DocumentRepository) {}

  public createState(
    query: string,
    selectedDocumentId?: string,
    editorState?: Partial<DocumentEditorState>,
    consultationState?: Partial<DocumentConsultationState>
  ): DocumentWorkspaceState {
    const normalizedQuery = query.trim().toLowerCase();
    const documents = this.repository
      .listDocuments()
      .filter((document) => this.matches(document, normalizedQuery))
      .sort((left, right) => left.title.localeCompare(right.title, "ja"));

    const selectedDocument =
      documents.find((document) => document.id === selectedDocumentId) ?? documents[0] ?? null;
    const selectedBundleIds =
      consultationState?.selectedBundleIds?.filter((documentId) =>
        documents.some((document) => document.id === documentId)
      ) ?? (selectedDocument ? [selectedDocument.id] : []);

    return {
      query,
      documents,
      directoryGroups: this.groupByDirectory(documents),
      selectedDocument,
      selectedBundle: documents.filter((document) => selectedBundleIds.includes(document.id)),
      sourcePolicy: this.repository.getSourcePolicy(),
      isReadOnly: this.repository.isReadOnly(),
      editor: {
        isEditing: editorState?.isEditing ?? false,
        draftBody: editorState?.draftBody ?? selectedDocument?.body ?? "",
        lastSavedBody: editorState?.lastSavedBody ?? null,
        saveMessage: editorState?.saveMessage ?? null
      },
      consultation: {
        selectedBundleIds,
        focusPrompt: consultationState?.focusPrompt ?? "",
        lastResponse: consultationState?.lastResponse ?? null,
        isComposerOpen: consultationState?.isComposerOpen ?? false
      }
    };
  }

  public startEditing(
    query: string,
    documentId: string,
    consultationState?: Partial<DocumentConsultationState>
  ): DocumentWorkspaceState {
    const state = this.createState(query, documentId, undefined, consultationState);
    if (!state.selectedDocument || state.isReadOnly) {
      return state;
    }
    return this.createState(
      query,
      documentId,
      {
        isEditing: true,
        draftBody: state.selectedDocument.body,
        lastSavedBody: state.selectedDocument.body,
        saveMessage: null
      },
      state.consultation
    );
  }

  public saveDocument(
    query: string,
    documentId: string,
    draftBody: string,
    consultationState?: Partial<DocumentConsultationState>
  ): DocumentWorkspaceState {
    const savedDocument = this.repository.saveDocument(documentId, draftBody);
    return this.createState(
      query,
      savedDocument.id,
      {
        isEditing: false,
        draftBody: savedDocument.body,
        lastSavedBody: savedDocument.body,
        saveMessage: "保存しました。"
      },
      consultationState
    );
  }

  public cancelEditing(
    query: string,
    documentId: string,
    consultationState?: Partial<DocumentConsultationState>
  ): DocumentWorkspaceState {
    const state = this.createState(query, documentId, undefined, consultationState);
    if (!state.selectedDocument) {
      return state;
    }
    return this.createState(
      query,
      documentId,
      {
        isEditing: false,
        draftBody: state.selectedDocument.body,
        lastSavedBody: state.selectedDocument.body,
        saveMessage: null
      },
      state.consultation
    );
  }

  public toggleBundleSelection(
    query: string,
    documentId: string,
    selectedDocumentId?: string,
    editorState?: Partial<DocumentEditorState>,
    consultationState?: Partial<DocumentConsultationState>
  ): DocumentWorkspaceState {
    const state = this.createState(query, selectedDocumentId, editorState, consultationState);
    const nextSelectedBundleIds = state.consultation.selectedBundleIds.includes(documentId)
      ? state.consultation.selectedBundleIds.filter((selectedId) => selectedId !== documentId)
      : [...state.consultation.selectedBundleIds, documentId];

    return this.createState(query, selectedDocumentId, editorState, {
      ...state.consultation,
      selectedBundleIds: nextSelectedBundleIds,
      lastResponse: null
    });
  }

  public updateConsultationFocus(
    query: string,
    focusPrompt: string,
    selectedDocumentId?: string,
    editorState?: Partial<DocumentEditorState>,
    consultationState?: Partial<DocumentConsultationState>
  ): DocumentWorkspaceState {
    const state = this.createState(query, selectedDocumentId, editorState, consultationState);
    return this.createState(query, selectedDocumentId, editorState, {
      ...state.consultation,
      focusPrompt,
      isComposerOpen: true
    });
  }

  public openConsultationComposer(
    query: string,
    selectedDocumentId?: string,
    editorState?: Partial<DocumentEditorState>,
    consultationState?: Partial<DocumentConsultationState>
  ): DocumentWorkspaceState {
    const state = this.createState(query, selectedDocumentId, editorState, consultationState);
    return this.createState(query, selectedDocumentId, editorState, {
      ...state.consultation,
      isComposerOpen: true
    });
  }

  public closeConsultationComposer(
    query: string,
    selectedDocumentId?: string,
    editorState?: Partial<DocumentEditorState>,
    consultationState?: Partial<DocumentConsultationState>
  ): DocumentWorkspaceState {
    const state = this.createState(query, selectedDocumentId, editorState, consultationState);
    return this.createState(query, selectedDocumentId, editorState, {
      ...state.consultation,
      isComposerOpen: false,
      focusPrompt: ""
    });
  }

  public consultDocuments(
    query: string,
    selectedDocumentId?: string,
    editorState?: Partial<DocumentEditorState>,
    consultationState?: Partial<DocumentConsultationState>
  ): DocumentWorkspaceState {
    const state = this.createState(query, selectedDocumentId, editorState, consultationState);
    const bundle = state.selectedBundle;
    const focusPrompt = state.consultation.focusPrompt.trim();

    const summary =
      bundle.length === 0
        ? "相談対象の文書が選択されていません。"
        : `${bundle.length} 件の文書を consultation bundle として参照しました。`;
    const evidence = bundle.map((document) => `${document.title} (${document.path})`);
    const nextAction =
      bundle.length === 0
        ? "consultation bundle に文書を追加してください。"
        : focusPrompt.length > 0
          ? `focus: ${focusPrompt}`
          : "Set a focus prompt before the next consultation.";

    return this.createState(query, selectedDocumentId, editorState, {
      ...state.consultation,
      isComposerOpen: false,
      lastResponse: {
        summary,
        evidence,
        nextAction
      }
    });
  }

  private matches(document: DocumentRecord, query: string): boolean {
    if (query.length === 0) {
      return true;
    }
    const haystacks = [document.title, document.path, document.body, document.tags.join(" ")];
    return haystacks.some((haystack) => haystack.toLowerCase().includes(query));
  }

  private groupByDirectory(documents: DocumentRecord[]): DocumentDirectoryGroup[] {
    const groups = new Map<string, DocumentRecord[]>();
    for (const document of documents) {
      const directoryPath = this.resolveDirectoryPath(document.path);
      const current = groups.get(directoryPath) ?? [];
      current.push(document);
      groups.set(directoryPath, current);
    }
    return [...groups.entries()].map(([directoryPath, groupedDocuments]) => ({
      directoryPath,
      documents: groupedDocuments
    }));
  }

  private resolveDirectoryPath(path: string): string {
    const lastSlashIndex = path.lastIndexOf("/");
    return lastSlashIndex < 0 ? "." : path.slice(0, lastSlashIndex);
  }
}
