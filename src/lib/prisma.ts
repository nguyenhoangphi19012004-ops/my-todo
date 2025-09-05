//Tạo một PrismaClient duy nhất trong toàn bộ project (singleton).
// Tránh lỗi tạo quá nhiều kết nối tới database khi server hot-reload trong lúc dev.

import { PrismaClient } from "@prisma/client";

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  new PrismaClient({
    log: ["query"],
  });

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

