import { SignOutButton } from "@clerk/nextjs";

export default function Settings() {
  return (
    <SignOutButton
      signOutOptions={{
        redirectUrl: "/",
      }}
    >
      <a className="cursor-pointer">log out</a>
    </SignOutButton>
  );
}
