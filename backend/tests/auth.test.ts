import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import app from "../src/app.ts";
import { query, execute } from "../src/config/database.ts";
import { config } from "../src/config/environment.ts";
import type { User } from "../src/types/index.ts";
import type { RowDataPacket } from "mysql2/promise";

vi.mock("../src/config/database.ts", () => ({
  pool: {},
  query: vi.fn(),
  execute: vi.fn().mockResolvedValue({ insertId: 1 }),
}));

describe("Authentication API (Sprint 1)", () => {
  const adminPasswordHash = bcrypt.hashSync("AdminPassword123!", 10);
  const inactivePasswordHash = bcrypt.hashSync("InactivePassword123!", 10);

  const mockAdminUser: User = {
    id: 1,
    first_name: "Admin",
    last_name: "User",
    email: "admin@pharmasense.local",
    phone: "09171234567",
    role: "Administrator",
    password_hash: adminPasswordHash,
    profile_pic: null,
    status: "Active",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const mockInactiveUser: User = {
    id: 4,
    first_name: "Alex",
    last_name: "Rivera",
    email: "inactive@pharmasense.local",
    phone: "09201234567",
    role: "Cashier/Pharmacist",
    password_hash: inactivePasswordHash,
    profile_pic: null,
    status: "Inactive",
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("POST /api/auth/login", () => {
    it("successfully logs in an Administrator with valid credentials", async () => {
      vi.mocked(query).mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]);

      const res = await request(app).post("/api/auth/login").send({
        email: "admin@pharmasense.local",
        password: "AdminPassword123!",
      });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.token).toBeDefined();
      expect(res.body.data.user.email).toBe("admin@pharmasense.local");
      expect(res.body.data.user.role).toBe("Administrator");
      expect(res.body.data.user.password_hash).toBeUndefined();
      expect(execute).toHaveBeenCalled(); // Audit log recorded
    });

    it("rejects login with 400 when email or password is empty", async () => {
      const res = await request(app).post("/api/auth/login").send({ email: "", password: "" });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toBe("Invalid email or password.");
    });

    it("rejects login with 401 for unregistered email with a generic error message", async () => {
      vi.mocked(query).mockResolvedValueOnce([] as unknown as RowDataPacket[]);

      const res = await request(app).post("/api/auth/login").send({
        email: "nonexistent@pharmasense.local",
        password: "Password123!",
      });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toBe("Invalid email or password.");
      expect(execute).toHaveBeenCalled(); // Audit log for failed attempt
    });

    it("rejects login with 401 for registered email with incorrect password with identical error message", async () => {
      vi.mocked(query).mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]);

      const res = await request(app).post("/api/auth/login").send({
        email: "admin@pharmasense.local",
        password: "WrongPassword!",
      });

      expect(res.status).toBe(401);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toBe("Invalid email or password.");
      expect(execute).toHaveBeenCalled(); // Audit log for failed attempt
    });

    it("rejects login with 403 when user account is deactivated", async () => {
      vi.mocked(query).mockResolvedValueOnce([mockInactiveUser] as unknown as RowDataPacket[]);

      const res = await request(app).post("/api/auth/login").send({
        email: "inactive@pharmasense.local",
        password: "InactivePassword123!",
      });

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("deactivated");
      expect(execute).toHaveBeenCalled(); // Audit log for blocked attempt
    });
  });

  describe("GET /api/auth/me", () => {
    it("returns 401 when no token is provided", async () => {
      const res = await request(app).get("/api/auth/me");
      expect(res.status).toBe(401);
      expect(res.body.status).toBe("error");
    });

    it("returns 200 with user profile when valid token is supplied", async () => {
      const token = jwt.sign(
        { id: 1, email: mockAdminUser.email, role: mockAdminUser.role },
        config.jwt.secret,
        { expiresIn: "1h" },
      );

      vi.mocked(query)
        .mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]) // authenticateToken status check
        .mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]); // getMe query

      const res = await request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.email).toBe("admin@pharmasense.local");
    });

    it("returns 401 for invalid token before querying the database", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer not-a-valid-jwt");

      expect(response.status).toBe(401);
      expect(query).not.toHaveBeenCalled();
    });

    it("returns 500 when the database is unavailable during token verification", async () => {
      const token = jwt.sign(
        { id: 1, email: mockAdminUser.email, role: mockAdminUser.role },
        config.jwt.secret,
        { expiresIn: "1h" },
      );
      vi.mocked(query).mockRejectedValueOnce(new Error("database unavailable"));

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`);

      expect(response.status).toBe(500);
      expect(response.body.message).toContain("Database error");
    });

    it("does not apply the login throttle to profile requests", async () => {
      vi.mocked(query).mockResolvedValue([mockAdminUser] as unknown as RowDataPacket[]);
      const token = jwt.sign(
        { id: 1, email: mockAdminUser.email, role: mockAdminUser.role },
        config.jwt.secret,
        { expiresIn: "1h" },
      );

      const responses = await Promise.all(
        Array.from({ length: 25 }, () =>
          request(app).get("/api/auth/me").set("Authorization", `Bearer ${token}`),
        ),
      );

      expect(responses.every((response) => response.status === 200)).toBe(true);
    });
  });

  describe("POST /api/auth/logout", () => {
    it("logs out successfully and records audit log", async () => {
      const token = jwt.sign(
        { id: 1, email: mockAdminUser.email, role: mockAdminUser.role },
        config.jwt.secret,
        { expiresIn: "1h" },
      );

      vi.mocked(query).mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]);

      const res = await request(app)
        .post("/api/auth/logout")
        .set("Authorization", `Bearer ${token}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.message).toBe("Logged out successfully.");
      expect(execute).toHaveBeenCalled(); // Audit log recorded
    });
  });
});
