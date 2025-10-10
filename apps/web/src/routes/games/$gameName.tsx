import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { on, showBackButton } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";

import {
  addAllWindow,
  addGameFile,
} from "../../game-components/crisp-games-lib/main";
import z from "zod";

export const Route = createFileRoute("/games/$gameName")({
  component: GameComponent,
  validateSearch: z.object({
    pageIndex: z.number().catch(1),
    lastPage: z.string(),
  }),
});

// const BASE_URL = "/telegram-miniapp-bot/";

function GameComponent() {
  const { gameName } = Route.useParams();
  const { pageIndex, lastPage } = Route.useSearch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  // const gameScript = document.createElement("script");
  // function addGameFile() {
  //   const gameFile = `${BASE_URL}docs/${gameName}/main.js`;
  //   gameScript.src = gameFile;
  //   if (gameFile.includes("games/main.js")) {
  //     return;
  //   }
  //   document.head.appendChild(gameScript);
  //   gameScript.addEventListener("load", () => {
  //     crispGameLib.onLoad();
  //   });
  // }

  useEffect(() => {
    showBackButton();
    addAllWindow();
    addGameFile(gameName);
    on("back_button_pressed", () => {
      navigate({ to: lastPage, search: { pageIndex: pageIndex || 1 } });
    });

    setIsLoading(false);
    // const bundleScript = document.createElement("script");
    // bundleScript.text = "onLoad();";
    // gameScript.addEventListener("load", () => {
    //   document.head.appendChild(bundleScript);
    //   setIsLoading(false);
    // });
    return () => {
      // alert("Cleaning up");
      // document.head.removeChild(gameScript);
      // document.head.removeChild(bundleScript);
      location.reload();
    };
  }, []);

  return (
    <div className={`${isLoading ? "block" : "hidden"}`}>
      <h1 className="justify-center text-cyan-500 font-bold text-4xl text-center p-10">
        Loading Now...
      </h1>
    </div>
  );
}
