"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import {
  BarChart3,
  ChefHat,
  Home,
  LogOut,
  Menu,
  Package,
  Users,
  X,
  ShoppingCart,
  ClipboardList,
  Cookie,
  Clipboard,
  MessageSquare,
  Settings,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { LanguageSwitcher } from "./language-switcher"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, logout } = useAuth()
  const { t } = useLanguage()
  const pathname = usePathname()
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    // Try to get the sidebar state from localStorage
    if (typeof window !== "undefined") {
      const savedState = localStorage.getItem("sidebarOpen")
      return savedState === "true"
    }
    return false
  })
  // Add a mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Add this after the other useEffect hooks
  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("sidebarOpen", String(sidebarOpen))
    }
  }, [sidebarOpen])

  if (!user) {
    return null
  }

  const isManager = user.role === "manager"
  const isSales = user.role === "sales"
  const isEmployee = user.role === "employee"

  // Use simple text during SSR to avoid hydration mismatch
  const dashboardText = mounted ? t("common.dashboard") : "Dashboard"
  const kitchenText = mounted ? t("common.kitchen") : "Kitchen"
  const productionText = mounted ? t("common.production") : "Production"
  const clientsText = mounted ? t("common.clients") : "Clients"
  const ordersText = mounted ? t("common.orders") : "Orders"
  const newOrderText = mounted ? t("common.newOrder") : "New Order"
  const productsText = mounted ? t("common.products") : "Products"
  const staffText = mounted ? t("common.staff") : "Staff"
  const reportsText = mounted ? t("common.reports") : "Reports"
  const logoutText = mounted ? t("common.logout") : "Logout"
  const whatsappOrdersText = mounted ? t("whatsapp.whatsappOrders") : "WhatsApp Orders"
  const settingsText = mounted ? t("settings.title") : "Settings"

  const navigation = [
    { name: dashboardText, href: "/dashboard", icon: Home },
    ...(isManager || isEmployee
      ? [
          { name: kitchenText, href: "/kitchen", icon: ChefHat },
          { name: productionText, href: "/production", icon: Clipboard },
        ]
      : []),
    ...(isManager || isSales
      ? [
          { name: clientsText, href: "/clients", icon: Users },
          { name: ordersText, href: "/orders", icon: ClipboardList },
          { name: newOrderText, href: "/order", icon: ShoppingCart },
          { name: whatsappOrdersText, href: "/whatsapp-orders", icon: MessageSquare },
        ]
      : []),
    ...(isManager
      ? [
          { name: productsText, href: "/products", icon: Package },
          { name: staffText, href: "/users", icon: Users },
          { name: reportsText, href: "/reports", icon: BarChart3 },
          { name: settingsText, href: "/settings", icon: Settings },
        ]
      : []),
  ]

  return (
    <div className="flex min-h-screen flex-col">
      {/* Mobile sidebar */}
      <div
        className={cn(
          "fixed inset-0 z-40 bg-background/80 backdrop-blur-sm transition-all",
          sidebarOpen ? "block" : "hidden",
        )}
        onClick={() => setSidebarOpen(false)}
      />

      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-background p-4 shadow-lg transition-transform duration-200 ease-in-out",
          sidebarOpen ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Cookie className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Sucré Biscoiteria</span>
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(false)} className="lg:hidden">
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="mt-8 space-y-1">
          {navigation.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center space-x-2 rounded-md px-3 py-2 text-sm font-medium",
                pathname === item.href
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-muted hover:text-foreground",
              )}
              onClick={() => setSidebarOpen(false)}
            >
              <item.icon className="h-5 w-5" />
              <span>{item.name}</span>
            </Link>
          ))}
        </div>

        <div className="absolute bottom-4 left-4 right-4">
          <div className="mb-2 rounded-md bg-muted p-2">
            <div className="font-medium">{user.name}</div>
            <div className="text-xs text-muted-foreground capitalize">{user.role}</div>
          </div>
          <Button variant="outline" className="w-full justify-start" onClick={logout}>
            <LogOut className="mr-2 h-4 w-4" />
            {logoutText}
          </Button>
        </div>
      </div>

      <div className="flex flex-1 flex-col">
        <header className="sticky top-0 z-10 border-b bg-background">
          <div className="flex h-16 items-center justify-between px-4 shadow-sm">
            <div className="flex items-center">
              <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
                <Menu className="h-5 w-5" />
              </Button>
              <div className="ml-4 lg:ml-0">
                <h1 className="text-lg font-medium">
                  {navigation.find((item) => item.href === pathname)?.name || dashboardText}
                </h1>
              </div>
            </div>
            <LanguageSwitcher />
          </div>
        </header>

        <main className="flex-1 p-4 md:p-6">{children}</main>
      </div>
    </div>
  )
}
