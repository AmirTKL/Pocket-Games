import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import GameList from "../../../components/gameList";
// import {
//   getFavoritesQueryOptions,
// } from "../../../queries/games.queries";
// import { useQuery } from "@tanstack/react-query";

export const Route = createFileRoute("/games/favorites/")({
  component: Favorites,
  validateSearch: z.object({
    pageIndex: z.number().catch(1),
  }),
});

function Favorites() {
  const { pageIndex } = Route.useSearch();
  return (
    <div>
      <GameList
        baseUrl="/games/favorites"
        pageIndex={pageIndex}
        isFavorite={true}
        // gameNameList={favoritesQuery.data.games}
      ></GameList>
    </div>
  );
}
