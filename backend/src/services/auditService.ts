import { execute } from "../config/database.ts";
import type { AuditLogAction, AuditLogModule } from "../types/index.ts";

export interface RecordAuditParams {
  userId?: number | null;
  action: AuditLogAction | string;
  module: AuditLogModule | string;
  recordId?: string | number | null;
  description: string;
  ipAddress?: string | null;
  device?: string | null;
}

export async function recordAuditLog(params: RecordAuditParams): Promise<void> {
  const sql = `
    INSERT INTO audit_logs (
      user_id,
      action,
      module,
      record_id,
      description,
      ip_address,
      device
    ) VALUES (?, ?, ?, ?, ?, ?, ?)
  `;

  await execute(sql, [
    params.userId ?? null,
    params.action,
    params.module,
    params.recordId != null ? String(params.recordId) : null,
    params.description,
    params.ipAddress ?? null,
    params.device ?? null,
  ]);
}
