import { describe, it, expect, vi } from "vitest";
import { recordAuditLog } from "../src/services/auditService.ts";
import { execute } from "../src/config/database.ts";

vi.mock("../src/config/database.ts", () => ({
  pool: {},
  query: vi.fn(),
  execute: vi.fn().mockResolvedValue({ insertId: 1 }),
}));

describe("Audit logging service", () => {
  it("truncates description and device metadata to database column sizes", async () => {
    const description = "d".repeat(600);
    const device = "u".repeat(400);

    await recordAuditLog({
      userId: 1,
      action: "LOGIN",
      module: "Authentication",
      description,
      device,
    });

    const params = vi.mocked(execute).mock.calls[0][1];
    expect(params?.[4]).toBe("d".repeat(500));
    expect(params?.[6]).toBe("u".repeat(255));
  });
});
