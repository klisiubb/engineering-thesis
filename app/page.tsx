import { Navbar } from "./_components/navbar";
import WelcomeComponent from "./_components/welcome";
import WorkshopsComponent from "./_components/workshops";

export default async function Page() {
  return (
    <>
      <Navbar />
      <WelcomeComponent />
      <WorkshopsComponent />
    </>
  );
}
