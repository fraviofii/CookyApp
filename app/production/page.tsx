"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Eye, ExternalLink, Loader2 } from "lucide-react"
import { getOrders } from "@/lib/db"
import { useRouter } from "next/navigation"
import { startOfDay, startOfWeek, startOfMonth, isAfter } from "date-fns"

type OrderItem = {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  observation: string
}

type Order = {
  id: string
  clientName: string
  clientPhone: string
  items: OrderItem[]
  total: number
  status: "pending" | "accepted" | "in-progress" | "ready" | "delivered"
  createdAt: string
}

type ProductSummary = {
  productId: string
  productName: string
  totalQuantity: number
  orders: Array<{
    orderId: string
    clientName: string
    quantity: number
    status: Order["status"]
  }>
}

export default function ProductionPage() {
  const { t } = useLanguage()
  const router = useRouter()
  const [orders, setOrders] = useState<Order[]>([])
  const [productSummaries, setProductSummaries] = useState<ProductSummary[]>([])
  const [selectedProduct, setSelectedProduct] = useState<ProductSummary | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [timeFilter, setTimeFilter] = useState("all")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchOrders()
  }, [])

  useEffect(() => {
    if (orders.length > 0) {
      generateProductSummaries(orders)
    }
  }, [orders, timeFilter])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const ordersData = await getOrders()
      // Filter out delivered orders
      const openOrders = ordersData.filter((order) => order.status !== "delivered")
      setOrders(openOrders)
    } catch (error) {
      console.error("Error fetching orders:", error)
      toast({
        title: mounted ? t("orders.error") : "Error",
        description: "Failed to load orders. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const generateProductSummaries = (ordersList: Order[]) => {
    // Apply time filter
    const filteredOrders = filterOrdersByTime(ordersList, timeFilter)

    // Create a map to store product summaries
    const productMap = new Map<string, ProductSummary>()

    // Process each order
    filteredOrders.forEach((order) => {
      order.items.forEach((item) => {
        // Get or create product summary
        const existingProduct = productMap.get(item.productId)

        if (existingProduct) {
          // Update existing product summary
          existingProduct.totalQuantity += item.quantity
          existingProduct.orders.push({
            orderId: order.id,
            clientName: order.clientName,
            quantity: item.quantity,
            status: order.status,
          })
        } else {
          // Create new product summary
          productMap.set(item.productId, {
            productId: item.productId,
            productName: item.productName,
            totalQuantity: item.quantity,
            orders: [
              {
                orderId: order.id,
                clientName: order.clientName,
                quantity: item.quantity,
                status: order.status,
              },
            ],
          })
        }
      })
    })

    // Convert map to array and sort by product name
    const summaries = Array.from(productMap.values()).sort((a, b) => a.productName.localeCompare(b.productName))

    setProductSummaries(summaries)
  }

  const filterOrdersByTime = (ordersList: Order[], filter: string) => {
    if (filter === "all") return ordersList

    const now = new Date()
    let startDate: Date

    switch (filter) {
      case "today":
        startDate = startOfDay(now)
        break
      case "week":
        startDate = startOfWeek(now, { weekStartsOn: 1 }) // Week starts on Monday
        break
      case "month":
        startDate = startOfMonth(now)
        break
      default:
        return ordersList
    }

    return ordersList.filter((order) => {
      const orderDate = new Date(order.createdAt)
      return isAfter(orderDate, startDate) || orderDate.getTime() === startDate.getTime()
    })
  }

  const handleViewDetails = (product: ProductSummary) => {
    setSelectedProduct(product)
    setIsDetailsOpen(true)
  }

  const navigateToOrder = (orderId: string) => {
    router.push(`/orders?id=${orderId}`)
  }

  const getStatusBadge = (status: Order["status"]) => {
    const statusMap = {
      pending: mounted ? t("status.pending") : "Pending",
      accepted: mounted ? t("status.accepted") : "Accepted",
      "in-progress": mounted ? t("status.inProgress") : "In Progress",
      ready: mounted ? t("status.ready") : "Ready",
      delivered: mounted ? t("status.delivered") : "Delivered",
    }

    const colorMap = {
      pending: "bg-yellow-100 text-yellow-800",
      accepted: "bg-blue-100 text-blue-800",
      "in-progress": "bg-purple-100 text-purple-800",
      ready: "bg-green-100 text-green-800",
      delivered: "bg-gray-100 text-gray-800",
    }

    return (
      <Badge variant="outline" className={colorMap[status]}>
        {statusMap[status]}
      </Badge>
    )
  }

  // Translated text with fallbacks for SSR
  const productionTitle = mounted ? t("production.title") : "Production"
  const productionSubtitle = mounted ? t("production.subtitle") : "Open orders by product"
  const allOrdersFilter = mounted ? t("production.allOrders") : "All Orders"
  const todayFilter = mounted ? t("production.today") : "Today"
  const thisWeekFilter = mounted ? t("production.thisWeek") : "This Week"
  const thisMonthFilter = mounted ? t("production.thisMonth") : "This Month"
  const productColumn = mounted ? t("production.product") : "Product"
  const quantityColumn = mounted ? t("production.quantity") : "Quantity"
  const actionsColumn = mounted ? t("common.actions") : "Actions"
  const viewDetailsButton = mounted ? t("common.viewDetails") : "View Details"
  const noProductsText = mounted ? t("production.noProducts") : "No products to produce"
  const productDetailsTitle = mounted ? t("production.productDetails") : "Product Details"
  const orderColumn = mounted ? t("common.order") : "Order"
  const clientColumn = mounted ? t("common.client") : "Client"
  const statusColumn = mounted ? t("common.status") : "Status"
  const viewOrderButton = mounted ? t("production.viewOrder") : "View Order"
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
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{productionTitle}</h2>
          <p className="text-muted-foreground">{productionSubtitle}</p>
        </div>
      </div>

      {mounted && (
        <div className="mb-6">
          <Tabs defaultValue="all" value={timeFilter} onValueChange={setTimeFilter}>
            <TabsList>
              <TabsTrigger value="all">{allOrdersFilter}</TabsTrigger>
              <TabsTrigger value="today">{todayFilter}</TabsTrigger>
              <TabsTrigger value="week">{thisWeekFilter}</TabsTrigger>
              <TabsTrigger value="month">{thisMonthFilter}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>{productionTitle}</CardTitle>
        </CardHeader>
        <CardContent>
          {productSummaries.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <p className="text-muted-foreground">{noProductsText}</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{productColumn}</TableHead>
                  <TableHead className="text-right">{quantityColumn}</TableHead>
                  <TableHead className="text-right">{actionsColumn}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {productSummaries.map((product) => (
                  <TableRow key={product.productId}>
                    <TableCell className="font-medium">{product.productName}</TableCell>
                    <TableCell className="text-right">{product.totalQuantity}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => handleViewDetails(product)}>
                        <Eye className="mr-2 h-4 w-4" />
                        {viewDetailsButton}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{productDetailsTitle}</DialogTitle>
            <DialogDescription>
              {selectedProduct?.productName} - {mounted ? t("production.totalQuantity") : "Total Quantity"}:{" "}
              {selectedProduct?.totalQuantity}
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{orderColumn}</TableHead>
                  <TableHead>{clientColumn}</TableHead>
                  <TableHead>{quantityColumn}</TableHead>
                  <TableHead>{statusColumn}</TableHead>
                  <TableHead className="text-right">{actionsColumn}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProduct?.orders.map((order) => (
                  <TableRow key={order.orderId}>
                    <TableCell>#{order.orderId.slice(-4)}</TableCell>
                    <TableCell>{order.clientName}</TableCell>
                    <TableCell>{order.quantity}</TableCell>
                    <TableCell>{getStatusBadge(order.status)}</TableCell>
                    <TableCell className="text-right">
                      <Button variant="outline" size="sm" onClick={() => navigateToOrder(order.orderId)}>
                        <ExternalLink className="mr-2 h-4 w-4" />
                        {viewOrderButton}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
