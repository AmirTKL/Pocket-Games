import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";
import {
  addFavoriteMutationOptions,
  getGamesQueryOptions,
  getHighscoresQueryOptions,
} from "../queries/games.queries";
import { useEffect, useState } from "react";
import { hideBackButton, on, showBackButton } from "@telegram-apps/sdk-react";
import { Star } from "lucide-react";

export default function GameList({
  pageIndex,
  perPage,
  baseUrl,
}: {
  pageIndex: number;
  perPage: number;
  baseUrl: "/games/favorites" | "/games";
}) {
  const BASE_URL = "/telegram-miniapp-bot/";
  const numsPerGroup = perPage;
  const [isFavorite, setIsFavorite] = useState(false);
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addFavoriteMutation = useMutation(addFavoriteMutationOptions());
  const gamesQuery = useQuery(getGamesQueryOptions());
  const highScoresQuery = useQuery(getHighscoresQueryOptions());

  const maxPages =
    gamesQuery.data &&
    Math.ceil(gamesQuery.data.metadata.total[0].count / numsPerGroup);
  const maxFavoritePages =
    gamesQuery.data &&
    Math.ceil(gamesQuery.data.data.favoriteGames.length / numsPerGroup);
  function turnImagesOff() {
    const oldPageImages = document.getElementsByTagName("img");
    console.log(oldPageImages);
    for (let i = 0; i < oldPageImages.length; i++) {
      const image = oldPageImages[i];
      console.log(image.src);
      image.src = "";
      console.log(image.src);
    }
  }
  useEffect(() => {
    if (highScoresQuery.data) {
      highScoresQuery.data.map((highscore) => {
        if (highscore.score) {
          const localStorageKey = `crisp-game-${highscore.gameId}`;
          localStorage.setItem(localStorageKey, highscore.score.toString());
        }
      });
    }
  }, [highScoresQuery]);
  useEffect(() => {
    showBackButton();
    on("back_button_pressed", () => {
      turnImagesOff();
      hideBackButton();
      navigate({ to: "/" });
    });
  }, []);
  if (gamesQuery.data) {
    if (isFavorite && gamesQuery.data.data.favoriteGames.length === 0) {
      return (
        <div className="flex flex-col text-center text-2xl p-5 font-bold">
          Your favorites page is empty! <br /> <br />{" "}
          <Link className="underline" to="/games" search={{ pageIndex: 1 }}>
            You can assign games as your Favorite by pressing the star on their
            right.
          </Link>
        </div>
      );
    } else if (!isFavorite && maxPages === 0) {
      return (
        <div className="flex flex-col text-center text-2xl p-5 font-bold">
          This page isn't supposed to be empty. Please refresh/restart the app.
        </div>
      );
    }
    if (
      (isFavorite && maxFavoritePages && pageIndex > maxFavoritePages) ||
      (!isFavorite && maxPages && pageIndex > maxPages)
    ) {
      navigate({ to: baseUrl, search: { pageIndex: maxFavoritePages } });
    }
    const gameList = new Array(isFavorite ? maxFavoritePages : maxPages)
      .fill("")
      .map((_, i) => {
        if (isFavorite) {
          console.log(isFavorite);
          return gamesQuery.data.data.favoriteGames.slice(
            i * numsPerGroup,
            (i + 1) * numsPerGroup
          );
        } else {
          console.log(isFavorite);
          return gamesQuery.data.data.gamesList.slice(
            i * numsPerGroup,
            (i + 1) * numsPerGroup
          );
        }
      });
    console.log(gameList);
    return (
      <div className="">
        <div className="m-5 mb-2 flex text-center justify-center">
          <button
            className={`${isFavorite ? "bg-amber-900/50" : ""} rounded-full p-2 hover:text-amber-400`}
            onClick={async () => {
              if (maxFavoritePages && pageIndex > maxFavoritePages) {
                await navigate({
                  to: baseUrl,
                  search: { pageIndex: maxFavoritePages },
                });
              }
              isFavorite ? setIsFavorite(false) : setIsFavorite(true);
            }}
          >
            <Star fill={`${isFavorite ? "gold" : undefined}`}></Star>
          </button>
          {/* Make the pagination better -> let the user jump high numbers (predescribed jumps and/or input jumps) */}
        </div>
        <div className="text-center grid grid-cols-2">
          {gameList[pageIndex - 1].map(({ game }) => {
            if (game) {
              const gameTitle = game.charAt(0).toUpperCase() + game.slice(1);
              const isFavorite = gamesQuery.data.data.favoriteGames.some(
                (favorite) => {
                  return favorite.game === game;
                }
              );

              return (
                <div
                  key={game}
                  className=" m-2 flex flex-col rounded-t-2xl overflow-hidden rounded-b-xs bg-gray-800 border border-gray-700"
                >
                  <button
                    className="flex flex-col rounded-t-2xl hover:bg-gray-800"
                    onClick={() => {
                      turnImagesOff();
                      if (!game) return;

                      navigate({
                        to: "/games/$gameName",
                        params: { gameName: game },
                        search: { pageIndex, lastPage: baseUrl },
                      });
                    }}
                  >
                    <div className="w-full h-20">
                      <img
                        className="w-full h-full object-cover"
                        src={`${BASE_URL}docs/${game}/screenshot.gif`}
                      />
                    </div>
                  </button>
                  <div className="flex items-center justify-between py-1.5 px-2.5">
                    <h3 className="m-0 font-semibold cursor-default">
                      {gameTitle}
                    </h3>
                    <button
                      onClick={async () => {
                        queryClient.setQueryData(
                          getGamesQueryOptions().queryKey,
                          (data) => {
                            if (!data) {
                              return undefined;
                            }
                            if (isFavorite) {
                              console.log(data);
                              console.log({
                                ...data,
                                data: {
                                  ...data.data,
                                  favoriteGames: data.data.favoriteGames.filter(
                                    (favoriteGame) => {
                                      favoriteGame.game !== game;
                                    }
                                  ),
                                },
                              });
                              return {
                                ...data, //Metadata
                                data: {
                                  ...data?.data, // Gameslist
                                  favoriteGames: data.data.favoriteGames.filter(
                                    (favoriteGame) => {
                                      return favoriteGame.game !== game;
                                    }
                                  ),
                                },
                              };
                            } else {
                              return {
                                ...data, //Metadata
                                data: {
                                  ...data?.data, // Gameslist
                                  favoriteGames: [
                                    ...(data?.data.favoriteGames ?? []),
                                    { game },
                                  ],
                                },
                              };
                            }
                          }
                        );
                        addFavoriteMutation.mutate({
                          param: { id: gameTitle.toLowerCase() },
                        });
                      }}
                    >
                      <Star
                        className={` ${isFavorite ? "favorite-animation fill-amber-500 stroke-amber-500" : "stroke-amber-500"}`}
                      ></Star>
                    </button>
                  </div>
                </div>
              );
            } else {
              throw new Error(
                `"Game" is null! This is not supposed to happen.`
              );
            }
          })}
        </div>
        <div className="flex flex-row p-2 text-center w-full gap-5 sticky items justify-center bottom-0 bg-gray-950/80">
          <div className="flex-auto">
            <button
              className={`font-bold p-1.5 rounded-xl bg-gray-800 hover:bg-gray-600 active:bg-gray-500 disabled:bg-black disabled:text-gray-600`}
              disabled={pageIndex === 1 ? true : false}
              onClick={() => {
                turnImagesOff();
                navigate({
                  to: baseUrl,
                  search: { pageIndex: pageIndex - 1 },
                });
              }}
            >
              Prev Page
            </button>
          </div>
          <div className="text-white font-bold">
            {pageIndex} of {isFavorite ? maxFavoritePages : maxPages}
          </div>
          <div className="flex-auto">
            <button
              className={`font-bold p-1.5 rounded-xl bg-gray-800 hover:bg-gray-600 active:bg-gray-500 disabled:bg-black disabled:text-gray-600`}
              disabled={
                isFavorite
                  ? pageIndex === maxFavoritePages
                    ? true
                    : false
                  : pageIndex === maxPages
                    ? true
                    : false
              }
              onClick={() => {
                turnImagesOff();
                navigate({
                  to: baseUrl,
                  search: { pageIndex: pageIndex + 1 },
                });
              }}
            >
              Next Page
            </button>
          </div>
        </div>
      </div>
    );
  } else {
    return <div className="text-4xl text-center font-bold">Loading...</div>;
  }
}
