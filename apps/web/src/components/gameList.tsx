import { useMutation } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { addFavoriteMutationOptions } from "../queries/games.queries";
import { useEffect } from "react";
import { hideBackButton, on, showBackButton } from "@telegram-apps/sdk-react";

export default function GameList({pageIndex, gameNameList} : {pageIndex: number, gameNameList: string[]}) {
  const BASE_URL = "/telegram-miniapp-bot/";
  const navigate = useNavigate();
  const addFavoriteMutation = useMutation(addFavoriteMutationOptions());
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


  const numsPerGroup = 8;
  const gameList = new Array(21)
    .fill("")
    .map((_, i) =>
      gameNameList.slice(i * numsPerGroup, (i + 1) * numsPerGroup)
    );

  return (
    <div>
      <div className="m-5 flex text-center justify-center">
        <div className="flex-auto">
          <button
            className={`font-bold p-1.5 border-3 border-gray-900 rounded-xl bg-gray-800 hover:bg-gray-600 active:bg-gray-500 disabled:bg-black disabled:text-gray-600`}
            disabled={pageIndex === 1 ? true : false}
            onClick={() => {
              turnImagesOff();
              navigate({ to: "/games", search: { pageIndex: pageIndex - 1 } });
            }}
          >
            Prev Page
          </button>
        </div>
        <div className="text-white">{pageIndex}</div>
        <div className="flex-auto">
          <button
            className={`font-bold p-1.5 border-3 border-gray-900 rounded-xl bg-gray-800 hover:bg-gray-600 active:bg-gray-500 disabled:bg-black disabled:text-gray-600`}
            disabled={pageIndex === 21 ? true : false}
            onClick={() => {
              turnImagesOff();
              navigate({ to: "/games", search: { pageIndex: pageIndex + 1 } });
            }}
          >
            Next Page
          </button>
        </div>
      </div>
      <div className="text-center grid grid-cols-2">
        {gameList[pageIndex - 1].map((game) => {
          const gameName = game.charAt(0).toUpperCase() + game.slice(1);

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
                    search: { pageIndex },
                  });
                }}
              >
                <h3 className="m-0 p-1 font-semibold">{gameName}</h3>
                <div className="bg-gray-700 w-fit h-fit rounded-t-2xl">
                  <img
                    className="rounded-t-2xl"
                    width={150}
                    height={75}
                    src={`${BASE_URL}docs/${game}/screenshot.gif`}
                  />
                </div>
              </button>
              <button
                className="block bg-gray-700 rounded-tr-2xl hover:text-yellow-400"
                onClick={() => {
                  addFavoriteMutation.mutate({
                    param: { id: gameName.toLowerCase() },
                  });
                }}
              >
                Fav
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
