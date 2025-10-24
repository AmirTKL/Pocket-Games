import { Hono } from "hono";

import { cors } from "hono/cors";
import { env } from "../env";
import { db } from "./db";
import { zValidator } from "@hono/zod-validator";
import z from "zod";
import { parse, validate } from "@telegram-apps/init-data-node";
import { games, user, userGameInfo } from "./db/schema";
import { and, asc, count, desc, eq } from "drizzle-orm";

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
  .get("/api/games", async (c) => {
    const userId = c.req.header().userid;
    const gamesCount = await db.select({ count: count() }).from(games);
    const gamesList = await db.select({ game: games.name }).from(games);
    const favoriteGames = await db
      .select({ game: userGameInfo.gameId })
      .from(userGameInfo)
      .where(
        and(eq(userGameInfo.userId, userId), eq(userGameInfo.favorite, true))
      );
    const recentGames = await db
      .select({
        game: userGameInfo.gameId,
        lastPlayed: userGameInfo.lastPlayed,
      })
      .from(userGameInfo)
      .where(eq(userGameInfo.userId, userId))
      .orderBy(desc(userGameInfo.lastPlayed))
      .limit(4);

    return c.json(
      {
        data: { gamesList, favoriteGames, recentGames },
        metadata: {
          total: gamesCount,
        },
      },
      200
    );
  })
  .get("/api/recentgames", async (c) => {
    const userId = c.req.header().userid;
    const recentGames = await db
      .select({
        game: userGameInfo.gameId,
        lastPlayed: userGameInfo.lastPlayed,
      })
      .from(userGameInfo)
      .where(eq(userGameInfo.userId, userId))
      .orderBy(desc(userGameInfo.lastPlayed))
      .limit(4);
    return c.json(recentGames, 200);
  })
  .post(
    "/api/submitscore",
    zValidator(
      "json",
      z.object({ gameName: z.string(), highScore: z.number() })
    ),
    async (c) => {
      //validate whether the highscore is legitimately higher than the score in the database
      const userId = c.req.header().userid;
      const { gameName, highScore } = c.req.valid("json");
      await db
        .insert(userGameInfo)
        .values({ userId, gameId: gameName, score: highScore.toString() })
        .onConflictDoUpdate({
          target: [userGameInfo.userId, userGameInfo.gameId],
          set: { score: highScore.toString() },
        });
      console.log(gameName);
      console.log(highScore);
      return c.json({ message: "Hey fuck you, you hear me? Fuck you." }, 200);
    }
  )
  .get("/api/fetchscores", async (c) => {
    const userId = c.req.header().userid;
    const highScores = await db
      .select()
      .from(userGameInfo)
      .where(eq(userGameInfo.userId, userId));
    return c.json(highScores, 200);
  })
  .post(
    "/api/setfavorite/:id",
    zValidator("param", z.object({ id: z.string() })),
    async (c) => {
      const userId = c.req.header().userid;
      const { id } = c.req.valid("param");
      const isFavorite = await db
        .select({ favorite: userGameInfo.favorite })
        .from(userGameInfo)
        .where(
          and(eq(userGameInfo.gameId, id), eq(userGameInfo.userId, userId))
        );
      if (isFavorite[0] != null && isFavorite[0].favorite === true) {
        await db
          .update(userGameInfo)
          .set({ favorite: false })
          .where(
            and(eq(userGameInfo.gameId, id), eq(userGameInfo.userId, userId))
          );
      } else {
        await db
          .insert(userGameInfo)
          .values({ userId, gameId: id, favorite: true })
          .onConflictDoUpdate({
            target: [userGameInfo.userId, userGameInfo.gameId],
            set: { favorite: true },
          });
      }
      return c.json({ message: "Uh." }, 200);
    }
  )
  .post(
    "/api/playtimeping",
    zValidator("json", z.object({ id: z.string(), time: z.string() })),
    async (c) => {
      const userId = c.req.header().userid;
      const { id, time } = c.req.valid("json");
      const gamePlaytime = await db
        .select({ playtime: userGameInfo.playtime })
        .from(userGameInfo)
        .where(
          and(eq(userGameInfo.gameId, id), eq(userGameInfo.userId, userId))
        );
      await db
        .insert(userGameInfo)
        .values({ userId, gameId: id, playtime: time, lastPlayed: new Date() })
        .onConflictDoUpdate({
          target: [userGameInfo.userId, userGameInfo.gameId],
          set: {
            playtime: (
              Number(gamePlaytime[0].playtime) + Number(time)
            ).toString(),
          },
        });
      return c.json({ message: "Doune." }, 200);
    }
  )
  .post(
    "/api/defaultusergameinfo",
    zValidator("json", z.object({ id: z.string() })),
    async (c) => {
      const userId = c.req.header().userid;
      const { id } = c.req.valid("json");
      await db
        .insert(userGameInfo)
        .values({ userId, gameId: id })
        .onConflictDoNothing();
      return c.json({ message: "Erm." }, 200);
    }
  )
  .get("/api/topplaytimes", async (c) => {
    const userId = c.req.header().userid;
    const topPlaytimes = await db
      .select({ game: userGameInfo.gameId, playtime: userGameInfo.playtime })
      .from(userGameInfo)
      .where(eq(userGameInfo.userId, userId))
      .orderBy(asc(userGameInfo.playtime))
      .limit(5);
    return c.json(topPlaytimes, 200);
  });

export default app;

export type AppType = typeof app;
