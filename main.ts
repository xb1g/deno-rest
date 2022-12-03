import { PrismaClient } from "./generated/client/deno/edge.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/x/dotenv/mod.ts";

const envVars = await config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envVars.DATABASE_URL,
    },
  },
});

const app = new Application();
const router = new Router();

router
  .get("/", (ctx) => {
    ctx.response.body = "Hello World From Deno Edge";
  })
  .get("/users", async (ctx) => {
    const users = await prisma.user.findMany();
    ctx.response.body = users;
  })
  .get("/users/:id", async (ctx) => {
    const user = await prisma.user.findUnique({
      where: {
        id: Number(ctx.params.id),
      },
    });
    ctx.response.body = user;
  })
  .post("/user", async (ctx) => {
    const { name, email } = await ctx.request.body();
    const user = await prisma.user.create({
      data: { name, email },
    });
    ctx.response.body = user;
  })
  .delete("/user/:id", async (ctx) => {
    const user = await prisma.user.delete({
      where: {
        id: Number(ctx.params.id),
      },
    });
    ctx.response.body = user;
  });

app.use(router.routes());
app.use(router.allowedMethods());

//console.log("Server running on port 8000");
//await app.listen({ port: 8000 });

addEventListener("fetch", app.fetchEventHandler());
