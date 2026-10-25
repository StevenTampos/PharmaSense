import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { query, execute } from "../config/database.ts";
import { recordAuditLog } from "../services/auditService.ts";
import type { User, SafeUser, UserRole } from "../types/index.ts";
import type { RowDataPacket, ResultSetHeader } from "mysql2/promise";

interface UserRow extends User, RowDataPacket {}

const VALID_ROLES: UserRole[] = ["Administrator", "Cashier/Pharmacist", "Inventory Manager"];

function isValidEmail(email: string): boolean {
  if (email.length > 254) {
    return false;
  }
  const atIndex = email.indexOf("@");
  if (atIndex <= 0 || atIndex !== email.lastIndexOf("@")) {
    return false;
  }

  const local = email.slice(0, atIndex);
  const domain = email.slice(atIndex + 1);
  const localPartCharacters = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+$/;

  if (
    local.length > 64 ||
    domain.length === 0 ||
    !localPartCharacters.test(local) ||
    local.startsWith(".") ||
    local.endsWith(".") ||
    local.includes("..")
  ) {
    return false;
  }

  const domainParts = domain.split(".");
  if (domainParts.length < 2) {
    return false;
  }

  return domainParts.every((part) => part.length > 0 && /^[a-zA-Z0-9-]+$/.test(part));
}

const PHONE_NUMERIC_REGEX = /^\d{7,15}$/;

export async function getUsers(req: Request, res: Response): Promise<void> {
  const { search, role, status } = req.query;

  const conditions: string[] = [];
  const params: (string | number | boolean | Date | null | undefined)[] = [];

  if (typeof role === "string" && VALID_ROLES.includes(role as UserRole)) {
    conditions.push("role = ?");
    params.push(role);
  }

  if (typeof status === "string" && (status === "Active" || status === "Inactive")) {
    conditions.push("status = ?");
    params.push(status);
  }

  if (typeof search === "string" && search.trim()) {
    const term = `%${search.trim().toLowerCase()}%`;
    conditions.push(
      "(LOWER(first_name) LIKE ? OR LOWER(last_name) LIKE ? OR LOWER(email) LIKE ? OR phone LIKE ?)",
    );
    params.push(term, term, term, term);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const sql = `
    SELECT
      id,
      first_name,
      last_name,
      email,
      phone,
      role,
      profile_pic,
      status,
      created_at,
      updated_at
    FROM users
    ${whereClause}
    ORDER BY created_at DESC
  `;

  const rows = await query<UserRow[]>(sql, params);

  const safeUsers: SafeUser[] = rows.map((u) => ({
    id: u.id,
    first_name: u.first_name,
    last_name: u.last_name,
    email: u.email,
    phone: u.phone,
    role: u.role,
    profile_pic: u.profile_pic,
    status: u.status,
    created_at: u.created_at,
    updated_at: u.updated_at,
  }));

  res.status(200).json({
    status: "success",
    data: safeUsers,
  });
}

export async function createUser(req: Request, res: Response): Promise<void> {
  const { first_name, last_name, email, phone, role, password } = req.body ?? {};
  const ipAddress = req.ip || req.socket.remoteAddress || null;
  const device = req.headers["user-agent"] || null;

  if (
    typeof first_name !== "string" ||
    typeof last_name !== "string" ||
    typeof email !== "string" ||
    typeof phone !== "string" ||
    typeof password !== "string" ||
    !first_name.trim() ||
    !last_name.trim() ||
    !email.trim() ||
    !phone.trim() ||
    !password.trim()
  ) {
    res.status(400).json({
      status: "error",
      message: "All fields are required.",
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();
  const normalizedPhone = phone.trim();

  if (!isValidEmail(normalizedEmail)) {
    res.status(400).json({
      status: "error",
      message: "Invalid email address format.",
    });
    return;
  }

  if (!PHONE_NUMERIC_REGEX.test(normalizedPhone)) {
    res.status(400).json({
      status: "error",
      message: "Phone number must contain only numeric digits (7 to 15 digits).",
    });
    return;
  }

  if (!VALID_ROLES.includes(role as UserRole)) {
    res.status(400).json({
      status: "error",
      message:
        "A valid role must be selected (Administrator, Cashier/Pharmacist, Inventory Manager).",
    });
    return;
  }

  if (password.length < 8) {
    res.status(400).json({
      status: "error",
      message: "Password must be at least 8 characters long.",
    });
    return;
  }

  const existing = await query<UserRow[]>("SELECT id FROM users WHERE email = ? LIMIT 1", [
    normalizedEmail,
  ]);

  if (existing.length > 0) {
    res.status(400).json({
      status: "error",
      message: "Email is already registered.",
    });
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);

  const insertSql = `
    INSERT INTO users (
      first_name,
      last_name,
      email,
      phone,
      role,
      password_hash,
      profile_pic,
      status
    ) VALUES (?, ?, ?, ?, ?, ?, NULL, 'Active')
  `;

  let result: ResultSetHeader;
  try {
    result = await execute(insertSql, [
      first_name.trim(),
      last_name.trim(),
      normalizedEmail,
      normalizedPhone,
      role,
      passwordHash,
    ]);
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === "ER_DUP_ENTRY"
    ) {
      res.status(400).json({
        status: "error",
        message: "Email is already registered.",
      });
      return;
    }
    throw error;
  }

  const newUserId = result.insertId;

  await recordAuditLog({
    userId: req.user?.id ?? null,
    action: "CREATE_USER",
    module: "Account Management",
    recordId: String(newUserId),
    description: `User account created for ${first_name.trim()} ${last_name.trim()} (${normalizedEmail}) with role ${role}`,
    ipAddress,
    device,
  });

  const createdUsers = await query<UserRow[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [
    newUserId,
  ]);

  const created = createdUsers[0];
  const safeUser: SafeUser = {
    id: created.id,
    first_name: created.first_name,
    last_name: created.last_name,
    email: created.email,
    phone: created.phone,
    role: created.role,
    profile_pic: created.profile_pic,
    status: created.status,
    created_at: created.created_at,
    updated_at: created.updated_at,
  };

  res.status(201).json({
    status: "success",
    data: safeUser,
    message: "User account created successfully.",
  });
}

export async function updateUserStatus(req: Request, res: Response): Promise<void> {
  const userId = Number(req.params.id);
  const { status } = req.body ?? {};
  const ipAddress = req.ip || req.socket.remoteAddress || null;
  const device = req.headers["user-agent"] || null;

  if (Number.isNaN(userId)) {
    res.status(400).json({
      status: "error",
      message: "Invalid user ID.",
    });
    return;
  }

  if (status !== "Active" && status !== "Inactive") {
    res.status(400).json({
      status: "error",
      message: "Status must be either 'Active' or 'Inactive'.",
    });
    return;
  }

  if (req.user && req.user.id === userId && status === "Inactive") {
    res.status(400).json({
      status: "error",
      message: "Administrators cannot deactivate their own account.",
    });
    return;
  }

  const existing = await query<UserRow[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [userId]);

  if (existing.length === 0) {
    res.status(404).json({
      status: "error",
      message: "User account not found.",
    });
    return;
  }

  const targetUser = existing[0];

  if (targetUser.status === status) {
    const safeUser: SafeUser = {
      id: targetUser.id,
      first_name: targetUser.first_name,
      last_name: targetUser.last_name,
      email: targetUser.email,
      phone: targetUser.phone,
      role: targetUser.role,
      profile_pic: targetUser.profile_pic,
      status: targetUser.status,
      created_at: targetUser.created_at,
      updated_at: targetUser.updated_at,
    };
    res.status(200).json({
      status: "success",
      data: safeUser,
      message: `Account is already ${status}.`,
    });
    return;
  }

  await execute("UPDATE users SET status = ? WHERE id = ?", [status, userId]);

  const action = status === "Active" ? "ACTIVATE_USER" : "DEACTIVATE_USER";
  const actionText = status === "Active" ? "activated" : "deactivated";

  await recordAuditLog({
    userId: req.user?.id ?? null,
    action,
    module: "Account Management",
    recordId: String(userId),
    description: `User account ${targetUser.email} was ${actionText} by ${req.user?.email ?? "Administrator"}`,
    ipAddress,
    device,
  });

  const updatedUsers = await query<UserRow[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [userId]);

  const updated = updatedUsers[0];
  const safeUser: SafeUser = {
    id: updated.id,
    first_name: updated.first_name,
    last_name: updated.last_name,
    email: updated.email,
    phone: updated.phone,
    role: updated.role,
    profile_pic: updated.profile_pic,
    status: updated.status,
    created_at: updated.created_at,
    updated_at: updated.updated_at,
  };

  res.status(200).json({
    status: "success",
    data: safeUser,
    message: `Account has been ${actionText} successfully.`,
  });
}
