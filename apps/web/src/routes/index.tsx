import { createFileRoute, Link } from "@tanstack/react-router";
import { useLaunchParams } from "@telegram-apps/sdk-react";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  const { initDataRaw } = useLaunchParams();
  console.log(initDataRaw);

  return (
    <div className="p-2">
      <Link to="/games" search={{ pageIndex: 1 }}>
        Game Here
      </Link>
    </div>
  );
}
