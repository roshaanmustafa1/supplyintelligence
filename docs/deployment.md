# Vercel and Neon deployment

Configure these variables for each Vercel environment you deploy:

| Variable | Value |
| --- | --- |
| `AUTH_SECRET` | A private, randomly generated authentication secret |
| `DATABASE_URL` | Neon pooled PostgreSQL connection string |
| `DATABASE_URL_UNPOOLED` | Neon direct connection string, used for migrations |
| `ADMIN_EMAIL` | Email address for the first dashboard administrator |
| `ADMIN_PASSWORD` | A private password of at least 12 characters, at most 72 UTF-8 bytes |

Neon's Vercel integration normally supplies both database variables. If the direct URL is missing, obtain it from Neon's Connect panel with connection pooling disabled. Never put connection strings or passwords in Git.

Push the updated source to the deployment branch. `vercel.json` selects `npm run vercel-build`, which generates the PostgreSQL client, applies pending migrations, creates the administrator, and builds Next.js. If Vercel has a dashboard Build Command override, set it to `npm run vercel-build` as well.

Sign in with `ADMIN_EMAIL` and `ADMIN_PASSWORD` after deployment succeeds. Existing accounts and passwords are not changed on later deployments. After the first administrator is created, both admin variables may be removed together; setup then requires an existing active super administrator. Changing these variables does not reset an existing password.

This migration initializes a new PostgreSQL database. It does not transfer records from SQLite. The old schema and migrations are retained under `prisma/archive/sqlite/`, and the local `prisma/dev.db` is left untouched. Existing SQLite records need a separate data transfer if they must be retained.

Local development also uses PostgreSQL now. Put the pooled and direct URLs for a separate development database in `.env`, then run `npm run db:generate` and `npm run db:migrate`. Do not point development migrations at the production database.

The old `db:seed` script contains demo data and a fixed demo password; it is not part of the deployment flow. Use `db:admin` for production account setup. When running `db:admin` outside Vercel, supply the variables through your shell or Node's `--env-file` option.
