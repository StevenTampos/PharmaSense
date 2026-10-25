import type { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { query } from "../config/database.ts";
import { config } from "../config/environment.ts";
import { recordAuditLog } from "../services/auditService.ts";
import type { User, SafeUser } from "../types/index.ts";
import type { RowDataPacket } from "mysql2/promise";

interface UserRow extends User, RowDataPacket {}

const GENERIC_LOGIN_ERROR = "Invalid email or password.";

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body ?? {};
  const ipAddress = req.ip || req.socket.remoteAddress || null;
  const device = req.headers["user-agent"] || null;

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email.trim() ||
    !password.trim()
  ) {
    res.status(400).json({
      status: "error",
      message: GENERIC_LOGIN_ERROR,
    });
    return;
  }

  const normalizedEmail = email.trim().toLowerCase();

  const users = await query<UserRow[]>("SELECT * FROM users WHERE LOWER(email) = ? LIMIT 1", [
    normalizedEmail,
  ]);

  if (users.length === 0) {
    await recordAuditLog({
      userId: null,
      action: "LOGIN_FAILED",
      module: "Authentication",
      recordId: null,
      description: `Failed login attempt for unregistered email: ${normalizedEmail}`,
      ipAddress,
      device,
    });

    res.status(401).json({
      status: "error",
      message: GENERIC_LOGIN_ERROR,
    });
    return;
  }

  const user = users[0];

  const passwordMatches = await bcrypt.compare(password, user.password_hash);
  if (!passwordMatches) {
    await recordAuditLog({
      userId: user.id,
      action: "LOGIN_FAILED",
      module: "Authentication",
      recordId: String(user.id),
      description: `Failed login attempt (incorrect password) for user: ${user.email}`,
      ipAddress,
      device,
    });

    res.status(401).json({
      status: "error",
      message: GENERIC_LOGIN_ERROR,
    });
    return;
  }

  if (user.status === "Inactive") {
    await recordAuditLog({
      userId: user.id,
      action: "LOGIN_BLOCKED",
      module: "Authentication",
      recordId: String(user.id),
      description: `Blocked login attempt for deactivated account: ${user.email}`,
      ipAddress,
      device,
    });

    res.status(403).json({
      status: "error",
      message: "Your account is deactivated. Please contact your system administrator.",
    });
    return;
  }

  const token = jwt.sign(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn as jwt.SignOptions["expiresIn"] },
  );

  await recordAuditLog({
    userId: user.id,
    action: "LOGIN",
    module: "Authentication",
    recordId: String(user.id),
    description: `User ${user.email} (${user.role}) logged in successfully`,
    ipAddress,
    device,
  });

  const safeUser: SafeUser = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profile_pic: user.profile_pic,
    status: user.status,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  res.status(200).json({
    status: "success",
    data: {
      token,
      user: safeUser,
    },
    message: "Login successful.",
  });
}

export async function logout(req: Request, res: Response): Promise<void> {
  const ipAddress = req.ip || req.socket.remoteAddress || null;
  const device = req.headers["user-agent"] || null;

  if (req.user) {
    await recordAuditLog({
      userId: req.user.id,
      action: "LOGOUT",
      module: "Authentication",
      recordId: String(req.user.id),
      description: `User ${req.user.email} logged out`,
      ipAddress,
      device,
    });
  }

  res.status(200).json({
    status: "success",
    message: "Logged out successfully.",
  });
}

export async function getMe(req: Request, res: Response): Promise<void> {
  if (!req.user) {
    res.status(401).json({
      status: "error",
      message: "Authentication required.",
    });
    return;
  }

  const users = await query<UserRow[]>("SELECT * FROM users WHERE id = ? LIMIT 1", [req.user.id]);

  if (users.length === 0) {
    res.status(404).json({
      status: "error",
      message: "User account not found.",
    });
    return;
  }

  const user = users[0];
  const safeUser: SafeUser = {
    id: user.id,
    first_name: user.first_name,
    last_name: user.last_name,
    email: user.email,
    phone: user.phone,
    role: user.role,
    profile_pic: user.profile_pic,
    status: user.status,
    created_at: user.created_at,
    updated_at: user.updated_at,
  };

  res.status(200).json({
    status: "success",
    data: safeUser,
  });
}
