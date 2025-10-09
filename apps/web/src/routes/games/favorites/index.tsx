import { createFileRoute } from "@tanstack/react-router";
import z from "zod";
import GameList from "../../../components/gameList";

export const Route = createFileRoute("/games/favorites/")({
  component: RouteComponent,
  // ! Hardcoded on .lte(), better make it automated.
  validateSearch: z.object({ pageIndex: z.number().gte(1).lte(21).catch(1) }),
});

function RouteComponent() {
  const { pageIndex } = Route.useSearch();
  const gameNameList = [""];
  return (
    <div>
      <GameList pageIndex={pageIndex} gameNameList={gameNameList}></GameList>
    </div>
  );
}
