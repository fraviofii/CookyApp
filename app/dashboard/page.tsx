"use client"

import { useEffect, useState } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/lib/i18n/language-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { ClipboardList, Package, ShoppingBag, Users, Loader2 } from "lucide-react"
import { useAuth } from "@/components/auth-provider"
import { getOrders, getProducts, getClients, getUsers } from "@/lib/db"
import { toast } from "@/components/ui/use-toast"
import { format } from "date-fns"

export default function DashboardPage() {
  const { user } = useAuth()
  const { t } = useLanguage()
  const [stats, setStats] = useState({
    totalOrders: 0,
    pendingOrders: 0,
    totalProducts: 0,
    totalUsers: 0,
    totalClients: 0,
  })
  const [recentActivity, setRecentActivity] = useState<
    Array<{
      type: "order" | "product" | "client"
      title: string
      description: string
      time: string
      date: Date
    }>
  >([])
  // Add a mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setMounted(true)
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    setIsLoading(true)
    try {
      // Fetch all required data in parallel
      const [orders, products, clients, users] = await Promise.all([
        getOrders(),
        getProducts(),
        getClients(),
        getUsers(),
      ])

      // Calculate stats
      const pendingOrders = orders.filter(
        (order) => order.status === "pending" || order.status === "accepted" || order.status === "in-progress",
      ).length

      setStats({
        totalOrders: orders.length,
        pendingOrders,
        totalProducts: products.length,
        totalUsers: users.length,
        totalClients: clients.length,
      })

      // Generate recent activity
      const activities = []

      // Add recent orders (last 5)
      const recentOrders = [...orders]
        .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        .slice(0, 5)
        .map((order) => ({
          type: "order" as const,
          title: t("dashboard.newOrderReceived"),
          description: `${t("orders.orderNumber")}${order.id.slice(-4)} ${t("common.from")} ${order.clientName}`,
          time: format(new Date(order.createdAt), "MMM dd, yyyy HH:mm"),
          date: new Date(order.createdAt),
        }))

      activities.push(...recentOrders)

      // Sort all activities by date
      activities.sort((a, b) => b.date.getTime() - a.date.getTime())

      // Take only the 3 most recent activities
      setRecentActivity(activities.slice(0, 3))
    } catch (error) {
      console.error("Error fetching dashboard data:", error)
      toast({
        title: mounted ? t("dashboard.error") : "Error",
        description: "Failed to load dashboard data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  // Translated text with fallbacks for SSR
  const dashboardTitle = mounted ? t("dashboard.title") : "Dashboard"
  const dashboardSubtitle = mounted ? t("dashboard.subtitle") : "Overview of your business"
  const totalOrdersText = mounted ? t("dashboard.totalOrders") : "Total Orders"
  const fromLastMonthText = mounted ? t("dashboard.fromLastMonth") : "+12% from last month"
  const pendingOrdersText = mounted ? t("dashboard.pendingOrders") : "Pending Orders"
  const requiresAttentionText = mounted ? t("dashboard.requiresAttention") : "Requires attention"
  const totalProductsText = mounted ? t("dashboard.totalProducts") : "Total Products"
  const addedThisWeekText = mounted ? t("dashboard.addedThisWeek") : "+2 added this week"
  const totalClientsText = mounted ? t("dashboard.totalClients") : "Total Clients"
  const manageInSectionText = mounted ? t("dashboard.manageInSection") : "Manage in Clients section"
  const recentActivityText = mounted ? t("dashboard.recentActivity") : "Recent Activity"
  const overviewText = mounted ? t("dashboard.overview") : "Overview of recent orders and system activity"
  const loadingText = mounted ? t("common.loading") : "Loading..."

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{loadingText}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{totalOrdersText}</CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalOrders}</div>
            <p className="text-xs text-muted-foreground">{fromLastMonthText}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{pendingOrdersText}</CardTitle>
            <ClipboardList className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingOrders}</div>
            <p className="text-xs text-muted-foreground">{requiresAttentionText}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{totalProductsText}</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProducts}</div>
            <p className="text-xs text-muted-foreground">{addedThisWeekText}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{totalClientsText}</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalClients}</div>
            <p className="text-xs text-muted-foreground">{manageInSectionText}</p>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6">
        <Card>
          <CardHeader>
            <CardTitle>{recentActivityText}</CardTitle>
            <CardDescription>{overviewText}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivity.length > 0 ? (
                recentActivity.map((activity, index) => (
                  <div key={index} className="flex items-center gap-4 rounded-md border p-4">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                      {activity.type === "order" && <ShoppingBag className="h-5 w-5 text-primary" />}
                      {activity.type === "product" && <Package className="h-5 w-5 text-primary" />}
                      {activity.type === "client" && <Users className="h-5 w-5 text-primary" />}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{activity.title}</p>
                      <p className="text-sm text-muted-foreground">{activity.description}</p>
                    </div>
                    <div className="text-sm text-muted-foreground">{activity.time}</div>
                  </div>
                ))
              ) : (
                <div className="flex items-center justify-center p-4 text-muted-foreground">
                  {mounted ? t("dashboard.noRecentActivity") : "No recent activity"}
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  )
}
