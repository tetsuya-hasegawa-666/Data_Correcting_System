import { existsSync } from "node:fs";
import { resolve } from "node:path";
import { fileURLToPath } from "node:url";

import { defineConfig } from "vitest/config";

import { loadLiveProjectSnapshot } from "./tools/liveProjectSnapshot";

const projectDir = resolve(fileURLToPath(new URL(".", import.meta.url)));
const manifestPath = resolve(projectDir, "config", "project-manifest.json");

export default defineConfig({
  plugins: [
    {
      name: "idevelop-live-project-state",
      configureServer(server) {
        server.middlewares.use("/api/dashboard/live-state", (_request, response) => {
          if (!existsSync(manifestPath)) {
            response.statusCode = 404;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify({ message: "project manifest was not found" }));
            return;
          }

          try {
            const snapshot = loadLiveProjectSnapshot(manifestPath);
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/json");
            response.end(JSON.stringify(snapshot));
          } catch (error) {
            response.statusCode = 500;
            response.setHeader("Content-Type", "application/json");
            response.end(
              JSON.stringify({
                message: error instanceof Error ? error.message : "live project snapshot failed"
              })
            );
          }
        });
      }
    }
  ],
  test: {
    environment: "jsdom",
    coverage: {
      reporter: ["text", "html"]
    }
  }
});
