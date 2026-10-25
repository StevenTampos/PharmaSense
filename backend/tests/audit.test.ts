import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.ts";
import { query } from "../src/config/database.ts";
import { config } from "../src/config/environment.ts";
import type { AuditLog, User } from "../src/types/index.ts";
import type { RowDataPacket } from "mysql2/promise";

vi.mock("../src/config/database.ts", () => ({
  pool: {},
  query: vi.fn(),
  execute: vi.fn(),
}));

const admin: User = {
  id: 1,
  first_name: "Admin",
  last_name: "User",
  email: "admin@pharmasense.local",
  phone: "09171234567",
  role: "Administrator",
  password_hash: "hashed",
  profile_pic: null,
  status: "Active",
  created_at: new Date(),
  updated_at: new Date(),
};

const staff: User = {
  ...admin,
  id: 2,
  email: "staff@pharmasense.local",
  role: "Cashier/Pharmacist",
};

const auditLog: AuditLog = {
  id: 10,
  user_id: 1,
  action: "LOGIN",
  module: "Authentication",
  record_id: "1",
  description: "Administrator logged in",
  ip_address: "127.0.0.1",
  device: "Test client",
  created_at: new Date(),
};

const tokenFor = (user: User) =>
  jwt.sign({ id: user.id, email: user.email, role: user.role }, config.jwt.secret, {
    expiresIn: "1h",
  });

describe("Audit log API", () => {
  beforeEach(() => vi.clearAllMocks());

  it("requires authentication", async () => {
    const response = await request(app).get("/api/audit-logs");
    expect(response.status).toBe(401);
  });

  it("rejects non-admin roles", async () => {
    vi.mocked(query).mockResolvedValueOnce([staff] as unknown as RowDataPacket[]);
    const response = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${tokenFor(staff)}`);
    expect(response.status).toBe(403);
  });

  it("returns filtered logs and binds pagination as integers", async () => {
    vi.mocked(query)
      .mockResolvedValueOnce([admin] as unknown as RowDataPacket[])
      .mockResolvedValueOnce([auditLog] as unknown as RowDataPacket[]);

    const response = await request(app)
      .get("/api/audit-logs")
      .query({
        module: "Authentication",
        action: "LOGIN",
        search: "logged in",
        limit: "10.5",
        offset: "2.5",
      })
      .set("Authorization", `Bearer ${tokenFor(admin)}`);

    expect(response.status).toBe(200);
    expect(response.body.data).toHaveLength(1);
    expect(query).toHaveBeenLastCalledWith(expect.stringContaining("LIMIT ? OFFSET ?"), [
      "Authentication",
      "LOGIN",
      "%logged in%",
      10,
      2,
    ]);
  });

  it("clamps pagination bounds and falls back on non-numeric values", async () => {
    vi.mocked(query)
      .mockResolvedValueOnce([admin] as unknown as RowDataPacket[])
      .mockResolvedValueOnce([] as unknown as RowDataPacket[]);

    const response = await request(app)
      .get("/api/audit-logs")
      .query({ limit: "NaN", offset: "-3" })
      .set("Authorization", `Bearer ${tokenFor(admin)}`);

    expect(response.status).toBe(200);
    expect(query).toHaveBeenLastCalledWith(expect.stringContaining("LIMIT ? OFFSET ?"), [50, 0]);
  });

  it("returns 500 when database lookup fails during token authentication", async () => {
    vi.mocked(query).mockRejectedValueOnce(new Error("database unavailable"));
    const response = await request(app)
      .get("/api/audit-logs")
      .set("Authorization", `Bearer ${tokenFor(admin)}`);
    expect(response.status).toBe(500);
    expect(response.body.message).toContain("Database error");
  });
});
