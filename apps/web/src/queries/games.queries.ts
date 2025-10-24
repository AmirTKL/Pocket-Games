import {
  createHonoMutationOptions,
  createHonoQueryOptions,
} from "@reno-stack/hono-react-query";
import { client } from "../utils/hono-client";

export const getGamesQueryOptions = createHonoQueryOptions(
  ["games"],
  client.api.games.$get
);

export const getHighscoresQueryOptions = createHonoQueryOptions(
  ["highscores"],
  client.api.fetchscores.$get
);

export const getTopPlaytimesQueryOptions = createHonoQueryOptions(
  ["topplaytimes"],
  client.api.topplaytimes.$get
);

export const getRecentGamesQueryOptions = createHonoQueryOptions(
  ["recentgames"],
  client.api.recentgames.$get
);

export const addFavoriteMutationOptions = createHonoMutationOptions(
  client.api.setfavorite[":id"].$post
);

export const submitHighscoreMutationoptions = createHonoMutationOptions(
  client.api.submitscore.$post
);

export const addPlayTimeMutationOptions = createHonoMutationOptions(
  client.api.playtimeping.$post
);

export const insertDefaulyValuesMutationOptions = createHonoMutationOptions(
  client.api.defaultusergameinfo.$post
);

// export const noteByIdQueryOptions = createHonoQueryOptions(
//   ({ param: { id } }) => ["notes", id],
//   client.notes[":id"].$get
// );
