import { boolean, integer, pgTable, text, unique } from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  userId: text("user_id").primaryKey(),
});

export const userGameInfo = pgTable(
  "user_game_info",
  {
    userId: text("user_id").references(() => user.userId),
    gameId: text("game_id").references(() => games.id),
    score: text().default("0"),
    playtime: text(),
    favorite: boolean().default(false),
  },
  (t) => [unique().on(t.userId, t.gameId)]
);

export const games = pgTable("games", {
  id: text("game_id").primaryKey(),
  name: text().unique(),
});
