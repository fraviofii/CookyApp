import type React from "react"
import { BarChart, Users, CookingPot, FileText, Package, UserCircle, ShoppingCart } from "lucide-react"
import { useTranslation } from "next-i18next"

import type { Roles } from "@/types"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType
  roles?: Roles[]
}

export function DashboardNav() {
  const { t } = useTranslation("common")

  const navigationItems: NavItem[] = [
    {
      title: t("nav.dashboard"),
      href: "/",
      icon: BarChart,
    },
    {
      title: t("nav.users"),
      href: "/users",
      icon: Users,
      roles: ["admin"],
    },
    {
      title: t("nav.kitchen"),
      href: "/kitchen",
      icon: CookingPot,
      roles: ["admin", "manager"],
    },
    {
      title: t("nav.reports"),
      href: "/reports",
      icon: FileText,
      roles: ["admin", "manager"],
    },
    {
      title: t("nav.products"),
      href: "/products",
      icon: Package,
      roles: ["admin", "manager"],
    },
    {
      title: t("nav.clients"),
      href: "/clients",
      icon: UserCircle,
      roles: ["admin", "manager", "sales"],
    },
    {
      title: t("nav.orders"),
      href: "/orders",
      icon: ShoppingCart,
      roles: ["manager", "sales"],
    },
  ]

  return (
    <div className="flex flex-col gap-2">
      {navigationItems.map((item) => (
        <a key={item.href} href={item.href} className="flex items-center gap-2 rounded-md p-2 hover:bg-secondary">
          <item.icon className="h-5 w-5" />
          {item.title}
        </a>
      ))}
    </div>
  )
}
