import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";
import mariadb from "mariadb";

const globalForPrisma = globalThis;

const poolConfig = {
  host: '127.0.0.1',
  port: 3306,
  user: 'root',
  password: '',
  database: 'bouaziz_agri',
  connectionLimit: 10,
};
const adapter = new PrismaMariaDb(poolConfig);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
