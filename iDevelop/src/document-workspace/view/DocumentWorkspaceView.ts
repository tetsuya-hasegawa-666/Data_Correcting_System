import type {
  DocumentDirectoryGroup,
  DocumentWorkspaceState
} from "../controller/DocumentWorkspaceController";
import type { DocumentRecord } from "../model/DocumentRecord";

export class DocumentWorkspaceView {
  public constructor(private readonly rootElement: HTMLElement) {}

  public render(state: DocumentWorkspaceState): void {
    const selectedDocumentMarkup = state.selectedDocument
      ? this.renderSelectedDocument(state.selectedDocument, state)
      : "<p>表示できる文書がありません。</p>";
    const resultMarkup = state.directoryGroups
      .map((group) => this.renderDirectoryGroup(group, state))
      .join("");

    this.rootElement.innerHTML = `
      <div class="dashboard-shell document-dashboard-shell">
        <section class="workspace-panel document-list-panel">
          <div class="workspace-header">
            <div>
              <p class="eyebrow">文書</p>
              <h1>文書一覧と検索</h1>
            </div>
          </div>
          <p>ディレクトリ単位で文書をまとめて表示します。検索はタイトル、パス、本文、タグを対象にします。</p>
          <p class="result-count">読み込みポリシー: ${this.escapeHtml(state.sourcePolicy)}</p>
          ${
            state.isReadOnly
              ? '<p class="result-count">現在の接続は読み取り専用です。編集や保存はできません。</p>'
              : '<p class="result-count">現在の接続は編集可能です。保存とキャンセルを使えます。</p>'
          }
          <input
            class="search-input"
            data-role="search-input"
            type="search"
            name="document-query"
            value="${this.escapeAttribute(state.query)}"
            placeholder="タイトル、パス、本文、タグで検索"
          />
          <div class="result-meta">
            <p class="result-count" data-role="result-count">文書 ${state.documents.length} 件</p>
            <p class="result-count" data-role="directory-group-count">ディレクトリ ${state.directoryGroups.length} 件</p>
          </div>
          <div class="document-list">${resultMarkup}</div>
        </section>
        <section class="preview-panel document-preview-panel">${selectedDocumentMarkup}</section>
      </div>
    `;
  }

  private renderDirectoryGroup(
    group: DocumentDirectoryGroup,
    state: DocumentWorkspaceState
  ): string {
    const itemMarkup = group.documents
      .map((document) =>
        this.renderDocumentItem(
          document,
          document.id === state.selectedDocument?.id,
          state.selectedBundle.some((selected) => selected.id === document.id)
        )
      )
      .join("");
    const modeClass = state.isReadOnly ? "mode-read-only" : "mode-editable";
    const modeLabel = state.isReadOnly ? "読み取り専用" : "編集可能";

    return `
      <section class="directory-group" data-role="directory-group">
        <div class="directory-group-header">
          <p class="eyebrow">ディレクトリ</p>
          <h3 data-role="directory-group-title">${this.escapeHtml(group.directoryPath)}</h3>
          <p class="result-count">${group.documents.length} 件</p>
        </div>
        <div class="directory-group-status ${modeClass}" data-role="directory-group-status">
          <span class="directory-group-status-label" data-role="directory-group-status-label">${modeLabel}</span>
        </div>
        <div class="directory-group-items">${itemMarkup}</div>
      </section>
    `;
  }

  private renderDocumentItem(
    document: DocumentRecord,
    isSelected: boolean,
    isInBundle: boolean
  ): string {
    const fileName = this.resolveFileName(document.path);

    return `
      <button
        class="document-item ${isSelected ? "is-selected" : ""}"
        data-role="document-item"
        data-document-id="${this.escapeAttribute(document.id)}"
        type="button"
      >
        <p class="eyebrow">${this.escapeHtml(document.tags.join(" / "))}</p>
        <h4>${this.escapeHtml(document.title)}</h4>
        <p>${this.escapeHtml(fileName)}</p>
      </button>
      <button
        class="document-item ${isInBundle ? "is-selected" : ""}"
        data-role="toggle-document-bundle"
        data-document-id="${this.escapeAttribute(document.id)}"
        type="button"
      >
        ${isInBundle ? "相談対象から外す" : "相談対象に追加"}
      </button>
    `;
  }

  private renderSelectedDocument(document: DocumentRecord, state: DocumentWorkspaceState): string {
    const tagMarkup = document.tags
      .map((tag) => `<span class="tag">${this.escapeHtml(tag)}</span>`)
      .join("");

    const editorMarkup = state.isReadOnly
      ? '<p class="result-count">読み取り専用のため、この画面では編集できません。</p>'
      : state.editor.isEditing
        ? `
          <form data-role="document-edit-form">
            <textarea class="document-editor" data-role="document-editor" name="document-body">${this.escapeHtml(state.editor.draftBody)}</textarea>
            <div class="editor-actions">
              <button class="document-item is-selected" data-role="save-document" data-document-id="${this.escapeAttribute(document.id)}" type="submit">保存</button>
              <button class="document-item" data-role="cancel-document" data-document-id="${this.escapeAttribute(document.id)}" type="button">キャンセル</button>
            </div>
          </form>
        `
        : `
          <button class="document-item" data-role="edit-document" data-document-id="${this.escapeAttribute(document.id)}" type="button">編集</button>
        `;

    return `
      <p class="eyebrow">プレビュー</p>
      <h2 data-role="document-title">${this.escapeHtml(document.title)}</h2>
      <p class="document-path">${this.escapeHtml(document.path)}</p>
      <div class="tag-row">${tagMarkup}</div>
      <section class="directory-group">
        <p class="eyebrow">Consultation Bundle</p>
        <p data-role="document-bundle-count">選択 ${state.selectedBundle.length} 件</p>
        <ul data-role="document-bundle-list">
          ${state.selectedBundle
            .map(
              (selected) =>
                `<li>${this.escapeHtml(selected.title)} <span>${this.escapeHtml(selected.path)}</span></li>`
            )
            .join("")}
        </ul>
        <form data-role="document-consultation-form">
          <textarea
            class="document-editor"
            data-role="consultation-focus-input"
            name="consultation-focus"
            placeholder="相談したい焦点を入力"
          >${this.escapeHtml(state.consultation.focusPrompt)}</textarea>
          <button class="document-item is-selected" data-role="run-document-consultation" type="submit">相談する</button>
        </form>
        ${
          state.consultation.lastResponse
            ? `
              <div class="document-body" data-role="document-consultation-response">
                <p><strong>Summary</strong> ${this.escapeHtml(state.consultation.lastResponse.summary)}</p>
                <ul>
                  ${state.consultation.lastResponse.evidence
                    .map((evidence) => `<li>${this.escapeHtml(evidence)}</li>`)
                    .join("")}
                </ul>
                <p><strong>Next Action</strong> ${this.escapeHtml(state.consultation.lastResponse.nextAction)}</p>
              </div>
            `
            : ""
        }
      </section>
      ${state.editor.saveMessage ? `<p class="result-count" data-role="save-message">${this.escapeHtml(state.editor.saveMessage)}</p>` : ""}
      ${editorMarkup}
      <pre class="document-body" data-role="document-body">${this.escapeHtml(document.body)}</pre>
    `;
  }

  private escapeHtml(value: string): string {
    return value
      .replaceAll("&", "&amp;")
      .replaceAll("<", "&lt;")
      .replaceAll(">", "&gt;")
      .replaceAll('"', "&quot;")
      .replaceAll("'", "&#39;");
  }

  private escapeAttribute(value: string): string {
    return this.escapeHtml(value);
  }

  private resolveFileName(path: string): string {
    const segments = path.split("/");
    return segments[segments.length - 1] ?? path;
  }
}
