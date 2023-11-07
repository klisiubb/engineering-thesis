import { SignInButton, SignOutButton, currentUser } from "@clerk/nextjs";

export default async function Page() {
  const user = await currentUser();
  if (!user)
    return (
      <div>
        Not logged in <SignInButton />
      </div>
    );

  return (
    <div>
      Hello {user?.firstName} <SignOutButton />
    </div>
  );
}
