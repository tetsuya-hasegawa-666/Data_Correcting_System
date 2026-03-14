import { describe, expect, it } from "vitest";

import { CodeWorkspaceController } from "../../src/code-workspace/controller/CodeWorkspaceController";
import { StaticCodeTargetRepository } from "../../src/code-workspace/model/StaticCodeTargetRepository";

describe("CodeWorkspaceController", () => {
  it("returns read-only targets and a policy note", () => {
    const controller = new CodeWorkspaceController(
      new StaticCodeTargetRepository(
        [
          {
            id: "document-controller",
            title: "DocumentWorkspaceController.ts",
            path: "src/document-workspace/controller/DocumentWorkspaceController.ts",
            description: "ts / 80 lines",
            kind: "ts",
            updatedAt: "2026-03-14T10:00:00Z"
          }
        ],
        "filesystem recursive read-only"
      )
    );

    const state = controller.createState();

    expect(state.targets).toHaveLength(1);
    expect(state.policyNote).toContain("読み取り専用");
    expect(state.sourcePolicy).toContain("filesystem");
  });
});
