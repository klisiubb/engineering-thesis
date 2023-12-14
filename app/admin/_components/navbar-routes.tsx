"use client";
import { Button } from "@/components/ui/button";
import { SignOutButton } from "@clerk/nextjs";
import Link from "next/link";

export const NavbarRoutes = () => {
  return (
    <>
      <div className="flex gap-x-2 ml-auto">
        <Button asChild size="sm" variant="ghost">
          <Link href="/">Close admin panel</Link>
        </Button>
        <Button asChild size="sm" variant="ghost">
          <SignOutButton />
        </Button>
      </div>
    </>
  );
};
