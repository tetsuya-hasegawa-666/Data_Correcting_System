import type { CodeTargetRecord } from "./CodeTargetRecord";
import type { CodeTargetRepository } from "./CodeTargetRepository";

export class StaticCodeTargetRepository implements CodeTargetRepository {
  public constructor(private readonly targets: CodeTargetRecord[]) {}

  public listTargets(): CodeTargetRecord[] {
    return this.targets.map((target) => ({ ...target }));
  }
}
