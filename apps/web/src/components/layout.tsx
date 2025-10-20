import { Link } from "@tanstack/react-router";
import { retrieveLaunchParams } from "@telegram-apps/sdk-react";

export default function Layout({
  children,
}: {
  children: React.ReactNode | undefined;
}) {
  const userPhoto = retrieveLaunchParams().tgWebAppData?.user?.photo_url;
  const firstName = retrieveLaunchParams().tgWebAppData?.user?.first_name;
  return (
    <div className="flex flex-row justify-end gap-10">
      <div>{children}</div>
      <Link
        to="/profile"
        className="flex flex-row gap-5 rounded-2xl mt-2 p-2 mx-10 "
      >
        <h3 className="font-medium">{firstName}</h3>
        <img className="size-7 rounded-full" src={userPhoto} />
      </Link>
    </div>
  );
}
