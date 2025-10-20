import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import GameList from "../../../components/gameList";

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
        perPage={8}
      ></GameList>
    </div>
  );
}
