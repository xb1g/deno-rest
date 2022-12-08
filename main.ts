import { PrismaClient } from "./generated/client/deno/edge.ts";
import { Application, Router } from "https://deno.land/x/oak/mod.ts";
import { config } from "https://deno.land/std@0.167.0/dotenv/mod.ts";

const envVars = await config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: envVars.DATABASE_URL,
    },
  },
});

console.log(envVars)

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
    const body = await ctx.request.body("json").value;
    const user = await prisma.user.create({
      data: body,
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
