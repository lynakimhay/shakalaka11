<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/2b1d4a98-a2a7-4e41-9892-a9844e20c16d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`

## Deploying to Vercel

1. Create a Vercel project and link it to this repository.
2. In the Vercel dashboard, set the following Environment Variables for the Production and Preview scopes:
   - `DATABASE_URL` — your Postgres connection string (e.g. `postgresql://USER:PASSWORD@HOST:PORT/DATABASE`).
   - Any other secrets your app needs.
3. Build & Output settings (Vercel default):
   - Framework Preset: Next.js
   - Build Command: `npm run build`
   - Output Directory: (leave default)

Notes on Prisma and the database:
- The `build` script runs `prisma generate` before `next build`, and `postinstall` also runs `prisma generate` so the Prisma client will be present during builds and local installs.
- Ensure `DATABASE_URL` points to a Postgres instance accessible from Vercel. If you need a hosted Postgres, consider Neon, Supabase, or Heroku Postgres.
- After deployment, if you need to apply schema changes, run migrations locally or via your CI (for production use migrations rather than `prisma db push`).

If you want, I can add a Vercel `vercel.json` or example GitHub Actions workflow to automate migration steps.
