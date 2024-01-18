import { Navbar } from "./_components/navbar";
import RewardsComponent from "./_components/rewards";
import WorkshopsComponent from "./_components/workshops";

export default async function Page() {
  return (
    <>
      <Navbar />
      <WorkshopsComponent />
      <RewardsComponent />
    </>
  );
}
