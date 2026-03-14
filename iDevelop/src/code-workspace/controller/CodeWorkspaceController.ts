import type { CodeTargetRepository } from "../model/CodeTargetRepository";

export interface CodeWorkspaceState {
  targets: Array<{
    id: string;
    title: string;
    path: string;
    description: string;
  }>;
  policyNote: string;
}

export class CodeWorkspaceController {
  public constructor(private readonly repository: CodeTargetRepository) {}

  public createState(): CodeWorkspaceState {
    return {
      targets: this.repository.listTargets(),
      policyNote: "参照専用です。プロセス接続、実行、編集はできません。"
    };
  }
}
