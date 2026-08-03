import { PrismaClient } from "@prisma/client";
import { PrismaMariaDb } from "@prisma/adapter-mariadb";

const globalForPrisma = globalThis;

function getPoolConfig() {
  const dbUrl = process.env.DATABASE_URL || "mysql://root:@127.0.0.1:3306/bouaziz_agri";
  try {
    const parsed = new URL(dbUrl);
    return {
      host: parsed.hostname || "127.0.0.1",
      port: parsed.port ? parseInt(parsed.port) : 3306,
      user: decodeURIComponent(parsed.username || "root"),
      password: decodeURIComponent(parsed.password || ""),
      database: parsed.pathname ? parsed.pathname.replace(/^\//, "") : "bouaziz_agri",
      connectionLimit: 30,
      connectTimeout: 20000,
      acquireTimeout: 20000,
    };
  } catch (e) {
    return {
      host: "127.0.0.1",
      port: 3306,
      user: "root",
      password: "",
      database: "bouaziz_agri",
      connectionLimit: 30,
      connectTimeout: 20000,
      acquireTimeout: 20000,
    };
  }
}

const poolConfig = getPoolConfig();
const adapter = new PrismaMariaDb(poolConfig);

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ adapter });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
