<#
Migrate Resolve Script (PowerShell)
Usage (PowerShell):
  # set DATABASE_URL for this session (replace with your real connection string)
  $env:DATABASE_URL = 'postgresql://USER:PASSWORD@HOST:PORT/DATABASE'
  # run the script
  .\scripts\migrate-resolve.ps1

This script runs prisma migrate resolve --applied for the baseline migration and then prisma migrate deploy.
Make sure you DO NOT commit this file with secrets.
#>

Write-Host "Running prisma migrate resolve and deploy..."

npx prisma migrate resolve --applied "20260329120000_init"
npx prisma migrate deploy

Write-Host "Done."
