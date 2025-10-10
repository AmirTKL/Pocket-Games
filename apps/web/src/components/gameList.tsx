import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import {
  addFavoriteMutationOptions,
  getGamesQueryOptions,
} from "../queries/games.queries";
import { useEffect } from "react";
import { hideBackButton, on, showBackButton } from "@telegram-apps/sdk-react";
// import { InferResponseType } from "hono/client";
// import { client } from "../utils/hono-client";
import { Star } from "lucide-react";

export default function GameList({
  pageIndex,
  baseUrl,
  isFavorite,
  // gameNameList,
}: {
  pageIndex: number;
  baseUrl: string;
  isFavorite: boolean;
  // gameNameList: InferResponseType<
  //   (typeof client)["api"]["games"][":page"]["$get"]
  // >["data"];
}) {
  const BASE_URL = "/telegram-miniapp-bot/";
  const numsPerGroup = 8;
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const addFavoriteMutation = useMutation(addFavoriteMutationOptions());
  const gamesQuery = useQuery(getGamesQueryOptions());
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
    showBackButton();
    on("back_button_pressed", () => {
      turnImagesOff();
      hideBackButton();
      navigate({ to: "/" });
    });
  }, []);

  if (gamesQuery.data) {
    if (
      (isFavorite && pageIndex > maxFavoritePages!) ||
      (!isFavorite && pageIndex > maxPages!)
    ) {
      navigate({ to: baseUrl, search: { pageIndex: pageIndex - 1 } });
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

    return (
      <div>
        <div className="m-5 flex text-center justify-center">
          <div className="flex-auto">
            <button
              className={`font-bold p-1.5 border-3 border-gray-900 rounded-xl bg-gray-800 hover:bg-gray-600 active:bg-gray-500 disabled:bg-black disabled:text-gray-600`}
              disabled={pageIndex === 1 ? true : false}
              onClick={() => {
                turnImagesOff();
                navigate({ to: baseUrl, search: { pageIndex: pageIndex - 1 } });
              }}
            >
              Prev Page
            </button>
          </div>
          <div className="text-white">{pageIndex}</div>
          <div className="flex-auto">
            <button
              className={`font-bold p-1.5 border-3 border-gray-900 rounded-xl bg-gray-800 hover:bg-gray-600 active:bg-gray-500 disabled:bg-black disabled:text-gray-600`}
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
                navigate({ to: baseUrl, search: { pageIndex: pageIndex + 1 } });
              }}
            >
              Next Page
            </button>
          </div>
        </div>
        <div className="text-center grid grid-cols-2">
          {gameList[pageIndex - 1].map(({ game }) => {
            console.log(game);
            const gameTitle = game.charAt(0).toUpperCase() + game.slice(1);
            const isFavorite = gamesQuery.data.data.favoriteGames.some(
              (favorite) => {
                return favorite.game === game;
              }
            );

            return (
              <div
                key={game}
                className="border-2 m-2 flex flex-row rounded-t-2xl border-gray-600 bg-gray-900 "
              >
                <button
                  className="flex flex-col rounded-tl-2xl hover:bg-gray-800"
                  onClick={() => {
                    turnImagesOff();
                    navigate({
                      to: "/games/$gameName",
                      params: { gameName: game },
                      search: { pageIndex, lastPage: baseUrl },
                    });
                  }}
                >
                  <h3 className="m-0 p-1 font-semibold">{gameTitle}</h3>
                  <div className="bg-gray-700 w-fit h-fit rounded-t-2xl">
                    <img
                      className="rounded-t-2xl"
                      width={150}
                      height={75}
                      src={`${BASE_URL}docs/${game}/screenshot.gif`}
                    />
                  </div>
                </button>
                <div
                  className="bg-gray-700 flex items-center rounded-tr-2xl hover:text-yellow-400"
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
                  <Star fill={`${isFavorite ? "gold" : undefined}`}></Star>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  } else {
    return <div className="text-4xl text-center font-bold">Loading...</div>;
  }
}
