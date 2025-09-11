import { mysqlTable, serial, varchar, text, timestamp } from "drizzle-orm/mysql-core";

export const todos = mysqlTable("Todo", {   
  id: serial("id").primaryKey(),
  title: varchar("title", { length: 200 }).notNull(),
  description: text("description"),
  created_at: timestamp("created_at").defaultNow().notNull(),
  updated_at: timestamp("updated_at").defaultNow().onUpdateNow().notNull(),
});

