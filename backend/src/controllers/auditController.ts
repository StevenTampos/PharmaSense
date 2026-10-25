import type { Request, Response } from "express";
import { query } from "../config/database.ts";
import type { AuditLog } from "../types/index.ts";
import type { RowDataPacket } from "mysql2/promise";

interface AuditLogRow extends AuditLog, RowDataPacket {}
interface CountRow extends RowDataPacket {
  total: number;
}

function escapeLikePattern(value: string): string {
  return value.replace(/[\\%_]/g, "\\$&");
}

export async function getAuditLogs(req: Request, res: Response): Promise<void> {
  const { module, action, search, limit = "50", offset = "0" } = req.query;

  const conditions: string[] = [];
  const params: (string | number | boolean | Date | null | undefined)[] = [];

  if (typeof module === "string" && module.trim()) {
    conditions.push("module = ?");
    params.push(module.trim());
  }

  if (typeof action === "string" && action.trim()) {
    conditions.push("action = ?");
    params.push(action.trim());
  }

  if (typeof search === "string" && search.trim()) {
    conditions.push("LOWER(description) LIKE ? ESCAPE '\\\\'");
    params.push(`%${escapeLikePattern(search.trim().toLowerCase())}%`);
  }

  const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";
  const numericLimit = Number(limit);
  const numericOffset = Number(offset);
  const parsedLimit = Math.min(
    Math.max(Number.isFinite(numericLimit) ? Math.floor(numericLimit) : 50, 1),
    200,
  );
  const parsedOffset = Math.max(Number.isFinite(numericOffset) ? Math.floor(numericOffset) : 0, 0);

  const sql = `
    SELECT
      id,
      user_id,
      action,
      module,
      record_id,
      description,
      ip_address,
      device,
      created_at
    FROM audit_logs
    ${whereClause}
    ORDER BY created_at DESC
    LIMIT ? OFFSET ?
  `;

  const countRows = await query<CountRow[]>(
    `SELECT COUNT(*) AS total FROM audit_logs ${whereClause}`,
    params,
  );
  const logs = await query<AuditLogRow[]>(sql, [...params, parsedLimit, parsedOffset]);
  const total = Number(countRows[0]?.total ?? 0);
  const page = Math.floor(parsedOffset / parsedLimit) + 1;

  res.status(200).json({
    status: "success",
    data: {
      logs,
      total,
      page,
      limit: parsedLimit,
      totalPages: Math.ceil(total / parsedLimit),
    },
  });
}
