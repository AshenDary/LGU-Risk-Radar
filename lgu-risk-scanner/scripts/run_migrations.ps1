param(
  [string]$DbUrl = $env:DATABASE_URL,
  [string]$Password = $env:PGPASSWORD,
  [string]$MigrationsDir = "lgu-risk-scanner/supabase/migrations"
)

if (-not $DbUrl) {
  Write-Error "Provide the database URL via -DbUrl or the DATABASE_URL environment variable."
  exit 1
}

if (-not $Password) {
  Write-Error "Provide the DB password via -Password or the PGPASSWORD environment variable."
  exit 1
}

$env:PGPASSWORD = $Password

Write-Host "Applying migrations from $MigrationsDir to $DbUrl"

if (-not (Test-Path $MigrationsDir)) {
  Write-Error "Migrations directory not found: $MigrationsDir"
  exit 1
}

Get-ChildItem -Path $MigrationsDir -Filter '*.sql' | Sort-Object Name | ForEach-Object {
  Write-Host "Running migration: $($_.Name)"
  psql $DbUrl -f $_.FullName
  if ($LASTEXITCODE -ne 0) {
    Write-Error "Migration failed: $($_.Name)"
    exit $LASTEXITCODE
  }
}

Write-Host "All migrations applied successfully."
