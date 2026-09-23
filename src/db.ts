import "dotenv/config";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env["DATABASE_URL"] });

// Purpose — one shared Prisma Client instance for the whole app, so we don't open a new database connection every time
export const db = new PrismaClient({ adapter });
