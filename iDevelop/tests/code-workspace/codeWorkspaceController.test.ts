import { describe, expect, it } from "vitest";

import { CodeWorkspaceController } from "../../src/code-workspace/controller/CodeWorkspaceController";
import { StaticCodeTargetRepository } from "../../src/code-workspace/model/StaticCodeTargetRepository";

describe("CodeWorkspaceController", () => {
  it("returns read-only targets and a policy note", () => {
    const controller = new CodeWorkspaceController(
      new StaticCodeTargetRepository([
        {
          id: "document-controller",
          title: "Document Controller",
          path: "src/document-workspace/controller/DocumentWorkspaceController.ts",
          description: "Search and save flow."
        }
      ])
    );

    const state = controller.createState();

    expect(state.targets).toHaveLength(1);
    expect(state.policyNote).toContain("参照専用");
  });
});
