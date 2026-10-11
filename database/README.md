# Database

This directory contains the version-controlled MySQL schema and synthetic seed data for PharmaSense. It describes how the application database is created and changed, not the contents of a live pharmacy database.

## Directory layout

| Directory     | Purpose                                                        |
| ------------- | -------------------------------------------------------------- |
| `migrations/` | Ordered schema changes for tables, relationships, and indexes. |
| `seeds/`      | Synthetic records for local development and tests.             |

Use migrations to keep schema changes reproducible across the team's environments. Select the migration tool alongside the backend implementation.

Never commit real pharmacy records, employee data, database exports, or backups. Keep backups in the ignored root `backups/` directory.

Executable migrations and database setup commands have not been implemented yet.
