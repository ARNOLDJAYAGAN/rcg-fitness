import pkg from "pg";
const { Pool } = pkg;

export const pool = new Pool({
  connectionString: process.env.NEON_DB_URL, // use the correct env var
  ssl: {
    rejectUnauthorized: false, // Neon requires SSL
  },
});
