import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import GameList from "../../components/gameList";

export const Route = createFileRoute("/games/")({
  component: Games,
  validateSearch: z.object({
    pageIndex: z.number().catch(1),
    isFavorite: z.boolean().catch(false),
  }),
});

function Games() {
  const { pageIndex } = Route.useSearch();

  return (
    <div>
      <GameList
        baseUrl="/games/"
        pageIndex={pageIndex}
        perPage={16}
        setInitialFavorite={false}
        showProfile={true}
        setInitialRecent={false}
        showPagination={true}
      ></GameList>
    </div>
  );
}
