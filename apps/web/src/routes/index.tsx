import { createFileRoute, Link } from "@tanstack/react-router";
import Layout from "../components/layout";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div>
      <Layout children />
      <div className="p-15 text-3xl flex flex-col text-center items-center gap-15">
        <h1 className="font-bold">Tiny Games</h1>
        <Link
          className="border-3 p-3 rounded-2xl border-gray-800 bg-blue-600 text-gray-300 hover:bg-blue-500 active:bg-blue-700"
          to="/games"
          search={{ pageIndex: 1 }}
        >
          All Games
        </Link>
      </div>
    </div>
  );
}
