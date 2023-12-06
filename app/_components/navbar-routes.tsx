import { Button } from "@/components/ui/button";
import { SignInButton, SignOutButton, currentUser } from "@clerk/nextjs";
import { Role } from "@prisma/client";
import Link from "next/link";

export const NavbarRoutes = async () => {
  const user = await currentUser();
  return (
    <>
      <div className="flex gap-x-2 ml-auto">
        {user?.publicMetadata.role === Role.ADMIN ? (
          <Button asChild size="sm" variant="ghost">
            <Link href="/admin/workshop">Admin Panel</Link>
          </Button>
        ) : null}
        <Button asChild size="sm" variant="ghost">
          {user ? <SignOutButton /> : <SignInButton />}
        </Button>
      </div>
    </>
  );
};
