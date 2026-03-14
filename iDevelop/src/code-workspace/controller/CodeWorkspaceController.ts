import type { CodeTargetRepository } from "../model/CodeTargetRepository";

export interface CodeWorkspaceState {
  targets: Array<{
    id: string;
    title: string;
    path: string;
    description: string;
    kind?: string;
    updatedAt?: string;
  }>;
  policyNote: string;
  sourcePolicy: string;
}

export class CodeWorkspaceController {
  public constructor(private readonly repository: CodeTargetRepository) {}

  public createState(): CodeWorkspaceState {
    return {
      targets: this.repository.listTargets(),
      policyNote: "読み取り専用です。実行、attach、保存はできません。",
      sourcePolicy: this.repository.getSourcePolicy()
    };
  }
}
