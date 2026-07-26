// Usage: node scripts/hash-password.mjs "your-chosen-password"
// Copy the output into ADMIN_PASSWORD_HASH in your environment variables.
import bcrypt from 'bcryptjs';

const password = process.argv[2];
if (!password) {
  console.error('Usage: node scripts/hash-password.mjs "your-password"');
  process.exit(1);
}

const hash = bcrypt.hashSync(password, 10);
console.log('\nADMIN_PASSWORD_HASH=' + hash + '\n');
