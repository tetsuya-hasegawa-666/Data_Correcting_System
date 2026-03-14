import type { CodeWorkspaceState } from "../controller/CodeWorkspaceController";

export class CodeWorkspaceView {
  public constructor(private readonly rootElement: HTMLElement) {}

  public render(state: CodeWorkspaceState): void {
    const listMarkup = state.targets
      .map(
        (target) => `
          <article class="code-target">
            <h3>${this.escapeHtml(target.title)}</h3>
            <p>${this.escapeHtml(target.path)}</p>
            <p>${this.escapeHtml(target.description)}</p>
          </article>
        `
      )
      .join("");

    this.rootElement.innerHTML = `
      <section class="data-workspace">
        <div class="section-heading">
          <p class="eyebrow">コード</p>
          <h2>参照専用の確認画面</h2>
          <p data-role="code-policy">${this.escapeHtml(state.policyNote)}</p>
        </div>
        <div class="document-list">${listMarkup}</div>
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
