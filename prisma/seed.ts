import { Prisma, PrismaClient } from "../generated/client/deno/edge.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const envVars = await config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envVars.DATABASE_URL,
    },
  },
});

const userData = [
  {
    name: "Alisce",
    email: "alsz@gg.gg",
  },
  {
    name: "Bofb",
    email: "abb@gg.gg",
  },
];

for (const u of userData) {
  const user = await prisma.user.create({
    data: u,
  });

  console.log(`Created user with id: ${user.id}`);
}
console.log("done");

await prisma.$disconnect();
