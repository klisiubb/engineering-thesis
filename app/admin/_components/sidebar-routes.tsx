"use client";

import { CalendarDays, QrCode, Trophy, Users } from "lucide-react";

import { SidebarItem } from "./sidebar-item";

const adminRoutes = [
  {
    icon: CalendarDays,
    label: "Workshops",
    href: "/admin/workshop",
  },
  {
    icon: QrCode,
    label: "QR Codes",
    href: "/admin/qr",
  },
  {
    icon: Trophy,
    label: "Rewards",
    href: "/admin/reward",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/user",
  },
];

export const SidebarRoutes = () => {
  const routes = adminRoutes;

  return (
    <div className="flex flex-col w-full">
      {routes.map((route) => (
        <SidebarItem
          key={route.href}
          icon={route.icon}
          label={route.label}
          href={route.href}
        />
      ))}
    </div>
  );
};
