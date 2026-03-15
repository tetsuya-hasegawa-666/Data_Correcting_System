import type { DocumentWorkspaceState } from "../controller/DocumentWorkspaceController";
import type { DocumentRecord } from "../model/DocumentRecord";

interface TreeNode {
  id: string;
  kind: "directory" | "file";
  label: string;
  path: string;
  depth: number;
  document?: DocumentRecord;
}

export class DocumentWorkspaceView {
  public constructor(private readonly rootElement: HTMLElement) {}

  public render(state: DocumentWorkspaceState): void {
    const selectedDocumentMarkup = state.selectedDocument
      ? this.renderSelectedDocument(state.selectedDocument, state)
      : "<p>No document is selected.</p>";
    const treeMarkup = this.buildTreeNodes(state.documents)
      .map((node) => this.renderTreeNode(node, state))
      .join("");

    this.rootElement.innerHTML = `
      <div class="dashboard-shell document-dashboard-shell" data-role="document-layout" data-layout="explorer-preview">
        <section class="workspace-panel document-explorer-panel" data-role="explorer-panel">
          <div class="workspace-header">
            <div>
              <p class="eyebrow">Document</p>
              <h1>検索と Explorer</h1>
            </div>
          </div>
          <p>文字列検索とディレクトリツリーで文書を探します。</p>
          <p class="result-count">読み込みポリシー: ${this.escapeHtml(state.sourcePolicy)}</p>
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
          <div class="document-tree-scroll">
            <div class="document-tree" data-role="explorer-tree">${treeMarkup}</div>
          </div>
        </section>
        <section class="preview-panel document-preview-panel">${selectedDocumentMarkup}</section>
      </div>
    `;
  }

  private renderSelectedDocument(document: DocumentRecord, state: DocumentWorkspaceState): string {
    const tagMarkup = document.tags
      .map((tag) => `<span class="tag">${this.escapeHtml(tag)}</span>`)
      .join("");
    const consultationResponseMarkup = state.consultation.lastResponse
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
      : "";
    const draftMarkup = state.isReadOnly
      ? `
        <div class="unlock-guidance" data-role="unlock-document-guidance">
          <p><strong>解除条件:</strong> Draft を開始すると、現在の read-only 文書を local draft に複製して編集可能にします。</p>
          <p><strong>反映範囲:</strong> Draft 中の変更は local draft にだけ保存されます。</p>
          <p><strong>元ソース:</strong> original source remains unchanged until safe apply.</p>
          <button class="document-item is-selected" data-role="unlock-document-editing" type="button">Draft を開始</button>
        </div>
      `
      : state.editor.isEditing
        ? `
          <form data-role="document-edit-form">
            <textarea class="document-editor" data-role="document-editor" name="document-body">${this.escapeHtml(state.editor.draftBody)}</textarea>
            <div class="editor-actions">
              <button class="document-item is-selected" data-role="save-document" data-document-id="${this.escapeAttribute(document.id)}" type="submit">Draft を保存</button>
              <button class="document-item" data-role="cancel-document" data-document-id="${this.escapeAttribute(document.id)}" type="button">キャンセル</button>
            </div>
          </form>
        `
        : `
          <div class="editor-actions">
            <button class="document-item" data-role="edit-document" data-document-id="${this.escapeAttribute(document.id)}" type="button">Draft を編集</button>
          </div>
        `;

    return `
      <p class="eyebrow">Preview</p>
      <h2 data-role="document-title">${this.escapeHtml(document.title)}</h2>
      <p class="document-path">${this.escapeHtml(document.path)}</p>
      <div class="tag-row">${tagMarkup}</div>
      <div class="preview-columns" data-role="preview-columns">
        <section class="directory-group preview-column" data-role="consultation-column">
          <div class="action-panel" data-role="consultation-panel">
            <p class="eyebrow">相談</p>
            <h3>内容を整理して次の行動を決める</h3>
            <p><strong>目的:</strong> 選択中の bundle を読んで、判断材料を整理します。</p>
            <p><strong>返る内容:</strong> Summary / Evidence / Next Action</p>
            <p><strong>変更範囲:</strong> 文書本文は変更しません。</p>
          </div>
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
          <div class="capability-note" data-role="consultation-capabilities">
            <p class="eyebrow">相談でできること</p>
            <ul>
              <li><strong>Summary</strong> bundle の要点整理</li>
              <li><strong>Evidence</strong> 参照した文書の列挙</li>
              <li><strong>Next Action</strong> 次に確認すべき行動の提案</li>
            </ul>
          </div>
          <form data-role="document-consultation-form">
            <textarea
              class="document-editor"
              data-role="consultation-focus-input"
              name="consultation-focus"
              placeholder="相談したい観点を入力"
            >${this.escapeHtml(state.consultation.focusPrompt)}</textarea>
            <button class="document-item is-selected" data-role="run-document-consultation" type="submit">相談する</button>
          </form>
          ${consultationResponseMarkup}
        </section>
        <section class="directory-group preview-column" data-role="draft-column">
          <div class="action-panel" data-role="draft-panel">
            <p class="eyebrow">Draft</p>
            <h3>編集案を作って保存する</h3>
            <p><strong>目的:</strong> local draft を作り、文書本文の編集案を試します。</p>
            <p><strong>反映内容:</strong> Draft の保存は local draft にだけ反映されます。</p>
            <p><strong>元ソース:</strong> original source remains unchanged until safe apply.</p>
          </div>
          ${state.editor.saveMessage ? `<p class="result-count" data-role="save-message">${this.escapeHtml(state.editor.saveMessage)}</p>` : ""}
          ${draftMarkup}
          <pre class="document-body" data-role="document-body">${this.escapeHtml(document.body)}</pre>
        </section>
      </div>
    `;
  }

  private renderTreeNode(node: TreeNode, state: DocumentWorkspaceState): string {
    const indent = node.depth * 18;

    if (node.kind === "directory") {
      return `
        <div
          class="tree-node tree-node-directory"
          data-role="tree-node"
          data-kind="directory"
          data-path="${this.escapeAttribute(node.path)}"
          style="padding-left: ${indent}px"
        >
          <span class="tree-glyph">▸</span>
          <span>${this.escapeHtml(node.label)}</span>
        </div>
      `;
    }

    const document = node.document!;
    const isSelected = document.id === state.selectedDocument?.id;
    const isInBundle = state.selectedBundle.some((selected) => selected.id === document.id);

    return `
      <div class="tree-node-row" style="padding-left: ${indent}px">
        <button
          class="tree-node tree-node-file ${isSelected ? "is-selected" : ""}"
          data-role="tree-node"
          data-kind="file"
          data-path="${this.escapeAttribute(node.path)}"
          data-document-id="${this.escapeAttribute(document.id)}"
          type="button"
        >
          <span class="tree-glyph">•</span>
          <span>${this.escapeHtml(document.title)}</span>
        </button>
        <button
          class="tree-toggle ${isInBundle ? "is-selected" : ""}"
          data-role="toggle-document-bundle"
          data-document-id="${this.escapeAttribute(document.id)}"
          type="button"
        >
          ${isInBundle ? "相談から外す" : "相談へ追加"}
        </button>
      </div>
    `;
  }

  private buildTreeNodes(documents: DocumentRecord[]): TreeNode[] {
    const nodes: TreeNode[] = [];
    const seenDirectories = new Set<string>();

    for (const document of documents) {
      const directoryParts = document.path.split("/").slice(0, -1);

      directoryParts.forEach((_, index) => {
        const path = directoryParts.slice(0, index + 1).join("/");
        if (seenDirectories.has(path)) {
          return;
        }

        seenDirectories.add(path);
        nodes.push({
          id: `dir:${path}`,
          kind: "directory",
          label: directoryParts[index] ?? path,
          path,
          depth: index
        });
      });

      nodes.push({
        id: document.id,
        kind: "file",
        label: document.title,
        path: document.path,
        depth: directoryParts.length,
        document
      });
    }

    return nodes.sort((left, right) => {
      if (left.path === right.path) {
        return left.kind.localeCompare(right.kind);
      }

      return left.path.localeCompare(right.path, "ja");
    });
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
