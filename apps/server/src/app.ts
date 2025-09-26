import { Hono } from "hono";

import { cors } from "hono/cors";
import { env } from "../env";
import { db } from "./db";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import {
  isAuthDateInvalidError,
  isSignatureInvalidError,
  parse,
  validate,
  isExpiredError,
} from "@telegram-apps/init-data-node";
import { user } from "./db/schema";

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
  .use(
    // zValidator("header", z.object({ Authorization: z.string() })),
    async (c, next) => {
      const authorizationHeader = c.req.header().authorization;
      const [authType, authData] = authorizationHeader.split(" ");
      try {
        validate(authData, process.env.BOT_TOKEN!);
        const parsedInitData = parse(authData);
        console.log(parsedInitData);
      } catch (e) {
        // if (isAuthDateInvalidError(e)) {
        //   console.log("Auth date invalid");
        // } else if (isSignatureInvalidError(e)) {
        //   console.log("Sign invalid");
        // } else if (isExpiredError(e)) {
        //   console.log("Expired init data");
        // }
        console.log(e);
        return;
      }
      await next();
    }
  )
  .use(
    // zValidator("header", z.object({ userId: z.number() })),
    async (c, next) => {
      const userId = Number(c.req.header().userid);
      await db.insert(user).values({ userId }).onConflictDoNothing();
      await next();
    }
  )
  .post(
    "/api/submitscore",
    zValidator(
      "json",
      z.object({ gameName: z.string(), highscore: z.number() })
    ),
    async (c) => {
      const { gameName, highscore } = c.req.valid("json");
      console.log(gameName);
      console.log(highscore);
      return c.json({ message: "Hey fuck you, you hear me? Fuck you." }, 200);
    }
  );
export default app;

export type AppType = typeof app;
