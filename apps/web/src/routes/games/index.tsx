import { hideBackButton, on, showBackButton } from "@telegram-apps/sdk-react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import z from "zod";

export const Route = createFileRoute("/games/")({
  component: Games,
  // ! Hardcoded on .lte(), better make it automated.
  validateSearch: z.object({ pageIndex: z.number().gte(1).lte(21).catch(1) }),
});

const BASE_URL = "/telegram-miniapp-bot/";

function Games() {
  const { pageIndex } = Route.useSearch();
  const navigate = useNavigate();
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

  const fullGameList = [
    "aerialbar",
    "antlion",
    "arcfire",
    "balance",
    "balloon",
    "ballsbombs",
    "balltour",
    "bamboo",
    "baroll",
    "bblast",
    "bcannon",
    "bmath",
    "boarding",
    "bombup",
    "bottop",
    "breedc",
    "bsfish",
    "bwalls",
    "cardq",
    "castn",
    "catapult",
    "catep",
    "chargebeam",
    "circlew",
    "cnodes",
    "colorroll",
    "count",
    "counterb",
    "crossline",
    "ctower",
    "cywall",
    "darkcave",
    "descents",
    "dfight",
    "digi10",
    "divarr",
    "dlaser",
    "dmissile",
    "doshin",
    "dpistols",
    "earock",
    "embattled",
    "findastar",
    "flipbomb",
    "flipo",
    "floater",
    "floors5",
    "foosan",
    "forfour",
    "fromtwosides",
    "froooog",
    "futurewake",
    "geocent",
    "gloop",
    "golfme",
    "gpress",
    "graveler",
    "grenadier",
    "growth",
    "gtail",
    "hexmin",
    "hitblowup",
    "holes",
    "hoppingp",
    "hyperlaser",
    "infrange",
    "interspace",
    "intow",
    "islash",
    "jujump",
    "jumpon",
    "kite",
    "ladderdrop",
    "laserfortress",
    "liedown",
    "liftup",
    "lightdark",
    "lineb",
    "lland",
    "lrain",
    "makemaze",
    "mfield",
    "mirrorfloor",
    "mjamming",
    "molen",
    "monjum",
    "mortar",
    "mrider",
    "notturn",
    "nsclimb",
    "numberball",
    "numberline",
    "orbitman",
    "pairsdrop",
    "parking",
    "pfit",
    "photonline",
    "pileup",
    "pillars3d",
    "pinclimb",
    "pizzaarrow",
    "portalj",
    "pressm",
    "pumppress",
    "raid",
    "rebirth",
    "refbals",
    "reflector",
    "regene",
    "revolvea",
    "rolfrg",
    "rollnrope",
    "rolls",
    "rps",
    "rring",
    "rwheel",
    "scaffold",
    "scrambird",
    "screen",
    "shiny",
    "sighton",
    "skyfloor",
    "slalom",
    "slanes",
    "slashes",
    "smilyangry",
    "smokeg",
    "snake1",
    "snaky",
    "spearain",
    "squarebar",
    "sshake",
    "subjump",
    "sumten",
    "survivor",
    "swingby",
    "tapej",
    "tappump",
    "tarutobi",
    "teeter",
    "thanoi",
    "throwm",
    "thrustlr",
    "thunder",
    "tilted",
    "tlanes",
    "tlaser",
    "totoge",
    "tpunch",
    "trbeam",
    "ttfence",
    "turbulent",
    "twhols",
    "twinp",
    "twofaced",
    "twolane",
    "udcave",
    "unctrl",
    "updownpress",
    "upshot",
    "vbomb",
    "vhwalls",
    "wiper",
    "zartan",
    "zoneb",
    "zoomio",
  ];
  const numsPerGroup = 8;
  const gameList = new Array(21)
    .fill("")
    .map((_, i) =>
      fullGameList.slice(i * numsPerGroup, (i + 1) * numsPerGroup)
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
            <div key={game} className="border-2 m-2 rounded-t-2xl border-gray-600 bg-gray-900 hover:bg-gray-800">
              <button
                onClick={() => {
                  turnImagesOff();
                  navigate({
                    to: "/games/$gameName",
                    params: { gameName: game },
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
            </div>
          );
        })}
      </div>
    </div>
  );
}
