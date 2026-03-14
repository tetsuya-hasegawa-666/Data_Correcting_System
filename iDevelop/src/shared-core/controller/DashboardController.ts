import { CodeWorkspaceController } from "../../code-workspace/controller/CodeWorkspaceController";
import type { CodeTargetRepository } from "../../code-workspace/model/CodeTargetRepository";
import { CodeWorkspaceView } from "../../code-workspace/view/CodeWorkspaceView";
import { DataWorkspaceController } from "../../data-workspace/controller/DataWorkspaceController";
import type { DatasetRepository } from "../../data-workspace/model/DatasetRepository";
import { DataWorkspaceView } from "../../data-workspace/view/DataWorkspaceView";
import type { DocumentEditorState } from "../../document-workspace/controller/DocumentWorkspaceController";
import { DocumentWorkspaceController } from "../../document-workspace/controller/DocumentWorkspaceController";
import type { DocumentRepository } from "../../document-workspace/model/DocumentRepository";
import { DocumentWorkspaceView } from "../../document-workspace/view/DocumentWorkspaceView";
import type { DashboardBootstrap } from "../bootstrap/loadDashboardBootstrap";

type WorkspaceId = "document" | "data" | "code";
type RefreshOutcome = "changed" | "unchanged" | "failed";

interface RefreshEvidence {
  timestamp: string;
  outcome: RefreshOutcome;
  message: string;
}

interface DashboardStatusState {
  loadedAt: string;
  sourceSignature: string;
  staleAfterMs: number;
  lastRefreshOutcome: RefreshOutcome | null;
  evidence: RefreshEvidence[];
}

const REFRESH_EVIDENCE_STORAGE_KEY = "idevelop.refreshEvidence";

export class DashboardController {
  private readonly documentController: DocumentWorkspaceController;
  private readonly dataController: DataWorkspaceController;
  private readonly codeController: CodeWorkspaceController;
  private workspaceId: WorkspaceId = "document";
  private query = "";
  private selectedDocumentId?: string;
  private editorState?: Partial<DocumentEditorState>;
  private errorMessage: string | null = null;
  private readonly statusState: DashboardStatusState;

  public constructor(
    private readonly rootElement: HTMLElement,
    documentRepository: DocumentRepository,
    datasetRepository: DatasetRepository,
    codeTargetRepository: CodeTargetRepository,
    bootstrap: Pick<DashboardBootstrap, "loadedAt" | "sourceSignature">,
    private readonly refreshDashboard?: () => Promise<DashboardBootstrap>
  ) {
    this.documentController = new DocumentWorkspaceController(documentRepository);
    this.dataController = new DataWorkspaceController(datasetRepository);
    this.codeController = new CodeWorkspaceController(codeTargetRepository);
    this.statusState = {
      loadedAt: bootstrap.loadedAt,
      sourceSignature: bootstrap.sourceSignature,
      staleAfterMs: 5 * 60 * 1000,
      lastRefreshOutcome: null,
      evidence: this.readEvidence()
    };
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

      const refreshButton = target.closest<HTMLElement>("[data-role='refresh-dashboard']");
      if (refreshButton) {
        void this.handleRefresh();
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
        this.errorMessage = null;
        this.render();
        return;
      }

      const cancelButton = target.closest<HTMLElement>("[data-role='cancel-document']");
      if (cancelButton?.dataset.documentId) {
        const state = this.documentController.cancelEditing(this.query, cancelButton.dataset.documentId);
        this.selectedDocumentId = state.selectedDocument?.id;
        this.editorState = state.editor;
        this.errorMessage = null;
        this.render();
        return;
      }

      const datasetButton = target.closest<HTMLElement>("[data-role='save-dataset']");
      if (datasetButton?.dataset.datasetId) {
        try {
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
        } catch (error) {
          this.errorMessage = error instanceof Error ? error.message : "データ更新に失敗しました。";
          this.render();
        }
        return;
      }

      const documentItem = target.closest<HTMLElement>("[data-role='document-item']");
      if (documentItem?.dataset.documentId) {
        const state = this.documentController.createState(
          this.query,
          documentItem.dataset.documentId,
          this.editorState
        );
        this.selectedDocumentId = state.selectedDocument?.id;
        this.editorState = state.editor;
        this.errorMessage = null;
        this.render();
        return;
      }

      if (
        this.workspaceId === "document" &&
        this.editorState?.isEditing &&
        !target.closest("[data-role='document-edit-form']")
      ) {
        const documentId = this.selectedDocumentId;

        if (documentId) {
          const state = this.documentController.cancelEditing(this.query, documentId);
          this.selectedDocumentId = state.selectedDocument?.id;
          this.editorState = state.editor;
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
          throw new Error("選択中の文書が見つかりません。");
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
        this.errorMessage = error instanceof Error ? error.message : "保存に失敗しました。";
      }

      this.render();
    });
  }

  private async handleRefresh(): Promise<void> {
    if (!this.refreshDashboard) {
      this.appendEvidence("unchanged", "再読み込みは seed mode のため省略しました。");
      this.render();
      return;
    }

    try {
      const nextBootstrap = await this.refreshDashboard();
      const previousSignature = this.statusState.sourceSignature;
      const outcome: RefreshOutcome =
        previousSignature === nextBootstrap.sourceSignature ? "unchanged" : "changed";
      const message =
        outcome === "changed"
          ? "再読み込みでソースの変化を反映しました。"
          : "再読み込みしましたが差分はありませんでした。";

      this.statusState.loadedAt = nextBootstrap.loadedAt;
      this.statusState.sourceSignature = nextBootstrap.sourceSignature;
      this.statusState.lastRefreshOutcome = outcome;
      this.appendEvidence(outcome, message);
      this.errorMessage = null;
    } catch (error) {
      this.statusState.lastRefreshOutcome = "failed";
      this.appendEvidence("failed", "再読み込みに失敗しました。");
      this.errorMessage = error instanceof Error ? error.message : "再読み込みに失敗しました。";
    }

    this.render();
  }

  private render(): void {
    const staleStatus = this.isStale() ? "stale" : "fresh";
    const refreshLabel = this.getRefreshLabel(staleStatus);
    const evidenceMarkup = this.statusState.evidence
      .slice(0, 3)
      .map(
        (item) =>
          `<li><strong>${this.escapeHtml(item.outcome)}</strong> ${this.escapeHtml(item.timestamp)} ${this.escapeHtml(item.message)}</li>`
      )
      .join("");

    this.rootElement.innerHTML = `
      <div class="shell-nav">
        ${this.renderTab("document", "文書")}
        ${this.renderTab("data", "データ")}
        ${this.renderTab("code", "コード")}
        <button class="tab-button" data-role="refresh-dashboard" type="button">再読み込み</button>
      </div>
      <section class="status-strip">
        <span class="status-badge status-${staleStatus}" data-role="stale-indicator">${refreshLabel}</span>
        <span data-role="loaded-at">取得時刻: ${this.escapeHtml(this.statusState.loadedAt)}</span>
        ${
          this.statusState.lastRefreshOutcome
            ? `<span data-role="refresh-outcome">直近結果: ${this.escapeHtml(this.statusState.lastRefreshOutcome)}</span>`
            : ""
        }
      </section>
      <section class="status-log">
        <p class="eyebrow">Refresh Evidence</p>
        <ul data-role="refresh-evidence">${evidenceMarkup || "<li>まだ evidence はありません。</li>"}</ul>
      </section>
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

  private isStale(): boolean {
    const loadedAt = new Date(this.statusState.loadedAt).getTime();
    return Number.isFinite(loadedAt) && Date.now() - loadedAt > this.statusState.staleAfterMs;
  }

  private getRefreshLabel(staleStatus: "fresh" | "stale"): string {
    if (staleStatus === "stale") {
      return "stale";
    }

    if (this.statusState.lastRefreshOutcome === "changed") {
      return "refreshed";
    }

    return "fresh";
  }

  private appendEvidence(outcome: RefreshOutcome, message: string): void {
    const evidence: RefreshEvidence = {
      timestamp: new Date().toISOString(),
      outcome,
      message
    };

    this.statusState.evidence = [evidence, ...this.statusState.evidence].slice(0, 5);
    this.writeEvidence(this.statusState.evidence);
  }

  private readEvidence(): RefreshEvidence[] {
    try {
      const raw = globalThis.localStorage?.getItem(REFRESH_EVIDENCE_STORAGE_KEY);
      return raw ? (JSON.parse(raw) as RefreshEvidence[]) : [];
    } catch {
      return [];
    }
  }

  private writeEvidence(evidence: RefreshEvidence[]): void {
    try {
      globalThis.localStorage?.setItem(REFRESH_EVIDENCE_STORAGE_KEY, JSON.stringify(evidence));
    } catch {
      // ignore storage failures and keep in-memory evidence only
    }
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }
}
