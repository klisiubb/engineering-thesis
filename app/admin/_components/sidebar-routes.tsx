"use client";

import {
  BarChart,
  CalendarDays,
  Compass,
  Layers2,
  List,
  QrCode,
  Trophy,
  Users,
} from "lucide-react";
import { usePathname } from "next/navigation";

import { SidebarItem } from "./sidebar-item";

const adminRoutes = [
  {
    icon: Layers2,
    label: "Main",
    href: "/admin/",
  },
  {
    icon: BarChart,
    label: "Stats",
    href: "/admin/stats",
  },
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
    href: "/admin/rewards",
  },
  {
    icon: Users,
    label: "Users",
    href: "/admin/users",
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
