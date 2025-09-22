import {
  createHonoMutationOptions,
  //   createHonoQueryOptions,
} from "@reno-stack/hono-react-query";
import { client } from "../utils/hono-client";

// export const notesQueryOptions = createHonoQueryOptions(
//   ["notes"],
//   client.notes.$get
// );

// export const noteByIdQueryOptions = createHonoQueryOptions(
//   ({ param: { id } }) => ["notes", id],
//   client.notes[":id"].$get
// );

export const createNoteMutationOptions = createHonoMutationOptions(
  client.api.initdataraw.$post
);
