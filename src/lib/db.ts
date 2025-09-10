// src/lib/db.ts
import mysql from "mysql2/promise";
import { drizzle } from "drizzle-orm/mysql2";
import { todos } from "./schema"; // import từ schema.ts

// Tạo kết nối MySQL
const connection = await mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "mysql",
  database: "my_to_do",
});

// Tạo Drizzle ORM instance
export const db = drizzle(connection);

