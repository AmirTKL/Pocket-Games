import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { on, showBackButton } from "@telegram-apps/sdk-react";
import { useEffect, useState } from "react";

import { addAllWindow, addGameFile } from "@repo/crisp-games";
import z from "zod";
import { useMutation } from "@tanstack/react-query";
import {
  addPlayTimeMutationOptions,
  insertDefaulyValuesMutationOptions,
  submitHighscoreMutationoptions,
} from "../../queries/games.queries";

export const Route = createFileRoute("/games/$gameName")({
  component: GameComponent,
  validateSearch: z.object({
    pageIndex: z.number().catch(1).optional(),
    lastPage: z.string(),
  }),
});

function GameComponent() {
  const { gameName } = Route.useParams();
  const { pageIndex, lastPage } = Route.useSearch();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const submitScoreMutation = useMutation(submitHighscoreMutationoptions());
  const addPlaytime = useMutation(addPlayTimeMutationOptions());
  const insertDefaults = useMutation(insertDefaulyValuesMutationOptions());

  useEffect(() => {
    insertDefaults.mutate({ id: gameName });
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      console.log(gameName);
      addPlaytime.mutate({ id: gameName, time: "60" });
    }, 60000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  useEffect(() => {
    showBackButton();
    addAllWindow();
    addGameFile(gameName);
    on("back_button_pressed", () => {
      //Perhaps check if the pageIndex is required or not first, somehow.
      navigate({ to: lastPage, search: { pageIndex: pageIndex || 1 } });
    });
    setIsLoading(false);
    return () => {
      location.reload();
    };
  }, []);

  useEffect(() => {
    const callback = (event: CustomEvent) => {
      const highScore = event.detail.highScore;
      submitScoreMutation.mutate({
        gameName,
        highScore,
      });
    };
    document.addEventListener("save_highscore" as any, callback);
    return () => {
      document.removeEventListener("save_highscore" as any, callback);
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
