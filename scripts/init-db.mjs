// Run once after connecting your Postgres database:
//   npm run db:init
// This creates the tables the site needs. Safe to run more than once.
import { ensureSchema } from '../lib/db.js';

async function main() {
  console.log('Creating tables if they do not exist...');
  await ensureSchema();
  console.log('Done. Your database is ready.');
  process.exit(0);
}

main().catch((err) => {
  console.error('Failed to initialize database:', err);
  process.exit(1);
});
