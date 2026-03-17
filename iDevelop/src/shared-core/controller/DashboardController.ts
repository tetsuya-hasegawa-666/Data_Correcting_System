import { CodeWorkspaceController } from "../../code-workspace/controller/CodeWorkspaceController";
import type { CodeConsultationState } from "../../code-workspace/controller/CodeWorkspaceController";
import type { CodeTargetRepository } from "../../code-workspace/model/CodeTargetRepository";
import { CodeWorkspaceView } from "../../code-workspace/view/CodeWorkspaceView";
import { DataWorkspaceController } from "../../data-workspace/controller/DataWorkspaceController";
import type { DataConsultationState } from "../../data-workspace/controller/DataWorkspaceController";
import type { DatasetRepository } from "../../data-workspace/model/DatasetRepository";
import { UnlockableDatasetRepository } from "../../data-workspace/model/UnlockableDatasetRepository";
import { DataWorkspaceView } from "../../data-workspace/view/DataWorkspaceView";
import { DocumentWorkspaceController } from "../../document-workspace/controller/DocumentWorkspaceController";
import type {
  DocumentConsultationState,
  DocumentEditorState
} from "../../document-workspace/controller/DocumentWorkspaceController";
import type { DocumentRepository } from "../../document-workspace/model/DocumentRepository";
import { UnlockableDocumentRepository } from "../../document-workspace/model/UnlockableDocumentRepository";
import { DocumentWorkspaceView } from "../../document-workspace/view/DocumentWorkspaceView";
import type { DashboardBootstrap } from "../bootstrap/loadDashboardBootstrap";
import {
  createConsultationSession,
  type ConsultationBundleItem,
  type ConsultationSessionState
} from "../model/ConsultationSession";
import {
  appendConversationEntry,
  applyProposalAction,
  createEmptyConversationState,
  updateApplyState,
  type ProposalAction,
  type SharedConversationState
} from "../model/SharedConversation";

type WorkspaceId = "document" | "data" | "code";
type RefreshOutcome = "changed" | "unchanged" | "failed";
type HeaderCardId = "status" | "contract" | "shell" | null;

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
  private readonly documentRepository: UnlockableDocumentRepository;
  private readonly datasetRepository: UnlockableDatasetRepository;
  private readonly documentController: DocumentWorkspaceController;
  private readonly dataController: DataWorkspaceController;
  private readonly codeController: CodeWorkspaceController;
  private workspaceId: WorkspaceId = "document";
  private query = "";
  private selectedDocumentId?: string;
  private selectedDatasetId?: string;
  private editorState?: Partial<DocumentEditorState>;
  private documentConsultationState?: Partial<DocumentConsultationState>;
  private dataConsultationState?: Partial<DataConsultationState>;
  private codeConsultationState?: Partial<CodeConsultationState>;
  private sharedConversationState: SharedConversationState = createEmptyConversationState();
  private expandedHeaderCard: HeaderCardId = null;
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
    this.documentRepository = new UnlockableDocumentRepository(documentRepository);
    this.datasetRepository = new UnlockableDatasetRepository(datasetRepository);
    this.documentController = new DocumentWorkspaceController(this.documentRepository);
    this.dataController = new DataWorkspaceController(this.datasetRepository);
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
    this.rootElement.addEventListener("input", (event) => this.handleInput(event));
    this.rootElement.addEventListener("click", (event) => this.handleClick(event));
    this.rootElement.addEventListener("mouseout", (event) => this.handleHeaderMouseOut(event));
    this.rootElement.addEventListener("submit", (event) => this.handleSubmit(event));
  }

  private handleInput(event: Event): void {
    const target = event.target;
    if (target instanceof HTMLInputElement && target.name === "document-query") {
      this.query = target.value;
      this.render();
      return;
    }
    if (target instanceof HTMLTextAreaElement && target.name === "document-body") {
      this.editorState = {
        ...(this.editorState ?? { isEditing: true, lastSavedBody: null, saveMessage: null }),
        draftBody: target.value
      };
      return;
    }
    if (target instanceof HTMLTextAreaElement && target.name === "consultation-focus") {
      this.documentConsultationState = this.documentController.updateConsultationFocus(
        this.query,
        target.value,
        this.selectedDocumentId,
        this.editorState,
        this.documentConsultationState
      ).consultation;
      return;
    }
    if (target instanceof HTMLTextAreaElement && target.name === "data-consultation-focus") {
      this.dataConsultationState = this.dataController.updateConsultationFocus(
        target.value,
        this.dataConsultationState
      ).consultation;
      return;
    }
    if (target instanceof HTMLTextAreaElement && target.name === "code-consultation-focus") {
      this.codeConsultationState = this.codeController.updateConsultationFocus(
        target.value,
        this.codeConsultationState
      ).consultation;
    }
  }

  private handleClick(event: Event): void {
    const target = event.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    if (target.closest("[data-role='refresh-dashboard']")) {
      void this.handleRefresh();
      return;
    }
    const headerToggle = target.closest<HTMLElement>("[data-role='header-card-toggle']");
    if (headerToggle?.dataset.card) {
      const cardId = headerToggle.dataset.card as Exclude<HeaderCardId, null>;
      this.expandedHeaderCard = this.expandedHeaderCard === cardId ? null : cardId;
      this.render();
      return;
    }
    const tab = target.closest<HTMLElement>("[data-role='workspace-tab']");
    if (tab?.dataset.workspaceId) {
      this.workspaceId = tab.dataset.workspaceId as WorkspaceId;
      this.render();
      return;
    }
    if (target.closest("[data-role='unlock-document-editing']")) {
      this.documentRepository.unlockLocalDraft();
      this.workspaceId = "document";
      this.render();
      return;
    }
    if (target.closest("[data-role='unlock-data-editing']")) {
      this.datasetRepository.unlockLocalDraft();
      this.workspaceId = "data";
      this.render();
      return;
    }
    if (target.closest("[data-role='open-consultation-composer']")) {
      const state = this.documentController.openConsultationComposer(
        this.query,
        this.selectedDocumentId,
        this.editorState,
        this.documentConsultationState
      );
      this.selectedDocumentId = state.selectedDocument?.id;
      this.documentConsultationState = state.consultation;
      this.render();
      return;
    }
    if (target.closest("[data-role='consultation-save']")) {
      const state = this.documentController.consultDocuments(
        this.query,
        this.selectedDocumentId,
        this.editorState,
        this.documentConsultationState
      );
      this.selectedDocumentId = state.selectedDocument?.id;
      this.editorState = state.editor;
      this.documentConsultationState = state.consultation;
      this.sharedConversationState = appendConversationEntry(this.sharedConversationState, {
        workspaceId: "document",
        prompt: state.consultation.focusPrompt,
        bundle: state.selectedBundle.map((document) => ({
          id: document.id,
          kind: "document",
          label: document.title,
          path: document.path
        })),
        summary: state.consultation.lastResponse?.summary ?? "",
        evidence: state.consultation.lastResponse?.evidence ?? [],
        nextAction: state.consultation.lastResponse?.nextAction ?? "",
        approvalState: "consultation-only"
      });
      this.render();
      return;
    }
    if (target.closest("[data-role='consultation-cancel']")) {
      const state = this.documentController.closeConsultationComposer(
        this.query,
        this.selectedDocumentId,
        this.editorState,
        this.documentConsultationState
      );
      this.selectedDocumentId = state.selectedDocument?.id;
      this.documentConsultationState = state.consultation;
      this.render();
      return;
    }
    const editButton = target.closest<HTMLElement>("[data-role='edit-document']");
    if (editButton?.dataset.documentId) {
      const state = this.documentController.startEditing(
        this.query,
        editButton.dataset.documentId,
        this.documentConsultationState
      );
      this.selectedDocumentId = state.selectedDocument?.id;
      this.editorState = state.editor;
      this.documentConsultationState = state.consultation;
      this.render();
      return;
    }
    const cancelButton = target.closest<HTMLElement>("[data-role='cancel-document']");
    if (cancelButton?.dataset.documentId) {
      const state = this.documentController.cancelEditing(
        this.query,
        cancelButton.dataset.documentId,
        this.documentConsultationState
      );
      this.selectedDocumentId = state.selectedDocument?.id;
      this.editorState = state.editor;
      this.documentConsultationState = state.consultation;
      this.render();
      return;
    }
    const documentItem = target.closest<HTMLElement>("[data-role='document-item']");
    if (documentItem?.dataset.documentId) {
      const state = this.documentController.createState(
        this.query,
        documentItem.dataset.documentId,
        this.editorState,
        this.documentConsultationState
      );
      this.selectedDocumentId = state.selectedDocument?.id;
      this.editorState = state.editor;
      this.documentConsultationState = state.consultation;
      this.render();
      return;
    }
    const toggleBundleButton = target.closest<HTMLElement>("[data-role='toggle-document-bundle']");
    if (toggleBundleButton?.dataset.documentId) {
      const state = this.documentController.toggleBundleSelection(
        this.query,
        toggleBundleButton.dataset.documentId,
        this.selectedDocumentId,
        this.editorState,
        this.documentConsultationState
      );
      this.selectedDocumentId = state.selectedDocument?.id;
      this.editorState = state.editor;
      this.documentConsultationState = state.consultation;
      this.render();
      return;
    }
    const toggleDatasetButton = target.closest<HTMLElement>("[data-role='toggle-dataset-bundle']");
    if (toggleDatasetButton?.dataset.datasetId) {
      this.dataConsultationState = this.dataController.toggleDatasetSelection(
        toggleDatasetButton.dataset.datasetId,
        {
          ...this.dataConsultationState,
          selectedDatasetId: this.selectedDatasetId
        }
      ).consultation;
      this.workspaceId = "data";
      this.render();
      return;
    }
    const datasetItem = target.closest<HTMLElement>("[data-role='dataset-item']");
    if (datasetItem?.dataset.datasetId) {
      const state = this.dataController.selectDataset(datasetItem.dataset.datasetId, this.dataConsultationState);
      this.selectedDatasetId = state.selectedDataset?.id;
      this.dataConsultationState = state.consultation;
      this.workspaceId = "data";
      this.render();
      return;
    }
    const toggleCodeButton = target.closest<HTMLElement>("[data-role='toggle-code-bundle']");
    if (toggleCodeButton?.dataset.targetId) {
      this.codeConsultationState = this.codeController.toggleTargetSelection(
        toggleCodeButton.dataset.targetId,
        this.codeConsultationState
      ).consultation;
      this.workspaceId = "code";
      this.render();
      return;
    }
    const datasetButton = target.closest<HTMLElement>("[data-role='save-dataset']");
    if (datasetButton?.dataset.datasetId) {
      const row = datasetButton.closest("tr");
      const statusInput = row?.querySelector<HTMLSelectElement>(
        `[data-role='dataset-status'][data-dataset-id='${datasetButton.dataset.datasetId}']`
      );
      const countInput = row?.querySelector<HTMLInputElement>(
        `[data-role='dataset-record-count'][data-dataset-id='${datasetButton.dataset.datasetId}']`
      );
      if (statusInput && countInput) {
        this.dataController.updateDataset(
          datasetButton.dataset.datasetId,
          statusInput.value,
          Number(countInput.value)
        );
        this.workspaceId = "data";
        this.render();
      }
      return;
    }
    const actionButton = target.closest<HTMLElement>("[data-role='proposal-action']");
    if (actionButton?.dataset.action) {
      this.sharedConversationState = applyProposalAction(
        this.sharedConversationState,
        actionButton.dataset.action as ProposalAction
      );
      this.render();
      return;
    }
    if (target.closest("[data-role='apply-approve']")) {
      this.handleApproveApply();
      return;
    }
    if (target.closest("[data-role='apply-cancel']")) {
      this.sharedConversationState = updateApplyState(this.sharedConversationState, "cancelled", "cancelled");
      this.render();
      return;
    }
    if (this.workspaceId === "document" && this.editorState?.isEditing && !target.closest("[data-role='draft-action-box']")) {
      const state = this.documentController.cancelEditing(
        this.query,
        this.selectedDocumentId ?? "",
        this.documentConsultationState
      );
      this.selectedDocumentId = state.selectedDocument?.id;
      this.editorState = state.editor;
      this.documentConsultationState = state.consultation;
      this.render();
    }
  }

  private handleHeaderMouseOut(event: Event): void {
    const mouseEvent = event as MouseEvent;
    const target = mouseEvent.target;
    if (!(target instanceof HTMLElement)) {
      return;
    }
    const card = target.closest<HTMLElement>("[data-role='header-card']");
    if (!card?.dataset.card) {
      return;
    }
    if (mouseEvent.relatedTarget instanceof Node && card.contains(mouseEvent.relatedTarget)) {
      return;
    }
    if (this.expandedHeaderCard === card.dataset.card) {
      this.expandedHeaderCard = null;
      this.render();
    }
  }

  private handleSubmit(event: Event): void {
    const form = event.target;
    if (!(form instanceof HTMLFormElement)) {
      return;
    }
    if (form.dataset.role === "document-consultation-form") {
      event.preventDefault();
      const state = this.documentController.consultDocuments(
        this.query,
        this.selectedDocumentId,
        this.editorState,
        this.documentConsultationState
      );
      this.selectedDocumentId = state.selectedDocument?.id;
      this.editorState = state.editor;
      this.documentConsultationState = state.consultation;
      this.sharedConversationState = appendConversationEntry(this.sharedConversationState, {
        workspaceId: "document",
        prompt: state.consultation.focusPrompt,
        bundle: state.selectedBundle.map((document) => ({
          id: document.id,
          kind: "document",
          label: document.title,
          path: document.path
        })),
        summary: state.consultation.lastResponse?.summary ?? "",
        evidence: state.consultation.lastResponse?.evidence ?? [],
        nextAction: state.consultation.lastResponse?.nextAction ?? "",
        approvalState: "consultation-only"
      });
      this.render();
      return;
    }
    if (form.dataset.role === "data-consultation-form") {
      event.preventDefault();
      const state = this.dataController.consultDatasets({
        ...this.dataConsultationState,
        selectedDatasetId: this.selectedDatasetId
      });
      this.dataConsultationState = state.consultation;
      this.selectedDatasetId = state.selectedDataset?.id;
      this.sharedConversationState = appendConversationEntry(this.sharedConversationState, {
        workspaceId: "data",
        prompt: state.consultation.focusPrompt,
        bundle: this.createDataBundle(state.selectedDatasets),
        summary: state.consultation.lastResponse?.summary ?? "",
        evidence: state.consultation.lastResponse?.evidence ?? [],
        nextAction: state.consultation.lastResponse?.nextAction ?? "",
        approvalState: "consultation-only"
      });
      this.workspaceId = "data";
      this.render();
      return;
    }
    if (form.dataset.role === "code-consultation-form") {
      event.preventDefault();
      const state = this.codeController.consultTargets(this.codeConsultationState);
      this.codeConsultationState = state.consultation;
      this.sharedConversationState = appendConversationEntry(this.sharedConversationState, {
        workspaceId: "code",
        prompt: state.consultation.focusPrompt,
        bundle: this.createCodeBundle(state.selectedTargets),
        summary: state.consultation.lastResponse?.summary ?? "",
        evidence: state.consultation.lastResponse?.evidence ?? [],
        nextAction: state.consultation.lastResponse?.nextAction ?? "",
        approvalState: "phase-gated-read-only"
      });
      this.workspaceId = "code";
      this.render();
      return;
    }
    if (!form.classList.contains("document-edit-form") || !this.selectedDocumentId) {
      return;
    }
    event.preventDefault();
    const draftBody = form.querySelector<HTMLTextAreaElement>("[data-role='document-editor']")?.value ?? "";
    const state = this.documentController.saveDocument(
      this.query,
      this.selectedDocumentId,
      draftBody,
      this.documentConsultationState
    );
    this.selectedDocumentId = state.selectedDocument?.id;
    this.editorState = state.editor;
    this.documentConsultationState = state.consultation;
    this.render();
  }

  private async handleRefresh(): Promise<void> {
    if (!this.refreshDashboard) {
      this.appendEvidence("unchanged", "Refresh is unavailable in seed mode.");
      this.render();
      return;
    }
    try {
      const nextBootstrap = await this.refreshDashboard();
      const outcome: RefreshOutcome =
        this.statusState.sourceSignature === nextBootstrap.sourceSignature ? "unchanged" : "changed";
      this.statusState.loadedAt = nextBootstrap.loadedAt;
      this.statusState.sourceSignature = nextBootstrap.sourceSignature;
      this.statusState.lastRefreshOutcome = outcome;
      this.appendEvidence(
        outcome,
        outcome === "changed"
          ? "Source signature changed and the dashboard was refreshed."
          : "Refresh completed without source changes."
      );
    } catch (error) {
      this.statusState.lastRefreshOutcome = "failed";
      this.appendEvidence("failed", error instanceof Error ? error.message : "Refresh failed.");
    }
    this.render();
  }

  private render(): void {
    const session = this.createConsultationSession();
    const staleStatus = this.isStale() ? "stale" : "fresh";
    const refreshLabel = this.getRefreshLabel(staleStatus);
    const evidenceMarkup = this.statusState.evidence
      .slice(0, 3)
      .map((item) => `<li><strong>${item.outcome}</strong> ${item.timestamp} ${item.message}</li>`)
      .join("");

    this.rootElement.innerHTML = `
      <div class="shell-nav">
        ${this.renderTab("document", "文書")}
        ${this.renderTab("data", "データ")}
        ${this.renderTab("code", "コード")}
        <button class="tab-button" data-role="refresh-dashboard" type="button">更新を確認</button>
      </div>
      <section class="header-deck" data-role="header-deck">
        ${this.renderHeaderCard("status", "Refresh", "Status", "freshness, loaded time, and evidence", `
          <section class="status-strip">
            <span class="status-badge status-${staleStatus}" data-role="stale-indicator">${refreshLabel}</span>
            <span data-role="loaded-at">loaded: ${this.escapeHtml(this.statusState.loadedAt)}</span>
          </section>
          <section class="status-log">
            <p class="eyebrow">Refresh Evidence</p>
            <ul data-role="refresh-evidence">${evidenceMarkup || "<li>No evidence yet.</li>"}</ul>
          </section>
        `)}
        ${this.renderHeaderCard("contract", "Consultation Contract", "Contract", `${this.escapeHtml(session.approvalState)} / ${this.escapeHtml(session.bundleSourcePolicy)}`, `
          <div data-role="consultation-contract">
            <p data-role="consultation-approval-state">approval state: ${this.escapeHtml(session.approvalState)}</p>
            <ul data-role="consultation-response-fields">${session.responseFields.map((field) => `<li><strong>${field.label}</strong> ${field.description}</li>`).join("")}</ul>
          </div>
        `)}
        ${this.renderHeaderCard("shell", "Shared", "Conversation", `${this.sharedConversationState.currentBundle.length} selected / ${this.sharedConversationState.history.length} history`, `
          <div data-role="shared-conversation-shell">
            <p data-role="shared-current-prompt">prompt: ${this.escapeHtml(this.sharedConversationState.currentPrompt || "No prompt yet")}</p>
            <p data-role="shared-current-summary">summary: ${this.escapeHtml(this.sharedConversationState.currentSummary ?? "No summary yet")}</p>
            <p data-role="shared-current-approval">approval: ${this.escapeHtml(this.sharedConversationState.currentApprovalState ?? "none")}</p>
            <ul data-role="shared-history">${this.sharedConversationState.history.map((entry) => `<li data-role="shared-history-item"><strong>${entry.workspaceId}</strong><span>${entry.summary}</span><span>${entry.approvalState}</span></li>`).join("") || "<li>No history yet.</li>"}</ul>
            ${this.sharedConversationState.currentSummary ? `
              <div class="editor-actions">
                <button class="document-item" data-role="proposal-action" data-action="keep" type="button">Keep</button>
                <button class="document-item" data-role="proposal-action" data-action="discard" type="button">Discard</button>
                <button class="document-item" data-role="proposal-action" data-action="task" type="button">Task化</button>
                <button class="document-item is-selected" data-role="proposal-action" data-action="apply-request" type="button">Apply Request</button>
              </div>` : ""}
            ${this.sharedConversationState.applyState === "preview" ? `
              <div class="editor-actions" data-role="apply-preview">
                <p>preview: ${this.escapeHtml(this.sharedConversationState.currentSummary ?? "")}</p>
                <button class="document-item is-selected" data-role="apply-approve" type="button">Approve</button>
                <button class="document-item" data-role="apply-cancel" type="button">Cancel</button>
              </div>` : ""}
            ${this.sharedConversationState.applyState === "approved" ? `<p data-role="apply-approved">apply approved</p>` : ""}
            ${this.sharedConversationState.applyState === "cancelled" ? `<p data-role="apply-cancelled">apply cancelled</p>` : ""}
          </div>
        `)}
      </section>
      ${this.errorMessage ? `<p class="error-banner" data-role="error-banner">${this.escapeHtml(this.errorMessage)}</p>` : ""}
      <div data-role="workspace-content"></div>
    `;

    const content = this.rootElement.querySelector<HTMLElement>("[data-role='workspace-content']");
    if (!content) {
      throw new Error("Workspace content host was not found.");
    }
    if (this.workspaceId === "document") {
      const state = this.documentController.createState(
        this.query,
        this.selectedDocumentId,
        this.editorState,
        this.documentConsultationState
      );
      this.selectedDocumentId = state.selectedDocument?.id;
      this.editorState = state.editor;
      this.documentConsultationState = state.consultation;
      new DocumentWorkspaceView(content).render(state);
      return;
    }
    if (this.workspaceId === "data") {
      const state = this.dataController.createState({
        ...this.dataConsultationState,
        selectedDatasetId: this.selectedDatasetId
      });
      this.dataConsultationState = state.consultation;
      this.selectedDatasetId = state.selectedDataset?.id;
      new DataWorkspaceView(content).render(state);
      return;
    }
    const state = this.codeController.createState(this.codeConsultationState);
    this.codeConsultationState = state.consultation;
    new CodeWorkspaceView(content).render(state);
  }

  private renderTab(workspaceId: WorkspaceId, label: string): string {
    return `<button class="tab-button ${this.workspaceId === workspaceId ? "is-selected" : ""}" data-role="workspace-tab" data-workspace-id="${workspaceId}" type="button">${label}</button>`;
  }

  private renderHeaderCard(
    cardId: Exclude<HeaderCardId, null>,
    eyebrow: string,
    title: string,
    summary: string,
    detailMarkup: string
  ): string {
    const expanded = this.expandedHeaderCard === cardId;
    return `
      <section class="header-card" data-role="header-card" data-card="${cardId}" data-expanded="${expanded ? "true" : "false"}">
        <button class="header-card-toggle" data-role="header-card-toggle" data-card="${cardId}" type="button" aria-expanded="${expanded ? "true" : "false"}">
          <span class="eyebrow">${this.escapeHtml(eyebrow)}</span>
          <span class="header-card-title">${this.escapeHtml(title)}</span>
          <span class="header-card-copy">${summary}</span>
        </button>
        <div class="header-card-detail">${detailMarkup}</div>
      </section>
    `;
  }

  private createConsultationSession(): ConsultationSessionState {
    if (this.workspaceId === "document") {
      const state = this.documentController.createState(
        this.query,
        this.selectedDocumentId,
        this.editorState,
        this.documentConsultationState
      );
      return createConsultationSession({
        workspaceId: "document",
        sourcePolicy: state.sourcePolicy,
        bundle: state.selectedBundle.map((document) => ({
          id: document.id,
          kind: "document",
          label: document.title,
          path: document.path
        }))
      });
    }
    if (this.workspaceId === "data") {
      const state = this.dataController.createState(this.dataConsultationState);
      return createConsultationSession({
        workspaceId: "data",
        sourcePolicy: state.sourcePolicy,
        bundle: this.createDataBundle(state.selectedDatasets)
      });
    }
    const state = this.codeController.createState(this.codeConsultationState);
    return createConsultationSession({
      workspaceId: "code",
      sourcePolicy: state.sourcePolicy,
      bundle: this.createCodeBundle(state.selectedTargets)
    });
  }

  private createDataBundle(
    datasets: Array<{ id: string; name: string; category: string }>
  ): ConsultationBundleItem[] {
    return datasets.map((dataset) => ({
      id: dataset.id,
      kind: "dataset",
      label: dataset.id,
      path: `${dataset.category}/${dataset.name}`
    }));
  }

  private createCodeBundle(
    targets: Array<{ id: string; title: string; path: string }>
  ): ConsultationBundleItem[] {
    return targets.map((target) => ({
      id: target.id,
      kind: "code",
      label: target.title,
      path: target.path
    }));
  }

  private handleApproveApply(): void {
    const latest = this.sharedConversationState.history[0];
    if (!latest) {
      return;
    }
    if (latest.workspaceId === "code") {
      this.sharedConversationState = updateApplyState(this.sharedConversationState, "cancelled", "phase-gated-read-only");
      this.errorMessage = "Code consultation remains phase-gated read-only.";
      this.render();
      return;
    }
    if (latest.workspaceId === "document") {
      const state = this.documentController.createState(
        this.query,
        latest.bundle[0]?.id,
        this.editorState,
        this.documentConsultationState
      );
      if (state.isReadOnly || !state.selectedDocument) {
        this.sharedConversationState = updateApplyState(this.sharedConversationState, "cancelled", "consultation-only");
        this.errorMessage = "Only unlocked local draft documents can be applied.";
        this.render();
        return;
      }
      const applied = this.documentController.saveDocument(
        this.query,
        state.selectedDocument.id,
        `${state.selectedDocument.body}\n\n[Applied Consultation]\n${latest.summary}`,
        this.documentConsultationState
      );
      this.selectedDocumentId = applied.selectedDocument?.id;
      this.editorState = applied.editor;
      this.documentConsultationState = applied.consultation;
      this.sharedConversationState = updateApplyState(this.sharedConversationState, "approved", "approved");
      this.render();
      return;
    }
    const state = this.dataController.createState(this.dataConsultationState);
    this.selectedDatasetId = state.selectedDataset?.id;
    const primary = state.selectedDatasets[0];
    if (state.isReadOnly || !primary) {
      this.sharedConversationState = updateApplyState(this.sharedConversationState, "cancelled", "consultation-only");
      this.errorMessage = "Only unlocked local draft datasets can be applied.";
      this.render();
      return;
    }
    this.dataConsultationState = this.dataController.updateDataset(primary.id, "review", primary.recordCount).consultation;
    this.sharedConversationState = updateApplyState(this.sharedConversationState, "approved", "approved");
    this.render();
  }

  private isStale(): boolean {
    const loadedAt = new Date(this.statusState.loadedAt).getTime();
    return Number.isFinite(loadedAt) && Date.now() - loadedAt > this.statusState.staleAfterMs;
  }

  private getRefreshLabel(staleStatus: "fresh" | "stale"): string {
    if (staleStatus === "stale") {
      return "stale";
    }
    return this.statusState.lastRefreshOutcome === "changed" ? "refreshed" : "fresh";
  }

  private appendEvidence(outcome: RefreshOutcome, message: string): void {
    this.statusState.evidence = [
      { timestamp: new Date().toISOString(), outcome, message },
      ...this.statusState.evidence
    ].slice(0, 5);
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
      // ignore storage failures
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
