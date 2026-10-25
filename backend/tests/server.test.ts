import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";

const mocks = vi.hoisted(() => {
  const close = vi.fn((callback: (error?: Error) => void) => callback());
  const on = vi.fn();
  const address = vi.fn(() => ({ port: 5000 }));
  const server = { close, on, address };
  return { close, on, address, server };
});

vi.mock("../src/app.ts", () => ({ default: { listen: vi.fn(() => mocks.server) } }));
vi.mock("../src/config/environment.ts", () => ({ config: { port: 5000, nodeEnv: "test" } }));
vi.mock("../src/config/database.ts", () => ({
  closeDatabasePool: vi.fn().mockResolvedValue(undefined),
}));
vi.mock("node:http", () => ({
  createServer: vi.fn(() => ({
    listen: vi.fn((_port: number, callback: () => void) => callback()),
    close: mocks.close,
    on: mocks.on,
    address: mocks.address,
  })),
}));

describe("backend server shutdown", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("closes the HTTP server and database pool on SIGTERM", async () => {
    const { closeDatabasePool } = await import("../src/config/database.ts");
    const { shutdown } = await import("../src/server.ts");

    await shutdown("SIGTERM");

    expect(mocks.close).toHaveBeenCalledOnce();
    expect(closeDatabasePool).toHaveBeenCalledOnce();
    expect(process.exitCode).toBe(0);
  });

  it("closes the HTTP server and database pool on SIGINT", async () => {
    const { closeDatabasePool } = await import("../src/config/database.ts");
    const { shutdown } = await import("../src/server.ts");

    await shutdown("SIGINT");

    expect(mocks.close).toHaveBeenCalledOnce();
    expect(closeDatabasePool).toHaveBeenCalledOnce();
  });
});
