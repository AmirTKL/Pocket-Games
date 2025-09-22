import { Hono } from "hono";

import { cors } from "hono/cors";
import { env } from "../env";
import { db } from "./db";
import { usersData } from "./db/schema";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import {
  isAuthDateInvalidError,
  isSignatureInvalidError,
  parse,
  validate,
  isExpiredError,
} from "@telegram-apps/init-data-node";

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
    zValidator("header", z.object({ Authorization: z.string() })),
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
  .post(
    "/api/login",
    zValidator("json", z.object({ info: z.string() })),
    async (c) => {
      const { info } = c.req.valid("json");
      console.log("Message is " + info);
      return c.text("success", 200);
    }
  );
export default app;

export type AppType = typeof app;
