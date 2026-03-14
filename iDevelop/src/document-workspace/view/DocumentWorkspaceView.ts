import type { DocumentRecord } from "../model/DocumentRecord";
import type { DocumentWorkspaceState } from "../controller/DocumentWorkspaceController";

export class DocumentWorkspaceView {
  public constructor(private readonly rootElement: HTMLElement) {}

  public render(state: DocumentWorkspaceState): void {
    const selectedDocumentMarkup = state.selectedDocument
      ? this.renderSelectedDocument(state.selectedDocument, state)
      : "<p>No matching document.</p>";

    const resultMarkup = state.documents
      .map((document) => this.renderDocumentItem(document, document.id === state.selectedDocument?.id))
      .join("");

    this.rootElement.innerHTML = `
      <div class="dashboard-shell">
        <section class="workspace-panel">
          <p class="eyebrow">Document Workspace</p>
          <h1>Search project truth</h1>
          <p>Must scope kickoff slice: list, search, and preview docs without breaking MVC.</p>
          <p class="result-count">Source policy: ${this.escapeHtml(state.sourcePolicy)}</p>
          <input
            class="search-input"
            data-role="search-input"
            type="search"
            name="document-query"
            value="${this.escapeAttribute(state.query)}"
            placeholder="Search title, path, body, or tag"
          />
          <p class="result-count" data-role="result-count">${state.documents.length} result(s)</p>
          <div class="document-list">${resultMarkup}</div>
        </section>
        <section class="preview-panel">${selectedDocumentMarkup}</section>
      </div>
    `;
  }

  private renderDocumentItem(document: DocumentRecord, isSelected: boolean): string {
    return `
      <button
        class="document-item ${isSelected ? "is-selected" : ""}"
        data-role="document-item"
        data-document-id="${this.escapeAttribute(document.id)}"
        type="button"
      >
        <p class="eyebrow">${this.escapeHtml(document.tags.join(" / "))}</p>
        <h3>${this.escapeHtml(document.title)}</h3>
        <p>${this.escapeHtml(document.path)}</p>
      </button>
    `;
  }

  private renderSelectedDocument(document: DocumentRecord, state: DocumentWorkspaceState): string {
    const tagMarkup = document.tags
      .map((tag) => `<span class="tag">${this.escapeHtml(tag)}</span>`)
      .join("");

    const editorMarkup = state.editor.isEditing
      ? `
        <form data-role="document-edit-form">
          <textarea class="document-editor" data-role="document-editor" name="document-body">${this.escapeHtml(state.editor.draftBody)}</textarea>
          <div class="editor-actions">
            <button class="document-item is-selected" data-role="save-document" data-document-id="${this.escapeAttribute(document.id)}" type="submit">Save</button>
          </div>
        </form>
      `
      : `
        <button class="document-item" data-role="edit-document" data-document-id="${this.escapeAttribute(document.id)}" type="button">Edit</button>
      `;

    return `
      <p class="eyebrow">Preview</p>
      <h2 data-role="document-title">${this.escapeHtml(document.title)}</h2>
      <p class="document-path">${this.escapeHtml(document.path)}</p>
      <div class="tag-row">${tagMarkup}</div>
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
}
