import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import * as schema from "./schema"; // import toàn bộ schema

// Kiểm tra biến môi trường
if (!process.env.DATABASE_URL) {
  throw new Error("❌ DATABASE_URL is not set in .env.local");
}

// Dùng connection pool để ổn định
const pool = mysql.createPool(process.env.DATABASE_URL);

// Xuất Drizzle ORM instance
export const db = drizzle(pool, { schema, mode: "default" });
