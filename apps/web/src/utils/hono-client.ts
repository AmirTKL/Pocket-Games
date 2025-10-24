// Please serve/build the server first to get the types
import { type AppType, type Client } from "@repo/server/hc";
import {
  retrieveLaunchParams,
  retrieveRawInitData,
} from "@telegram-apps/sdk-react";
import { hc } from "hono/client";

const hcWithType = (...args: Parameters<typeof hc>): Client =>
  hc<AppType>(...args);

const userId = retrieveLaunchParams().tgWebAppData?.user?.id.toString()!;
console.log(userId);

const initDataRaw = retrieveRawInitData();
console.log(initDataRaw);

export const client = hcWithType("https://192.168.1.101:5173/", {
  headers: { Authorization: `tma ${initDataRaw}`, userId },
  init: { credentials: "include" },
});
