import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { on, showBackButton } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/games/$gameName")({
  component: GameComponent,
});

const BASE_URL = "/telegram-miniapp-bot/";

function GameComponent() {
  const { gameName } = Route.useParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const gameScript = document.createElement("script");
  function addGameFile() {
    const UrlParam = window.location.href.split("?");
    let searchedGame = UrlParam[UrlParam.length - 1];
    searchedGame = searchedGame.replace(/[^A-Za-z0-9_-]/g, "");
    const gameFile = `${BASE_URL}docs/${gameName}/main.js`;
    gameScript.src = gameFile;
    if (gameFile.includes("games/main.js")) {
      // alert("No games selected");
      return;
    }
    document.head.appendChild(gameScript);
  }
  useEffect(() => {
    showBackButton();
    on("back_button_pressed", () => {
      navigate({ to: "/games", search: { pageIndex: 1 } });
    });
    const bundleScript = document.createElement("script");
    addGameFile();
    bundleScript.text = "onLoad();";
    gameScript.addEventListener("load", () => {
      document.head.appendChild(bundleScript);
      setIsLoading(false);
    });
    return () => {
      // alert("Cleaning up");
      document.head.removeChild(gameScript);
      document.head.removeChild(bundleScript);
      location.reload();
    };
  }, []);

  return (
    <div style={isLoading ? { display: "block" } : { display: "none" }}>
      <h1
        style={{
          justifySelf: "center",
          color: "lightcyan",
          fontWeight: "bolder",
        }}
      >
        Loading Now
      </h1>
    </div>
  );
}
