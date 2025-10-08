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
import { highscores, user } from "./db/schema";
import { and, eq } from "drizzle-orm";

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
  .use(async (c, next) => {
    const authorizationHeader = c.req.header().authorization;
    const [authType, authData] = authorizationHeader.split(" ");
    try {
      validate(authData, process.env.BOT_TOKEN!);
      const parsedInitData = parse(authData);
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
  })
  .use(async (c, next) => {
    const userId = c.req.header().userid;
    await db.insert(user).values({ userId }).onConflictDoNothing();
    await next();
  })
  .post(
    "/api/submitscore",
    zValidator(
      "json",
      z.object({ gameName: z.string(), highScore: z.number() })
    ),
    async (c) => {
      const userId = c.req.header().userid;
      const { gameName, highScore } = c.req.valid("json");
      await db
        .insert(highscores)
        .values({ userId, gameId: gameName, score: highScore })
        .onConflictDoUpdate({
          target: [highscores.userId, highscores.gameId],
          set: { score: highScore },
        });
      console.log(gameName);
      console.log(highScore);
      return c.json({ message: "Hey fuck you, you hear me? Fuck you." }, 200);
    }
  )
  .get(
    "/api/fetchscore/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const userId = c.req.header().userid;
      const { id } = c.req.valid("param");
      const highScore = await db
        .select({ highscore: highscores.score })
        .from(highscores)
        .where(and(eq(highscores.gameId, id), eq(highscores.userId, userId)));
      if (highScore[0]) {
        console.log(highScore);
        return c.json(highScore, 200);
      } else {
        console.log(
          "No score found. Setting highscore to 0! Note to self: can be done in client as well. Maybe check it twice?"
        );
        return c.json([{ highscore: 0 }], 200);
      }
    }
  );
export default app;

export type AppType = typeof app;
