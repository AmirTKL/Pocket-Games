// Please serve/build the server first to get the types
import { type AppType, type Client } from "@repo/server/hc";
import { hc } from "hono/client";

const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);

export const client = hcWithType("https://192.168.1.127:4173/", {
  init: { credentials: "include" },
});
