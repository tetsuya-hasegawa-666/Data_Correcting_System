import { CodeWorkspaceController } from "../../code-workspace/controller/CodeWorkspaceController";
import type { CodeTargetRepository } from "../../code-workspace/model/CodeTargetRepository";
import { CodeWorkspaceView } from "../../code-workspace/view/CodeWorkspaceView";
import { DataWorkspaceController } from "../../data-workspace/controller/DataWorkspaceController";
import type { DatasetRepository } from "../../data-workspace/model/DatasetRepository";
import { DataWorkspaceView } from "../../data-workspace/view/DataWorkspaceView";
import { DocumentWorkspaceController } from "../../document-workspace/controller/DocumentWorkspaceController";
import type { DocumentEditorState } from "../../document-workspace/controller/DocumentWorkspaceController";
import type { DocumentRepository } from "../../document-workspace/model/DocumentRepository";
import { DocumentWorkspaceView } from "../../document-workspace/view/DocumentWorkspaceView";

type WorkspaceId = "document" | "data" | "code";

export class DashboardController {
  private readonly documentController: DocumentWorkspaceController;
  private readonly dataController: DataWorkspaceController;
  private readonly codeController: CodeWorkspaceController;
  private workspaceId: WorkspaceId = "document";
  private query = "";
  private selectedDocumentId?: string;
  private editorState?: Partial<DocumentEditorState>;
  private errorMessage: string | null = null;

  public constructor(
    private readonly rootElement: HTMLElement,
    documentRepository: DocumentRepository,
    datasetRepository: DatasetRepository,
    codeTargetRepository: CodeTargetRepository
  ) {
    this.documentController = new DocumentWorkspaceController(documentRepository);
    this.dataController = new DataWorkspaceController(datasetRepository);
    this.codeController = new CodeWorkspaceController(codeTargetRepository);
  }

  public start(): void {
    this.render();

    this.rootElement.addEventListener("input", (event) => {
      const target = event.target;

      if (target instanceof HTMLInputElement && target.name === "document-query") {
        this.query = target.value;
        this.render();
        return;
      }

      if (target instanceof HTMLTextAreaElement && target.name === "document-body") {
        this.editorState = {
          ...(this.editorState ?? {
            isEditing: true,
            lastSavedBody: null,
            saveMessage: null
          }),
          draftBody: target.value
        };
      }
    });

    this.rootElement.addEventListener("click", (event) => {
      const target = event.target;

      if (!(target instanceof HTMLElement)) {
        return;
      }

      const tab = target.closest<HTMLElement>("[data-role='workspace-tab']");
      if (tab?.dataset.workspaceId) {
        this.workspaceId = tab.dataset.workspaceId as WorkspaceId;
        this.errorMessage = null;
        this.render();
        return;
      }

      const editButton = target.closest<HTMLElement>("[data-role='edit-document']");
      if (editButton?.dataset.documentId) {
        const state = this.documentController.startEditing(this.query, editButton.dataset.documentId);
        this.selectedDocumentId = state.selectedDocument?.id;
        this.editorState = state.editor;
        this.render();
        return;
      }

      const datasetButton = target.closest<HTMLElement>("[data-role='save-dataset']");
      if (datasetButton?.dataset.datasetId) {
        const datasetId = datasetButton.dataset.datasetId;
        const row = datasetButton.closest("tr");
        const statusInput = row?.querySelector<HTMLSelectElement>(
          `[data-role='dataset-status'][data-dataset-id='${datasetId}']`
        );
        const countInput = row?.querySelector<HTMLInputElement>(
          `[data-role='dataset-record-count'][data-dataset-id='${datasetId}']`
        );

        if (statusInput && countInput) {
          this.dataController.updateDataset(datasetId, statusInput.value, Number(countInput.value));
          this.workspaceId = "data";
          this.errorMessage = null;
          this.render();
        }
      }
    });

    this.rootElement.addEventListener("submit", (event) => {
      const form = event.target;

      if (!(form instanceof HTMLFormElement) || form.dataset.role !== "document-edit-form") {
        return;
      }

      event.preventDefault();

      try {
        if (!this.selectedDocumentId) {
          throw new Error("Selected document was not found.");
        }

        const draftBody =
          form.querySelector<HTMLTextAreaElement>("[data-role='document-editor']")?.value ?? "";
        const state = this.documentController.saveDocument(
          this.query,
          this.selectedDocumentId,
          draftBody
        );
        this.selectedDocumentId = state.selectedDocument?.id;
        this.editorState = state.editor;
        this.errorMessage = null;
      } catch (error) {
        this.errorMessage = error instanceof Error ? error.message : "Save failed.";
      }

      this.render();
    });
  }

  private render(): void {
    this.rootElement.innerHTML = `
      <div class="shell-nav">
        ${this.renderTab("document", "Document")}
        ${this.renderTab("data", "Data")}
        ${this.renderTab("code", "Code")}
      </div>
      ${this.errorMessage ? `<p class="error-banner" data-role="error-banner">${this.errorMessage}</p>` : ""}
      <div data-role="workspace-content"></div>
    `;

    const content = this.rootElement.querySelector<HTMLElement>("[data-role='workspace-content']");

    if (!content) {
      throw new Error("Workspace content host was not found.");
    }

    switch (this.workspaceId) {
      case "document": {
        const state = this.documentController.createState(
          this.query,
          this.selectedDocumentId,
          this.editorState
        );
        this.selectedDocumentId = state.selectedDocument?.id;
        this.editorState = state.editor;
        new DocumentWorkspaceView(content).render(state);
        break;
      }
      case "data":
        new DataWorkspaceView(content).render(this.dataController.createState());
        break;
      case "code":
        new CodeWorkspaceView(content).render(this.codeController.createState());
        break;
    }
  }

  private renderTab(workspaceId: WorkspaceId, label: string): string {
    return `
      <button
        class="tab-button ${this.workspaceId === workspaceId ? "is-selected" : ""}"
        data-role="workspace-tab"
        data-workspace-id="${workspaceId}"
        type="button"
      >
        ${label}
      </button>
    `;
  }
}
