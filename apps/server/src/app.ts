import { Hono } from "hono";

import { cors } from "hono/cors";
import { env } from "../env";

const app = new Hono()
  // ------------------------------------------------------------
  // CORS
  // ------------------------------------------------------------
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

export default app;

export type AppType = typeof app;
