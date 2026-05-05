# Migrations (Supabase)

This file explains how to run the SQL migrations in `lgu-risk-scanner/supabase/migrations` against your Supabase Postgres database.

Local (PowerShell)

1. Install `psql` (Postgres client) if not already installed.
2. From the repo root run:

```powershell
# set password in env for the command (do NOT commit)
# $env:PGPASSWORD = 'your-db-password'
# or pass -Password to the script

# Example using environment variables
$env:DATABASE_URL = 'postgresql://postgres@db.jobekvpcjtumaapsxcms.supabase.co:5432/postgres'
$env:PGPASSWORD = 'HACKATHONABC'

# Run the helper which applies all migrations in order
powershell -File lgu-risk-scanner/scripts/run_migrations.ps1
```

Direct psql (one-off)

```powershell
$env:PGPASSWORD = 'HACKATHONABC'
psql 'postgresql://postgres@db.jobekvpcjtumaapsxcms.supabase.co:5432/postgres' -f lgu-risk-scanner/supabase/migrations/001_init.sql
```

CI (GitHub Actions) example

```yaml
name: Apply DB Migrations
on: [workflow_dispatch]
jobs:
  migrate:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Install psql
        run: sudo apt-get update && sudo apt-get install -y postgresql-client
      - name: Apply migrations
        env:
          DATABASE_URL: ${{ secrets.DATABASE_URL }}
          PGPASSWORD: ${{ secrets.DB_PASSWORD }}
        run: |
          for f in lgu-risk-scanner/supabase/migrations/*.sql; do
            psql "$DATABASE_URL" -f "$f" || exit 1
          done
```

Security notes
- Never commit secrets. Use repository secrets (GitHub) or environment variables.
- The repository `.gitignore` now excludes common local credential files; verify your local machines do not accidentally commit `.env` with secrets.