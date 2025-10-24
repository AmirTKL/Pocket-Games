import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { hideBackButton, on, showBackButton } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import Layout from "../../components/layout";
import { useQuery } from "@tanstack/react-query";
import { getTopPlaytimesQueryOptions } from "../../queries/games.queries";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();
  const topPlaytimes = useQuery(getTopPlaytimesQueryOptions());
  const sortedPlaytimes = topPlaytimes.data?.sort((a, b) => {
    return Number(b.playtime) - Number(a.playtime);
  });

  useEffect(() => {
    showBackButton();
    on("back_button_pressed", () => {
      hideBackButton();
      navigate({ to: "/" });
    });
  }, []);
  return (
    <div>
      <Layout children></Layout>
      <div className="flex flex-col m-3 items-center text-center gap-5 font-bold">
        <div>Most Played Games:</div>
        <ol className="font-normal">
          {sortedPlaytimes?.map((gameinfo) => {
            if (gameinfo && gameinfo.game) {
              function playtime() {
                const playtimeSeconds = Number(gameinfo.playtime);
                if (playtimeSeconds < 60) {
                  return "< 1min";
                } else if (playtimeSeconds < 3600) {
                  return (playtimeSeconds / 60).toString() + "min";
                } else {
                  return (
                    Math.floor(playtimeSeconds / 3600).toString() +
                    "hrs " +
                    Math.floor((playtimeSeconds % 3600) / 60).toString() +
                    "min"
                  );
                }
              }
              return (
                <Link className=""
                  key={gameinfo.game}
                  to="/games/$gameName"
                  params={{ gameName: gameinfo.game }}
                  search={{ lastPage: "/profile"}}
                >
                  <li>
                    {gameinfo.game.charAt(0).toUpperCase() +
                      gameinfo.game.slice(1)}
                    : <span className="font-black">{playtime()}</span>
                  </li>
                </Link>
              );
            } else {
              return <li>Error</li>;
            }
          })}
        </ol>
      </div>
    </div>
  );
}
