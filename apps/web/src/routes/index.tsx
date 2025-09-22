import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useLaunchParams } from "@telegram-apps/sdk-react";
import { createNoteMutationOptions } from "../queries/games.queries";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const initDataRaw = useLaunchParams().tgWebAppData;
  const createNoteMutation = useMutation(createNoteMutationOptions());
  useEffect(() => {
    createNoteMutation.mutate({
      header: { Authorization: `tma ${initDataRaw}` },
      // header: { Authorization: `tma FUCKYOU` },
    });
    console.log(initDataRaw);
  }, []);

  return (
    <div className="p-2">
      <Link to="/games" search={{ pageIndex: 1 }}>
        Game Here
      </Link>
    </div>
  );
}
