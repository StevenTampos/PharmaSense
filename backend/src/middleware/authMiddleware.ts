import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config/environment.ts";
import { query } from "../config/database.ts";
import type { AuthTokenPayload, UserRole, UserStatus } from "../types/index.ts";
import type { RowDataPacket } from "mysql2/promise";

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

interface UserStatusRow extends RowDataPacket {
  id: number;
  status: UserStatus;
  role: UserRole;
}

export async function authenticateToken(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<void> {
  const authHeader = req.headers.authorization;
  const token = authHeader && authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!token) {
    res.status(401).json({
      status: "error",
      message: "Authentication required. No token provided.",
    });
    return;
  }

  let payload: AuthTokenPayload;
  try {
    payload = jwt.verify(token, config.jwt.secret) as AuthTokenPayload;
  } catch {
    res.status(401).json({
      status: "error",
      message: "Invalid or expired authentication token.",
    });
    return;
  }

  let rows: UserStatusRow[];
  try {
    rows = await query<UserStatusRow[]>("SELECT id, status, role FROM users WHERE id = ? LIMIT 1", [
      payload.id,
    ]);
  } catch {
    res.status(500).json({
      status: "error",
      message: "Database error during authentication verification.",
    });
    return;
  }

  if (rows.length === 0) {
    res.status(401).json({
      status: "error",
      message: "Account not found.",
    });
    return;
  }

  const currentUser = rows[0];
  if (currentUser.status === "Inactive") {
    res.status(403).json({
      status: "error",
      message: "Account is deactivated. Access denied.",
    });
    return;
  }

  req.user = {
    id: currentUser.id,
    email: payload.email,
    role: currentUser.role,
  };

  next();
}

export function requireRole(allowedRoles: UserRole[]) {
  return (req: Request, res: Response, next: NextFunction): void => {
    if (!req.user) {
      res.status(401).json({
        status: "error",
        message: "Authentication required.",
      });
      return;
    }

    if (!allowedRoles.includes(req.user.role)) {
      res.status(403).json({
        status: "error",
        message: `Forbidden. Role '${req.user.role}' is not authorized to access this resource.`,
      });
      return;
    }

    next();
  };
}

export const requireAdmin = requireRole(["Administrator"]);
