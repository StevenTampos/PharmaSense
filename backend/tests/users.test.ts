import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";
import jwt from "jsonwebtoken";
import app from "../src/app.ts";
import { query, execute } from "../src/config/database.ts";
import { config } from "../src/config/environment.ts";
import type { User } from "../src/types/index.ts";
import type { RowDataPacket } from "mysql2/promise";

vi.mock("../src/config/database.ts", () => ({
  pool: {},
  query: vi.fn(),
  execute: vi.fn().mockResolvedValue({ insertId: 5 }),
}));

describe("User Management API (Sprint 1)", () => {
  const mockAdminUser: User = {
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

  const mockStaffUser: User = {
    id: 2,
    first_name: "Maria",
    last_name: "Santos",
    email: "pharmacist@pharmasense.local",
    phone: "09181234567",
    role: "Cashier/Pharmacist",
    password_hash: "hashed",
    profile_pic: null,
    status: "Active",
    created_at: new Date(),
    updated_at: new Date(),
  };

  const adminToken = jwt.sign(
    { id: 1, email: mockAdminUser.email, role: "Administrator" },
    config.jwt.secret,
    { expiresIn: "1h" },
  );

  const staffToken = jwt.sign(
    { id: 2, email: mockStaffUser.email, role: "Cashier/Pharmacist" },
    config.jwt.secret,
    { expiresIn: "1h" },
  );

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("GET /api/users", () => {
    it("rejects unauthenticated request with 401", async () => {
      const res = await request(app).get("/api/users");
      expect(res.status).toBe(401);
      expect(res.body.status).toBe("error");
    });

    it("rejects non-administrator user with 403 Forbidden", async () => {
      vi.mocked(query).mockResolvedValueOnce([mockStaffUser] as unknown as RowDataPacket[]);

      const res = await request(app).get("/api/users").set("Authorization", `Bearer ${staffToken}`);

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("Forbidden");
    });

    it("returns list of users for Administrator", async () => {
      vi.mocked(query)
        .mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]) // auth check
        .mockResolvedValueOnce([mockAdminUser, mockStaffUser] as unknown as RowDataPacket[]); // users list

      const res = await request(app).get("/api/users").set("Authorization", `Bearer ${adminToken}`);

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.length).toBe(2);
      expect(res.body.data[0].password_hash).toBeUndefined();
    });
  });

  describe("POST /api/users (Add User)", () => {
    it("rejects non-admin create-user request with 403 Forbidden", async () => {
      vi.mocked(query).mockResolvedValueOnce([mockStaffUser] as unknown as RowDataPacket[]);

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${staffToken}`)
        .send({
          first_name: "Test",
          last_name: "User",
          email: "test@pharmasense.local",
          phone: "09123456789",
          role: "Cashier/Pharmacist",
          password: "Password123!",
        });

      expect(res.status).toBe(403);
      expect(res.body.status).toBe("error");
    });

    it("rejects user creation when fields are empty", async () => {
      vi.mocked(query).mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]);

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          first_name: "",
          last_name: "",
          email: "",
          phone: "",
          role: "",
          password: "",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("required");
    });

    it("rejects user creation with invalid email format", async () => {
      vi.mocked(query).mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]);

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          first_name: "John",
          last_name: "Doe",
          email: "invalid-email-format",
          phone: "09123456789",
          role: "Cashier/Pharmacist",
          password: "Password123!",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("email");
    });

    it.each([
      "john doe@pharmasense.local",
      "user\\nname@pharmasense.local",
      "john..doe@pharmasense.local",
    ])("rejects email with invalid local-part characters: %s", async (email) => {
      vi.mocked(query).mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]);

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          first_name: "John",
          last_name: "Doe",
          email,
          phone: "09123456789",
          role: "Cashier/Pharmacist",
          password: "Password123!",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toContain("email");
    });

    it("rejects user creation with non-numeric phone number", async () => {
      vi.mocked(query).mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]);

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          first_name: "John",
          last_name: "Doe",
          email: "john@pharmasense.local",
          phone: "0912-345-ABC",
          role: "Cashier/Pharmacist",
          password: "Password123!",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("numeric");
    });

    it("rejects user creation when role is invalid", async () => {
      vi.mocked(query).mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]);

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          first_name: "John",
          last_name: "Doe",
          email: "john@pharmasense.local",
          phone: "09123456789",
          role: "InvalidRole",
          password: "Password123!",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("role");
    });

    it("rejects user creation when email is already registered", async () => {
      vi.mocked(query)
        .mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]) // auth
        .mockResolvedValueOnce([{ id: 10 }] as unknown as RowDataPacket[]); // existing email check

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          first_name: "John",
          last_name: "Doe",
          email: "existing@pharmasense.local",
          phone: "09123456789",
          role: "Cashier/Pharmacist",
          password: "Password123!",
        });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("already registered");
    });

    it("returns duplicate-email conflict when concurrent inserts race", async () => {
      vi.mocked(query)
        .mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]) // auth
        .mockResolvedValueOnce([] as unknown as RowDataPacket[]); // email pre-check
      vi.mocked(execute).mockRejectedValueOnce({ code: "ER_DUP_ENTRY" });

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          first_name: "John",
          last_name: "Doe",
          email: "existing@pharmasense.local",
          phone: "09123456789",
          role: "Cashier/Pharmacist",
          password: "Password123!",
        });

      expect(res.status).toBe(400);
      expect(res.body.message).toBe("Email is already registered.");
    });

    it("creates a new user with Active status and records audit log", async () => {
      const createdUser: User = {
        id: 5,
        first_name: "Carlos",
        last_name: "Reyes",
        email: "carlos@pharmasense.local",
        phone: "09123456789",
        role: "Cashier/Pharmacist",
        password_hash: "hashed",
        profile_pic: null,
        status: "Active",
        created_at: new Date(),
        updated_at: new Date(),
      };

      vi.mocked(query)
        .mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]) // auth
        .mockResolvedValueOnce([] as unknown as RowDataPacket[]) // email unique check
        .mockResolvedValueOnce([createdUser] as unknown as RowDataPacket[]); // read back created user

      const res = await request(app)
        .post("/api/users")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({
          first_name: "Carlos",
          last_name: "Reyes",
          email: "carlos@pharmasense.local",
          phone: "09123456789",
          role: "Cashier/Pharmacist",
          password: "Password123!",
        });

      expect(res.status).toBe(201);
      expect(res.body.status).toBe("success");
      expect(res.body.data.email).toBe("carlos@pharmasense.local");
      expect(res.body.data.status).toBe("Active");
      expect(execute).toHaveBeenCalled(); // Insert user & audit log
    });
  });

  describe("PATCH /api/users/:id/status (Activate / Deactivate)", () => {
    it("prevents an administrator from deactivating their own account", async () => {
      vi.mocked(query).mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]);

      const res = await request(app)
        .patch("/api/users/1/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Inactive" });

      expect(res.status).toBe(400);
      expect(res.body.status).toBe("error");
      expect(res.body.message).toContain("cannot deactivate their own account");
    });

    it("deactivates an active account and records audit log", async () => {
      const updatedStaff: User = { ...mockStaffUser, status: "Inactive" };

      vi.mocked(query)
        .mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]) // auth
        .mockResolvedValueOnce([mockStaffUser] as unknown as RowDataPacket[]) // check user
        .mockResolvedValueOnce([updatedStaff] as unknown as RowDataPacket[]); // read back

      const res = await request(app)
        .patch("/api/users/2/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Inactive" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.status).toBe("Inactive");
      expect(execute).toHaveBeenCalled(); // update & audit log
    });

    it("activates an inactive account and records audit log", async () => {
      const inactiveStaff: User = { ...mockStaffUser, status: "Inactive" };
      const activatedStaff: User = { ...mockStaffUser, status: "Active" };

      vi.mocked(query)
        .mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]) // auth
        .mockResolvedValueOnce([inactiveStaff] as unknown as RowDataPacket[]) // check user
        .mockResolvedValueOnce([activatedStaff] as unknown as RowDataPacket[]); // read back

      const res = await request(app)
        .patch("/api/users/2/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Active" });

      expect(res.status).toBe(200);
      expect(res.body.status).toBe("success");
      expect(res.body.data.status).toBe("Active");
      expect(execute).toHaveBeenCalled(); // update & audit log
    });

    it("does not expose password hash when status is already set", async () => {
      vi.mocked(query)
        .mockResolvedValueOnce([mockAdminUser] as unknown as RowDataPacket[]) // auth
        .mockResolvedValueOnce([mockStaffUser] as unknown as RowDataPacket[]); // check user

      const res = await request(app)
        .patch("/api/users/2/status")
        .set("Authorization", `Bearer ${adminToken}`)
        .send({ status: "Active" });

      expect(res.status).toBe(200);
      expect(res.body.data.email).toBe(mockStaffUser.email);
      expect(res.body.data.password_hash).toBeUndefined();
      expect(execute).not.toHaveBeenCalled();
    });
  });
});
