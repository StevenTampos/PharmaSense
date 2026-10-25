import mysql, { type Pool, type RowDataPacket, type ResultSetHeader } from "mysql2/promise";
import { config } from "./environment.ts";

export const pool: Pool = mysql.createPool({
  host: config.db.host,
  port: config.db.port,
  user: config.db.user,
  password: config.db.password,
  database: config.db.name,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
  charset: "utf8mb4",
});

export type DbValue = string | number | boolean | null | undefined | Date;

export async function query<T extends RowDataPacket[]>(
  sql: string,
  params: DbValue[] = [],
): Promise<T> {
  const [rows] = await pool.query<T>(sql, params as unknown as (string | number)[]);
  return rows;
}

export async function execute(sql: string, params: DbValue[] = []): Promise<ResultSetHeader> {
  const [result] = await pool.execute<ResultSetHeader>(
    sql,
    params as unknown as (string | number)[],
  );
  return result;
}
