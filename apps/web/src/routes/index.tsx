import { useMutation } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { createNoteMutationOptions } from "../queries/games.queries";
import { useEffect } from "react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const createNoteMutation = useMutation(createNoteMutationOptions());
  useEffect(() => {
    createNoteMutation.mutate({info: "I'm not a big fan of the government."});
  }, []);

  return (
    <div className="p-2">
      <Link to="/games" search={{ pageIndex: 1 }}>
        Game Here
      </Link>
    </div>
  );
}
