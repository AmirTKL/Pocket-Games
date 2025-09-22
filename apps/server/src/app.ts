import { Hono } from "hono";

import { cors } from "hono/cors";
import { env } from "../env";
import { db } from "./db";
import { usersData } from "./db/schema";
import { zValidator } from "@hono/zod-validator";
import z from "zod";

const app = new Hono()
  .use(
    "*",
    cors({
      origin: [env.WEB_URL],
      allowHeaders: ["Content-Type", "Authorization"],
      allowMethods: ["POST", "GET", "OPTIONS"],
      exposeHeaders: ["Content-Length"],
      maxAge: 600,
      credentials: true,
    })
  )
  .post(
    "/api/initdataraw",
    zValidator("header", z.object({ Authorization: z.string() })),
    async (c) => {
      const { Authorization } = c.req.valid("header");
      const rawData = Authorization.split(" ");
      console.log(Authorization)
      console.log(rawData);
      return c.json({fucker: "FUCKYOUALL"}, 200)
    }
  );
export default app;

export type AppType = typeof app;
