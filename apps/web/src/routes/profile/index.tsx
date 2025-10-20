import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { hideBackButton, on, showBackButton } from "@telegram-apps/sdk-react";
import { useEffect } from "react";
import Layout from "../../components/layout";

export const Route = createFileRoute("/profile/")({
  component: RouteComponent,
});

function RouteComponent() {
  const navigate = useNavigate();

  useEffect(() => {
    showBackButton();
    on("back_button_pressed", () => {
      hideBackButton();
      navigate({ to: "/" });
    });
  }, []);
  return (
    <div>
      <Layout children>
        
      </Layout>
      <div className="flex flex-col m-3 text-center gap-5 font-black">
        <div>Leaderboards Rank:</div>
        <div>Most Played Games:</div>
        <div>Achievements:</div>
      </div>
    </div>
  );
}
