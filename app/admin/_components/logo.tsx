"use client"
import { CalendarCheck } from "lucide-react"
import Link from "next/link"

export const Logo = () => {
  return (
    <Link className="flex items-center" href="/">
      <CalendarCheck />
      <span className="ml-2 mt-1">Wydarzenia UBB</span>
    </Link>
  )
}
