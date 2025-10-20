import { createRootRoute, Outlet } from "@tanstack/react-router";
import { init, mountBackButton } from "@telegram-apps/sdk-react";

// Should display EVERYWHERE - just in case

init();
mountBackButton();

const RootLayout = () => (
  <>
    <Outlet />
  </>
);

export const Route = createRootRoute({ component: RootLayout });
