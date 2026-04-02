#!/usr/bin/env bash
set -euo pipefail

echo "This script will run prisma migrate resolve --applied for the baseline migration and then prisma migrate deploy"
echo "Make sure you have set DATABASE_URL in your environment before running."

npx prisma migrate resolve --applied "20260329120000_init"
npx prisma migrate deploy

echo "Done."
