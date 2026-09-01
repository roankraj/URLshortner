import app from './app.js';
import dotenv from 'dotenv';
import dns from 'node:dns/promises';
import mongoose from 'mongoose';

dns.setServers(['1.1.1.1']);

dotenv.config({ path: './config.env' });

const port = process.env.PORT || 8000;
const db = process.env.MONGODB_URI.replace(
  '<db_password>',
  process.env.MONGODB_PASSWORD,
).replace('<db_username>', process.env.MONGODB_USERNAME);

if (!db) {
  throw new Error('MONGO_URI is missing');
}

mongoose
  .connect(db)
  .then(() => {
    console.log('Database connected');

    app.listen(port, '0.0.0.0', () => {
      console.log(`Listening on port ${port}`);
    });
  })
  .catch((err) => {
    console.error('Database connection failed:', err.message);
    process.exit(1);
  });
