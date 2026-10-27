import { spawn } from "node:child_process";

const isWindows = process.platform === "win32";
const npmCmd = isWindows ? "npm.cmd" : "npm";

console.log("[PharmaSense] Starting full-stack development environment...\n");

const backend = spawn(npmCmd, ["run", "dev:backend"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
});

const frontend = spawn(npmCmd, ["run", "dev"], {
  stdio: ["inherit", "pipe", "pipe"],
  shell: true,
});

function prefixOutput(stream: NodeJS.ReadableStream, prefix: string): void {
  stream.on("data", (chunk: Buffer) => {
    const lines = chunk.toString().split(/\r?\n/);
    for (const line of lines) {
      if (line.trim()) {
        console.log(`${prefix} ${line}`);
      }
    }
  });
}

if (backend.stdout && backend.stderr) {
  prefixOutput(backend.stdout, "\x1b[34m[backend]\x1b[0m");
  prefixOutput(backend.stderr, "\x1b[31m[backend-err]\x1b[0m");
}

if (frontend.stdout && frontend.stderr) {
  prefixOutput(frontend.stdout, "\x1b[32m[frontend]\x1b[0m");
  prefixOutput(frontend.stderr, "\x1b[33m[frontend-err]\x1b[0m");
}

function shutdown(): void {
  console.log("\n[PharmaSense] Stopping full-stack development servers...");
  backend.kill("SIGINT");
  frontend.kill("SIGINT");
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
