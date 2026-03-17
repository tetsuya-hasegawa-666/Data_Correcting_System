import { createReadStream, existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { basename, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

import { defineConfig } from "vitest/config";

import { loadLiveProjectSnapshot, resolveDownloadTarget } from "./tools/liveProjectSnapshot";

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

        server.middlewares.use("/api/dashboard/download", (request, response) => {
          if (!existsSync(manifestPath)) {
            response.statusCode = 404;
            response.end("project manifest was not found");
            return;
          }

          try {
            const requestUrl = new URL(request.url ?? "", "http://localhost");
            const relativePath = requestUrl.searchParams.get("path");
            if (!relativePath) {
              response.statusCode = 400;
              response.end("download path is required");
              return;
            }

            const target = resolveDownloadTarget(manifestPath, relativePath);
            if (target.kind === "file") {
              response.statusCode = 200;
              response.setHeader("Content-Type", "application/octet-stream");
              response.setHeader(
                "Content-Disposition",
                `attachment; filename="${basename(target.fileName)}"`
              );
              createReadStream(target.absolutePath).pipe(response);
              return;
            }

            const zipPath = createArchiveZip(target.absolutePath, target.fileName);
            response.statusCode = 200;
            response.setHeader("Content-Type", "application/zip");
            response.setHeader(
              "Content-Disposition",
              `attachment; filename="${basename(target.fileName)}"`
            );
            const stream = createReadStream(zipPath);
            stream.on("close", () => {
              rmSync(zipPath, { force: true });
            });
            stream.pipe(response);
          } catch (error) {
            response.statusCode = 500;
            response.end(error instanceof Error ? error.message : "download failed");
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

function createArchiveZip(absolutePath: string, fileName: string): string {
  const tempDirectory = mkdtempSync(resolve(tmpdir(), "idevelop-download-"));
  const zipPath = resolve(tempDirectory, fileName);
  const command = [
    "-NoProfile",
    "-Command",
    `Compress-Archive -Path '${absolutePath.replace(/'/g, "''")}' -DestinationPath '${zipPath.replace(/'/g, "''")}' -Force`
  ];
  const result = spawnSync("powershell", command, { stdio: "pipe" });
  if (result.status !== 0 || !existsSync(zipPath)) {
    rmSync(tempDirectory, { recursive: true, force: true });
    throw new Error(
      result.stderr.toString("utf8").trim() || "archive download zip creation failed"
    );
  }
  return zipPath;
}
