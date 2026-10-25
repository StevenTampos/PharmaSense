import type { AddressInfo } from "node:net";
import app from "./app.ts";
import { config } from "./config/environment.ts";
import { closeDatabasePool } from "./config/database.ts";

const server = app.listen(config.port, () => {
  const address = server.address() as AddressInfo;
  console.log(`PharmaSense API server running on port ${address.port} [${config.nodeEnv}]`);
});

let isShuttingDown = false;

export async function shutdown(signal: NodeJS.Signals): Promise<void> {
  if (isShuttingDown) return;
  isShuttingDown = true;
  console.log(`${signal} received; closing HTTP server and database pool.`);

  const forceExitTimer = setTimeout(() => {
    console.error("Graceful shutdown timed out; forcing process exit.");
    process.exit(1);
  }, 10_000);
  forceExitTimer.unref();

  try {
    await new Promise<void>((resolve, reject) => {
      server.close((error) => (error ? reject(error) : resolve()));
    });
    await closeDatabasePool();
    clearTimeout(forceExitTimer);
    process.exitCode = 0;
  } catch (error) {
    console.error("Graceful shutdown failed:", error);
    process.exitCode = 1;
  }
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

export default server;
