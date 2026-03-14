import { CodeWorkspaceController } from "../../code-workspace/controller/CodeWorkspaceController";
import type { CodeConsultationState } from "../../code-workspace/controller/CodeWorkspaceController";
import type { CodeTargetRepository } from "../../code-workspace/model/CodeTargetRepository";
import { CodeWorkspaceView } from "../../code-workspace/view/CodeWorkspaceView";
import { DataWorkspaceController } from "../../data-workspace/controller/DataWorkspaceController";
import type { DatasetRepository } from "../../data-workspace/model/DatasetRepository";
import { DataWorkspaceView } from "../../data-workspace/view/DataWorkspaceView";
import type { DataConsultationState } from "../../data-workspace/controller/DataWorkspaceController";
import type {
  DocumentConsultationState,
  DocumentEditorState
} from "../../document-workspace/controller/DocumentWorkspaceController";
import { DocumentWorkspaceController } from "../../document-workspace/controller/DocumentWorkspaceController";
import type { DocumentRepository } from "../../document-workspace/model/DocumentRepository";
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
  private documentConsultationState?: Partial<DocumentConsultationState>;
  private dataConsultationState?: Partial<DataConsultationState>;
  private codeConsultationState?: Partial<CodeConsultationState>;
  private sharedConversationState: SharedConversationState = createEmptyConversationState();
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
        return;
      }

      if (target instanceof HTMLTextAreaElement && target.name === "consultation-focus") {
        const state = this.documentController.updateConsultationFocus(
          this.query,
          target.value,
          this.selectedDocumentId,
          this.editorState,
          this.documentConsultationState
        );
        this.documentConsultationState = state.consultation;
        return;
      }

      if (target instanceof HTMLTextAreaElement && target.name === "data-consultation-focus") {
        const state = this.dataController.updateConsultationFocus(
          target.value,
          this.dataConsultationState
        );
        this.dataConsultationState = state.consultation;
        return;
      }

      if (target instanceof HTMLTextAreaElement && target.name === "code-consultation-focus") {
        const state = this.codeController.updateConsultationFocus(
          target.value,
          this.codeConsultationState
        );
        this.codeConsultationState = state.consultation;
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
        const state = this.documentController.startEditing(
          this.query,
          editButton.dataset.documentId,
          this.documentConsultationState
        );
        this.selectedDocumentId = state.selectedDocument?.id;
        this.editorState = state.editor;
        this.documentConsultationState = state.consultation;
        this.errorMessage = null;
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
          this.editorState,
          this.documentConsultationState
        );
        this.selectedDocumentId = state.selectedDocument?.id;
        this.editorState = state.editor;
        this.documentConsultationState = state.consultation;
        this.errorMessage = null;
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
        this.errorMessage = null;
        this.render();
        return;
      }

      const toggleDatasetButton = target.closest<HTMLElement>("[data-role='toggle-dataset-bundle']");
      if (toggleDatasetButton?.dataset.datasetId) {
        const state = this.dataController.toggleDatasetSelection(
          toggleDatasetButton.dataset.datasetId,
          this.dataConsultationState
        );
        this.dataConsultationState = state.consultation;
        this.workspaceId = "data";
        this.errorMessage = null;
        this.render();
        return;
      }

      const toggleCodeButton = target.closest<HTMLElement>("[data-role='toggle-code-bundle']");
      if (toggleCodeButton?.dataset.targetId) {
        const state = this.codeController.toggleTargetSelection(
          toggleCodeButton.dataset.targetId,
          this.codeConsultationState
        );
        this.codeConsultationState = state.consultation;
        this.workspaceId = "code";
        this.errorMessage = null;
        this.render();
        return;
      }

      const actionButton = target.closest<HTMLElement>("[data-role='proposal-action']");
      if (actionButton?.dataset.action) {
        this.sharedConversationState = applyProposalAction(
          this.sharedConversationState,
          actionButton.dataset.action as ProposalAction
        );
        this.errorMessage = null;
        this.render();
        return;
      }

      if (target.closest("[data-role='apply-approve']")) {
        this.handleApproveApply();
        return;
      }

      if (target.closest("[data-role='apply-cancel']")) {
        this.sharedConversationState = updateApplyState(
          this.sharedConversationState,
          "cancelled",
          "cancelled"
        );
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
          const state = this.documentController.cancelEditing(
            this.query,
            documentId,
            this.documentConsultationState
          );
          this.selectedDocumentId = state.selectedDocument?.id;
          this.editorState = state.editor;
          this.documentConsultationState = state.consultation;
          this.errorMessage = null;
          this.render();
        }
      }
    });

    this.rootElement.addEventListener("submit", (event) => {
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
        this.errorMessage = null;
        this.render();
        return;
      }

      if (form.dataset.role === "data-consultation-form") {
        event.preventDefault();

        const state = this.dataController.consultDatasets(this.dataConsultationState);
        this.dataConsultationState = state.consultation;
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
        this.errorMessage = null;
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
        this.errorMessage = null;
        this.render();
        return;
      }

      if (form.dataset.role !== "document-edit-form") {
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
          draftBody,
          this.documentConsultationState
        );
        this.selectedDocumentId = state.selectedDocument?.id;
        this.editorState = state.editor;
        this.documentConsultationState = state.consultation;
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
    const consultationSession = this.createConsultationSession();
    const consultationBundleMarkup =
      consultationSession.bundle.length > 0
        ? consultationSession.bundle
            .map(
              (item) =>
                `<li><strong>${this.escapeHtml(item.kind)}</strong> ${this.escapeHtml(item.label)} <span>${this.escapeHtml(item.path)}</span></li>`
            )
            .join("")
        : "<li>まだ bundle は選択されていません。</li>";
    const responseFieldMarkup = consultationSession.responseFields
      .map(
        (field) =>
          `<li><strong>${this.escapeHtml(field.label)}</strong> ${this.escapeHtml(field.description)}</li>`
      )
      .join("");
    const sharedHistoryMarkup = this.sharedConversationState.history
      .map(
        (entry) => `
          <li data-role="shared-history-item">
            <strong>${this.escapeHtml(entry.workspaceId)}</strong>
            <span>${this.escapeHtml(entry.summary)}</span>
            <span>${this.escapeHtml(entry.approvalState)}</span>
            ${entry.proposalAction ? `<span>${this.escapeHtml(entry.proposalAction)}</span>` : ""}
          </li>
        `
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
      <section class="status-log consultation-contract" data-role="consultation-contract">
        <p class="eyebrow">Consultation Contract</p>
        <p><strong>${this.escapeHtml(consultationSession.storyId)}</strong> ${this.escapeHtml(consultationSession.storySummary)}</p>
        <p data-role="consultation-approval-state">approval state: ${this.escapeHtml(consultationSession.approvalState)}</p>
        <p>${this.escapeHtml(consultationSession.approvalGuidance)}</p>
        <div class="consultation-grid">
          <div>
            <p class="eyebrow">Input Bundle</p>
            <p>source policy: ${this.escapeHtml(consultationSession.bundleSourcePolicy)}</p>
            <ul data-role="consultation-bundle">${consultationBundleMarkup}</ul>
          </div>
          <div>
            <p class="eyebrow">Response Contract</p>
            <ul data-role="consultation-response-fields">${responseFieldMarkup}</ul>
          </div>
          <div>
            <p class="eyebrow">Touchpoints</p>
            <ul>${consultationSession.touchpoints
              .map((touchpoint) => `<li>${this.escapeHtml(touchpoint)}</li>`)
              .join("")}</ul>
          </div>
        </div>
      </section>
      <section class="status-log" data-role="shared-conversation-shell">
        <p class="eyebrow">Shared Conversation Shell</p>
        <p data-role="shared-current-prompt">prompt: ${this.escapeHtml(this.sharedConversationState.currentPrompt || "未入力")}</p>
        <p data-role="shared-current-summary">summary: ${this.escapeHtml(this.sharedConversationState.currentSummary ?? "まだありません")}</p>
        <p data-role="shared-current-approval">approval: ${this.escapeHtml(this.sharedConversationState.currentApprovalState ?? "none")}</p>
        <ul data-role="shared-current-bundle">
          ${
            this.sharedConversationState.currentBundle.length > 0
              ? this.sharedConversationState.currentBundle
                  .map(
                    (item) =>
                      `<li>${this.escapeHtml(item.kind)} ${this.escapeHtml(item.label)} <span>${this.escapeHtml(item.path)}</span></li>`
                  )
                  .join("")
              : "<li>まだ bundle はありません。</li>"
          }
        </ul>
        ${
          this.sharedConversationState.currentSummary
            ? `
              <div class="editor-actions">
                <button class="document-item" data-role="proposal-action" data-action="keep" type="button">Keep</button>
                <button class="document-item" data-role="proposal-action" data-action="discard" type="button">Discard</button>
                <button class="document-item" data-role="proposal-action" data-action="task" type="button">Task化</button>
                <button class="document-item is-selected" data-role="proposal-action" data-action="apply-request" type="button">Apply Request</button>
              </div>
            `
            : ""
        }
        ${
          this.sharedConversationState.applyState === "preview"
            ? `
              <div class="editor-actions" data-role="apply-preview">
                <p>preview: ${this.escapeHtml(this.sharedConversationState.currentSummary ?? "")}</p>
                <button class="document-item is-selected" data-role="apply-approve" type="button">Approve</button>
                <button class="document-item" data-role="apply-cancel" type="button">Cancel</button>
              </div>
            `
            : this.sharedConversationState.applyState === "approved"
              ? `<p data-role="apply-approved">apply approved</p>`
              : this.sharedConversationState.applyState === "cancelled"
                ? `<p data-role="apply-cancelled">apply cancelled</p>`
                : ""
        }
        <ul data-role="shared-history">${sharedHistoryMarkup || "<li>まだ history はありません。</li>"}</ul>
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
          this.editorState,
          this.documentConsultationState
        );
        this.selectedDocumentId = state.selectedDocument?.id;
        this.editorState = state.editor;
        this.documentConsultationState = state.consultation;
        new DocumentWorkspaceView(content).render(state);
        break;
      }
      case "data":
        {
          const state = this.dataController.createState(this.dataConsultationState);
          this.dataConsultationState = state.consultation;
          new DataWorkspaceView(content).render(state);
        }
        break;
      case "code":
        {
          const state = this.codeController.createState(this.codeConsultationState);
          this.codeConsultationState = state.consultation;
          new CodeWorkspaceView(content).render(state);
        }
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

  private createConsultationSession(): ConsultationSessionState {
    switch (this.workspaceId) {
      case "document": {
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
      case "data": {
        const state = this.dataController.createState(this.dataConsultationState);
        return createConsultationSession({
          workspaceId: "data",
          sourcePolicy: state.sourcePolicy,
          bundle: this.createDataBundle(state.selectedDatasets)
        });
      }
      case "code": {
        const state = this.codeController.createState(this.codeConsultationState);
        return createConsultationSession({
          workspaceId: "code",
          sourcePolicy: state.sourcePolicy,
          bundle: this.createCodeBundle(state.selectedTargets)
        });
      }
    }
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
      this.errorMessage = "code consultation は phase gate のため apply できません。";
      this.sharedConversationState = updateApplyState(
        this.sharedConversationState,
        "cancelled",
        "phase-gated-read-only"
      );
      this.render();
      return;
    }

    if (latest.workspaceId === "document") {
      const selectedDocumentId = latest.bundle[0]?.id;
      const state = this.documentController.createState(
        this.query,
        selectedDocumentId,
        this.editorState,
        this.documentConsultationState
      );

      if (state.isReadOnly || !state.selectedDocument) {
        this.errorMessage = "読み取り専用の document には apply できません。";
        this.sharedConversationState = updateApplyState(
          this.sharedConversationState,
          "cancelled",
          "consultation-only"
        );
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
      this.sharedConversationState = updateApplyState(
        this.sharedConversationState,
        "approved",
        "approved"
      );
      this.errorMessage = null;
      this.render();
      return;
    }

    if (latest.workspaceId === "data") {
      const state = this.dataController.createState(this.dataConsultationState);
      const primary = state.selectedDatasets[0];

      if (state.isReadOnly || !primary) {
        this.errorMessage = "読み取り専用の data には apply できません。";
        this.sharedConversationState = updateApplyState(
          this.sharedConversationState,
          "cancelled",
          "consultation-only"
        );
        this.render();
        return;
      }

      const applied = this.dataController.updateDataset(primary.id, "review", primary.recordCount);
      this.dataConsultationState = applied.consultation;
      this.sharedConversationState = updateApplyState(
        this.sharedConversationState,
        "approved",
        "approved"
      );
      this.errorMessage = null;
      this.render();
      return;
    }

    this.sharedConversationState = updateApplyState(
      this.sharedConversationState,
      "approved",
      "approved"
    );
    this.errorMessage = null;
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
