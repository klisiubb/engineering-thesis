import { SignInButton, SignOutButton, currentUser } from "@clerk/nextjs";
import { Navbar } from "./_components/navbar";
import WelcomeComponent from "./_components/welcome";

export default async function Page() {
  return (
    <>
      <Navbar />
      <WelcomeComponent />
    </>
  );
}
