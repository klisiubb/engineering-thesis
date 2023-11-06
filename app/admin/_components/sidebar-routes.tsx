"use client"

import { BarChart, CalendarDays, Compass, List, QrCode } from "lucide-react"
import { usePathname } from "next/navigation"

import { SidebarItem } from "./sidebar-item"

const adminRoutes = [
  {
    icon: BarChart,
    label: "Stats",
    href: "/admin/",
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
]

const teacherRoutes = [
  {
    icon: List,
    label: "Courses",
    href: "/teacher/courses",
  },
  {
    icon: BarChart,
    label: "Analytics",
    href: "/teacher/analytics",
  },
]

export const SidebarRoutes = () => {
  const pathname = usePathname()

  const isTeacherPage = pathname?.includes("/teacher")

  const routes = isTeacherPage ? teacherRoutes : adminRoutes

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
  )
}
