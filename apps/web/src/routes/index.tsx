import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {

  return (
    <div className="p-2">
      <Link to="/games" search={{ pageIndex: 1 }}>
        Game Here
      </Link>
    </div>
  );
}
