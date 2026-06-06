import 'dotenv/config';
import mongoose from 'mongoose';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.error('Missing MONGODB_URI in .env');
  process.exit(1);
}

console.log('Connecting (password hidden)...');
try {
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 20000 });
  console.log('SUCCESS: Connected to', mongoose.connection.host);
  await mongoose.disconnect();
  process.exit(0);
} catch (err) {
  console.error('FAILED:', err.message);
  console.error('\nChecklist:');
  console.error('  1. Atlas → Network Access → Add Current IP (or 0.0.0.0/0 for dev)');
  console.error('  2. Atlas → Database Access → password matches .env');
  console.error('  3. School Wi‑Fi may block port 27017 — try phone hotspot');
  console.error('  4. Atlas → Connect → Drivers → copy "connection string without SRV" into .env');
  process.exit(1);
}
