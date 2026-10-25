# Database

This directory contains the version-controlled MySQL 8 schema migrations and synthetic seed data
for PharmaSense. Sprint 1 implements authentication and account management (`users` and `audit_logs`).

> This guide covers database plans and standards. See [CONTRIBUTING.md](../CONTRIBUTING.md) for
> contribution and review workflow. Detailed table definitions and test case mappings are in
> [docs/database-schema.md](../docs/database-schema.md). How the API uses the database is in
> the [backend guide](../backend/README.md).

## Directory layout

| Directory     | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `migrations/` | Ordered schema changes for tables, relationships, and indexes. |
| `seeds/`      | Synthetic records for local development and tests.             |

Use migrations to keep schema changes reproducible across the team's environments.

Never commit real pharmacy records, employee data, database exports, or backups. Keep backups in the ignored root `backups/` directory.

## Current status

Done:

- The folder structure, ignore rules for backups and local data, and database coding conventions.
- Sprint 1 executable schema migrations: `001_create_users.sql` and `002_create_audit_logs.sql`.
- Sprint 1 synthetic seeds: `001_seed_users.sql` and `002_seed_audit_logs.sql`.
- Table design and data dictionary documented in [docs/database-schema.md](../docs/database-schema.md).

Planned for future sprints:

- Sprint 2 tables: inventory batches, product catalog, stock receipts, and POS transactions.
- Sprints 3 & 4 tables: expenses, cheque tracker, attendance records, and system settings.
- Backend automated migration runner tool integration.

## Planned (not yet available): Local database setup

The following database provisioning steps describe a future setup; do not treat them as a working
application setup yet. No backend database connection, migrations, or seed scripts are implemented.
When they are available, install **MySQL 8**, create an empty database and a dedicated user, and do
not use `root` for the application.

```sql
CREATE DATABASE pharmasense CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'pharmasense_user'@'localhost' IDENTIFIED BY '<choose-a-strong-password>';
GRANT ALL PRIVILEGES ON pharmasense.* TO 'pharmasense_user'@'localhost';
```

Store connection details in a local `backend/.env` when environment configuration is implemented.
There is no `backend/.env.example` yet. Real `.env` files must never be committed.

| Variable      | Description                  |
| ------------- | ---------------------------- |
| `DB_HOST`     | MySQL host.                  |
| `DB_PORT`     | MySQL port (default `3306`). |
| `DB_NAME`     | Database name.               |
| `DB_USER`     | Database user.               |
| `DB_PASSWORD` | Database password.           |

These proposed commands do not exist yet and are not runnable:

```sh
npm run migrate
npm run seed
```

## Planned (not yet available): Run commands

> These script names are proposals. They are added to `package.json` when the matching code exists.

| Command           | Purpose                                           | Status  |
| ----------------- | ------------------------------------------------- | ------- |
| `npm run migrate` | Apply pending migrations in order.                | Planned |
| `npm run seed`    | Load synthetic seed data into the development DB. | Planned |

## Planned conventions: Migrations

A migration is a numbered file that changes the schema in one small, ordered step.

- **File naming (proposal):** a zero-padded sequence number, then a snake_case description: `001_create_products.sql`, `002_create_stock_batches.sql`, `003_add_expiry_index_to_stock_batches.sql`. If the chosen tool generates timestamps instead, follow the tool's format.
- **One logical change per migration.** Do not mix unrelated tables.
- **Never edit a migration that has been merged to `main`.** Add a new migration to change it. Editing history makes teammates' databases diverge.
- **Every migration must run on an empty database**, in order, from the first file to the last.
- Add a way to undo a migration (a down step or a documented reverse) if the chosen tool supports it.
- Use `utf8mb4` for tables and add foreign keys and indexes in the migration that creates the table.
- Commit the migration in the same pull request as the backend code that depends on it.
- A PR that changes the schema should say so in its summary, so reviewers check the migration carefully.

## Planned conventions: Seeds

- Seed files contain **synthetic data only**: invented products, batches, employees, and sales. Never copy real pharmacy data, even partially.
- Seeds must be safe to run on a fresh development or test database and should not assume specific auto-increment IDs.
- Include variety that helps testing: items near expiry, items below the reorder level, batches with different expiry dates for FEFO, and users with each role.
- Seed data never contains real passwords. Use clearly fake credentials and document them as development-only.
- Do not seed face images or biometric templates.

## Planned conventions: Coding standards

These conventions keep migrations and queries consistent and easy to review.

### Naming conventions

- Tables: lowercase, plural, snake_case (`products`, `stock_batches`, `cheque_tracker`).
- Columns: snake_case (`expiry_date`, `reorder_level`, `created_at`).
- Primary key is `id`; foreign keys are `<singular_table>_id` (`product_id`, `employee_id`).
- SQL keywords are uppercase in queries and migrations (`SELECT`, `FROM`, `WHERE`, `JOIN`, `CREATE TABLE`).
- Indexes and constraints use descriptive names: `idx_<table>_<column>` for indexes and `fk_<table>_<column>` for foreign keys (for example `idx_stock_batches_expiry_date`).
- Avoid names that differ only in case or by a single character.

### Formatting

- **Indentation:** 2 spaces.
- **Line length:** 100 characters maximum. Wrap long statements and column lists.
- Put one column per line in `CREATE TABLE` statements and align names, types, and trailing comments within a block where it improves readability.

```sql
CREATE TABLE stock_batches (
  id            INT UNSIGNED NOT NULL AUTO_INCREMENT,
  product_id    INT UNSIGNED NOT NULL,
  batch_number  VARCHAR(50)  NOT NULL,
  expiry_date   DATE         NOT NULL,
  quantity      INT UNSIGNED NOT NULL,
  created_at    TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  CONSTRAINT fk_stock_batches_product_id FOREIGN KEY (product_id) REFERENCES products (id),
  INDEX idx_stock_batches_expiry_date (expiry_date)
);
```

### Comments and documentation

- Every migration starts with a one-line `--` comment saying what it changes and why, unless the file name already makes it obvious.
- Comment non-obvious design choices only, for example why an index exists or why a column is nullable. Do not restate what the SQL already says.
- Document each table and its main columns in `docs/` (an ERD or schema notes) once the schema is designed.
- Never commit commented-out SQL. Delete it; Git history keeps it.

### Recommended practices

- Use `utf8mb4` and the `utf8mb4_unicode_ci` collation.
- Every table has an `id` primary key and a `created_at` timestamp. Add `updated_at` where records change.
- Use `DECIMAL` for money, never floating-point types.
- Use `DATE` for expiry dates so FEFO ordering (earliest expiry first) is simple and indexed.
- Prefer foreign keys for relationships, and decide on delete behavior deliberately.
- Keep an **audit log table** for sensitive actions (stock adjustments, price changes, voids, role changes, logins). Entries are only added, never edited or deleted through the application.
- Never store plain-text passwords. Store only hashes produced by the backend.

## Security and data handling

- The application connects with a **least-privilege user** that can access only the PharmaSense database. Do not run the app as `root`.
- Never commit credentials, real pharmacy records, employee data, exports, or backups.
- Back up the database regularly, store backups in the ignored `backups/` folder, and restrict access to them.
- Face templates and employee photos are sensitive. Keep them out of Git. If face data must be stored in the database, store only what attendance needs and restrict access.
- All queries from the backend use **parameterized queries**. Never build SQL by string concatenation.
- Production changes go through migrations, never ad hoc edits.

## Planned conventions: Testing

- Run tests against a **separate test database**, never the development or production one.
- Check that all migrations apply cleanly to an empty database from the first file to the last.
- Use seed data or fixtures to test business-critical queries: FEFO batch selection, low-stock and near-expiry reports, and sales totals.

## Contributing

Follow the contribution and review workflow in [CONTRIBUTING.md](../CONTRIBUTING.md). Repository
settings are documented in [docs/repository-settings.md](../docs/repository-settings.md).
