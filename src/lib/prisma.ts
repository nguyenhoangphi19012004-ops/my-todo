// //Tạo một PrismaClient duy nhất trong toàn bộ project (singleton).
// // Tránh lỗi tạo quá nhiều kết nối tới database khi server hot-reload trong lúc dev.

// import { PrismaClient } from "@prisma/client";

// const globalForPrisma = global as unknown as { prisma: PrismaClient };

// export const prisma =
//   globalForPrisma.prisma ||
//   new PrismaClient({
//     log: ["query"],
//   });

// if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
