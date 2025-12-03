import pkg from "pg";
const { Pool } = pkg;

// Use your Neon database URL from .env
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false, // Neon requires SSL
  },
});
