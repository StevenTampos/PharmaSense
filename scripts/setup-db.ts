import { readFileSync, existsSync } from "node:fs";
import { resolve, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const rootDir = resolve(__dirname, "..");

const envPath = resolve(rootDir, "backend/.env");
if (existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const dbConfig = {
  host: process.env.DB_HOST || "localhost",
  port: Number(process.env.DB_PORT) || 3306,
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD ?? "",
  name: process.env.DB_NAME || "pharmasense",
};

export async function setupDatabase(): Promise<void> {
  console.log(
    `Connecting to MySQL server at ${dbConfig.host}:${dbConfig.port} as ${dbConfig.user}...`,
  );

  let serverConn: mysql.Connection | null = null;
  try {
    serverConn = await mysql.createConnection({
      host: dbConfig.host,
      port: dbConfig.port,
      user: dbConfig.user,
      password: dbConfig.password,
      multipleStatements: true,
    });
  } catch (error: unknown) {
    const err = error as { code?: string; message?: string };
    if (err.code === "ECONNREFUSED") {
      console.error(
        `\n[ERROR] Could not connect to MySQL at ${dbConfig.host}:${dbConfig.port}.\n` +
          `Please make sure MySQL is started in XAMPP Control Panel.\n`,
      );
    } else if (err.code === "ER_ACCESS_DENIED_ERROR") {
      console.error(
        `\n[ERROR] Access denied for MySQL user '${dbConfig.user}'.\n` +
          `Check your credentials in backend/.env (XAMPP default is root with no password).\n`,
      );
    } else {
      console.error(`\n[ERROR] Failed to connect to MySQL:`, err.message || error);
    }
    process.exit(1);
  }

  try {
    console.log(`Ensuring database '${dbConfig.name}' exists...`);
    await serverConn.query(
      `CREATE DATABASE IF NOT EXISTS \`${dbConfig.name}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;`,
    );

    await serverConn.changeUser({ database: dbConfig.name });

    // 1. Migrations
    const [userTableRows] =
      await serverConn.query<mysql.RowDataPacket[]>(`SHOW TABLES LIKE 'users';`);
    if (userTableRows.length === 0) {
      console.log("Applying migration: 001_create_users.sql...");
      const sql = readFileSync(
        resolve(rootDir, "database/migrations/001_create_users.sql"),
        "utf-8",
      );
      await serverConn.query(sql);
      console.log("Created table 'users'.");
    } else {
      console.log("Table 'users' already exists.");
    }

    const [auditTableRows] = await serverConn.query<mysql.RowDataPacket[]>(
      `SHOW TABLES LIKE 'audit_logs';`,
    );
    if (auditTableRows.length === 0) {
      console.log("Applying migration: 002_create_audit_logs.sql...");
      const sql = readFileSync(
        resolve(rootDir, "database/migrations/002_create_audit_logs.sql"),
        "utf-8",
      );
      await serverConn.query(sql);
      console.log("Created table 'audit_logs'.");
    } else {
      console.log("Table 'audit_logs' already exists.");
    }

    // 2. Seeds
    const [userCountRows] = await serverConn.query<mysql.RowDataPacket[]>(
      `SELECT COUNT(*) AS count FROM users;`,
    );
    const userCount = Number(userCountRows[0]?.count ?? 0);

    if (userCount === 0) {
      console.log("Seeding test users: 001_seed_users.sql...");
      const userSeeds = readFileSync(
        resolve(rootDir, "database/seeds/001_seed_users.sql"),
        "utf-8",
      );
      await serverConn.query(userSeeds);

      console.log("Seeding initial audit logs: 002_seed_audit_logs.sql...");
      const auditSeeds = readFileSync(
        resolve(rootDir, "database/seeds/002_seed_audit_logs.sql"),
        "utf-8",
      );
      await serverConn.query(auditSeeds);
      console.log("Database seeded successfully.");
    } else {
      console.log(
        `Database already contains ${userCount} users. Ensuring admin password is set to 'admin123'...`,
      );
      const adminHash = "$2b$10$bDzoIWeDrbmZQOkiBR1Lregzc7JBBvosMoMcdsuMB08Ag7SqBXB5e";
      await serverConn.query(
        `UPDATE users SET password_hash = ? WHERE email = 'admin@pharmasense.local';`,
        [adminHash],
      );
    }

    console.log("\n[SUCCESS] PharmaSense database is ready!");
    console.log("Default admin login credentials:");
    console.log("  Username: admin  (or admin@pharmasense.local)");
    console.log("  Password: admin123\n");
  } finally {
    await serverConn.end();
  }
}

// Execute when invoked directly
if (process.argv[1] && resolve(process.argv[1]) === resolve(__filename)) {
  setupDatabase().catch((error) => {
    console.error("Database setup failed:", error);
    process.exit(1);
  });
}
