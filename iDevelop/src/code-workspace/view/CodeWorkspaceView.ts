import type { CodeWorkspaceState } from "../controller/CodeWorkspaceController";

export class CodeWorkspaceView {
  public constructor(private readonly rootElement: HTMLElement) {}

  public render(state: CodeWorkspaceState): void {
    const listMarkup = state.targets
      .map(
        (target) => `
          <article class="code-target">
            <p class="eyebrow">${this.escapeHtml(target.kind ?? "code")}</p>
            <h3>${this.escapeHtml(target.title)}</h3>
            <p>${this.escapeHtml(target.path)}</p>
            <p>${this.escapeHtml(target.description)}</p>
            ${
              target.updatedAt
                ? `<p class="document-path">更新日時: ${this.escapeHtml(target.updatedAt)}</p>`
                : ""
            }
          </article>
        `
      )
      .join("");

    this.rootElement.innerHTML = `
      <section class="data-workspace">
        <div class="section-heading">
          <p class="eyebrow">コード</p>
          <h2>読み取り専用の確認対象</h2>
          <p class="result-count">読み込みポリシー: ${this.escapeHtml(state.sourcePolicy)}</p>
          <p data-role="code-policy">${this.escapeHtml(state.policyNote)}</p>
        </div>
        <div class="document-list">${listMarkup || "<p>表示できる code/script はありません。</p>"}</div>
      </section>
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
}
