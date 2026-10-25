# Database schema (Sprint 1)

This document describes the MySQL 8 database schema implemented for **Sprint 1: Authentication and Account Management** in PharmaSense.

The schema design aligns directly with:

- The Unit Test Cases defined in `UT.xlsx` (Sheets: `Login`, `Logout`, `Role-Based Access`, `Account Management`, `Add User`, `Activate-Deactivate`).
- The Entity Relationship Diagram (Figure 5, page 49) and requirements (Sections 4.2.2, 4.9, 5.3) of `Capstone_Paper_G17.pdf`.
- The database standards documented in [database/README.md](../database/README.md).

---

## Sprint 1 Scope

Sprint 1 focuses exclusively on identity, access control, and auditing. The tables created for this sprint are:

1. `users`: Stores user identity, authentication credentials (salted cryptographic hash), role assignment, contact information, and account status.
2. `audit_logs`: Records security and operational events (logins, failed attempts, user provisioning, account activations/deactivations) with attribution, timestamp, and client metadata.

Subsequent sprints will introduce inventory batches, point-of-sale transactions, expenses, and settings without requiring modifications to the Sprint 1 core tables.

---

## Entity Relationship Diagram (Sprint 1)

```text
+-------------------------------------------------------------+
|                            users                            |
+-------------------------------------------------------------+
| PK id            INT UNSIGNED NOT NULL AUTO_INCREMENT       |
|    first_name    VARCHAR(100) NOT NULL                      |
|    last_name     VARCHAR(100) NOT NULL                      |
|    email         VARCHAR(255) NOT NULL UNIQUE               |
|    phone         VARCHAR(20)  NOT NULL                      |
|    role          ENUM('Administrator',                      |
|                       'Cashier/Pharmacist',                 |
|                       'Inventory Manager') NOT NULL         |
|    password_hash VARCHAR(255) NOT NULL                      |
|    profile_pic   VARCHAR(255) NULL                          |
|    status        ENUM('Active', 'Inactive') NOT NULL        |
|    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIME... |
|    updated_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIME... |
+-------------------------------------------------------------+
                               | 1
                               |
                               | 0..*
+-------------------------------------------------------------+
|                         audit_logs                          |
+-------------------------------------------------------------+
| PK id            INT UNSIGNED NOT NULL AUTO_INCREMENT       |
| FK user_id       INT UNSIGNED NULL                          |
|    action        VARCHAR(50)  NOT NULL                      |
|    module        VARCHAR(50)  NOT NULL                      |
|    record_id     VARCHAR(100) NULL                          |
|    description   VARCHAR(500) NOT NULL                      |
|    ip_address    VARCHAR(45)  NULL                          |
|    device        VARCHAR(255) NULL                          |
|    created_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIME... |
+-------------------------------------------------------------+
```

---

## Data Dictionary

### Table: `users`

Stores pharmacy staff accounts provisioned by the Administrator.

| Column          | Type                                                               | Nullable | Default                                         | Description                                                   |
| --------------- | ------------------------------------------------------------------ | -------- | ----------------------------------------------- | ------------------------------------------------------------- |
| `id`            | `INT UNSIGNED`                                                     | No       | Auto increment                                  | Primary key.                                                  |
| `first_name`    | `VARCHAR(100)`                                                     | No       | None                                            | Employee first name.                                          |
| `last_name`     | `VARCHAR(100)`                                                     | No       | None                                            | Employee last name.                                           |
| `email`         | `VARCHAR(255)`                                                     | No       | None                                            | Unique login email address.                                   |
| `phone`         | `VARCHAR(20)`                                                      | No       | None                                            | Contact phone number (numeric format).                        |
| `role`          | `ENUM('Administrator', 'Cashier/Pharmacist', 'Inventory Manager')` | No       | None                                            | Role assigned for Role-Based Access Control (RBAC).           |
| `password_hash` | `VARCHAR(255)`                                                     | No       | None                                            | Salted cryptographic password hash (e.g. bcrypt).             |
| `profile_pic`   | `VARCHAR(255)`                                                     | Yes      | `NULL`                                          | Relative path or URL to profile avatar image.                 |
| `status`        | `ENUM('Active', 'Inactive')`                                       | No       | `'Active'`                                      | Account state; inactive accounts are blocked from logging in. |
| `created_at`    | `TIMESTAMP`                                                        | No       | `CURRENT_TIMESTAMP`                             | Account creation timestamp.                                   |
| `updated_at`    | `TIMESTAMP`                                                        | No       | `CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP` | Account last modification timestamp.                          |

#### Keys and Indexes (`users`)

- `PRIMARY KEY (id)`
- `UNIQUE KEY uq_users_email (email)`
- `INDEX idx_users_role (role)`: Optimizes filtering by role in the Account Management table.
- `INDEX idx_users_status (status)`: Accelerates active/inactive status lookups.

---

### Table: `audit_logs`

Provides an immutable audit trail for security-sensitive actions and authentication events.

| Column        | Type           | Nullable | Default             | Description                                                                         |
| ------------- | -------------- | -------- | ------------------- | ----------------------------------------------------------------------------------- |
| `id`          | `INT UNSIGNED` | No       | Auto increment      | Primary key.                                                                        |
| `user_id`     | `INT UNSIGNED` | Yes      | `NULL`              | Foreign key referencing `users(id)`. Null for unauthenticated attempts.             |
| `action`      | `VARCHAR(50)`  | No       | None                | Event action code (e.g. `LOGIN`, `LOGIN_FAILED`, `CREATE_USER`, `DEACTIVATE_USER`). |
| `module`      | `VARCHAR(50)`  | No       | None                | System module name (e.g. `Authentication`, `Account Management`).                   |
| `record_id`   | `VARCHAR(100)` | Yes      | `NULL`              | Identifier of affected record (e.g. created/updated user ID).                       |
| `description` | `VARCHAR(500)` | No       | None                | Human-readable explanation of the action and attribution.                           |
| `ip_address`  | `VARCHAR(45)`  | Yes      | `NULL`              | Client IPv4 or IPv6 address.                                                        |
| `device`      | `VARCHAR(255)` | Yes      | `NULL`              | Client user agent or device descriptor.                                             |
| `created_at`  | `TIMESTAMP`    | No       | `CURRENT_TIMESTAMP` | Log creation timestamp.                                                             |

#### Keys and Constraints (`audit_logs`)

- `PRIMARY KEY (id)`
- `CONSTRAINT fk_audit_logs_user_id FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE SET NULL ON UPDATE CASCADE`: Ensures audit records are preserved even if a user record is modified or archived.
- `INDEX idx_audit_logs_user_id (user_id)`: Speeds up user-specific activity history.
- `INDEX idx_audit_logs_action (action)`: Supports filtering by event type.
- `INDEX idx_audit_logs_module (module)`: Supports audit queries per functional module.
- `INDEX idx_audit_logs_created_at (created_at)`: Optimizes chronological audit trail searches.

---

## Mapping to Requirements and Test Cases

| Requirement / Test Case       | Source                                                                         | Implementation Detail                                                                                                             |
| ----------------------------- | ------------------------------------------------------------------------------ | --------------------------------------------------------------------------------------------------------------------------------- |
| **No self-registration**      | `UT.xlsx` Sheet 2 (B43), Capstone REQ-5.5-4                                    | Accounts are created strictly via Admin Account Management.                                                                       |
| **Role-Based Access Control** | `UT.xlsx` Sheet 4, Capstone REQ-5.3-2                                          | `users.role` ENUM enforces the 3 defined roles (`Administrator`, `Cashier/Pharmacist`, `Inventory Manager`).                      |
| **Salted password hashing**   | `UT.xlsx` Sheet 2 (B44), Capstone REQ-5.3-3                                    | `users.password_hash` stores 60-character bcrypt salted hashes. Plain text passwords are never stored.                            |
| **Account deactivation**      | `UT.xlsx` Sheet 2 (B40), Sheet 7 (B10-B28)                                     | `users.status` toggle (`Active` / `Inactive`). Inactive users cannot authenticate. Deactivated records are retained for auditing. |
| **Unique email**              | `UT.xlsx` Sheet 6 (B40)                                                        | `UNIQUE KEY uq_users_email` prevents duplicate registrations.                                                                     |
| **Numeric phone**             | `UT.xlsx` Sheet 6 (B24, B41)                                                   | `users.phone` stores employee contact number with numeric format validation enforced at application layer.                        |
| **Audit trail logging**       | `UT.xlsx` Sheet 2 (B45), Sheet 6 (B51), Sheet 7 (B18, B27), Capstone REQ-4.9-1 | `audit_logs` captures logins, blocked attempts, user creations, activations, and deactivations.                                   |

---

## File Structure

```text
database/
├── README.md
├── migrations/
│   ├── 001_create_users.sql
│   └── 002_create_audit_logs.sql
└── seeds/
    ├── 001_seed_users.sql
    └── 002_seed_audit_logs.sql
```

---

## Applying Migrations and Seeds

### Applying via MySQL CLI

1. Ensure the MySQL database exists:

   ```sql
   CREATE DATABASE pharmasense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

2. Run migrations in order:

   ```bash
   mysql -u <user> -p pharmasense < database/migrations/001_create_users.sql
   mysql -u <user> -p pharmasense < database/migrations/002_create_audit_logs.sql
   ```

3. (Optional) Run seed data for local development and testing:
   ```bash
   mysql -u <user> -p pharmasense < database/seeds/001_seed_users.sql
   mysql -u <user> -p pharmasense < database/seeds/002_seed_audit_logs.sql
   ```
