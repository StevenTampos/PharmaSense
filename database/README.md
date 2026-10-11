# Database

MySQL database source lives here.

- `migrations/`: versioned schema changes. Choose the migration tool with the backend implementation.
- `seeds/`: synthetic development or test records only.

Use migrations as the source of truth for schema changes. Do not commit real pharmacy data, employee records, database exports, or backups. Keep backups in the ignored root `backups/` directory. A `.sql` file is not automatically safe just because it belongs in this folder.

This scaffold does not create or connect to a database. Add executable migrations and setup instructions with the first database implementation.
