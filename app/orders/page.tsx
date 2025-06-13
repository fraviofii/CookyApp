"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { toast } from "@/components/ui/use-toast"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Loader2, Eye, ShoppingCart } from "lucide-react"
import { getOrders, updateOrderStatus, type Order, type OrderItem } from "@/lib/db"
import Link from "next/link"
import { createWhatsAppLink } from "@/lib/whatsapp-utils"

export default function OrdersPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const [isUpdating, setIsUpdating] = useState(false)
  // Add a mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setIsLoading(true)
    try {
      const ordersData = await getOrders()
      setOrders(ordersData)
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

  const handleUpdateStatus = async (orderId: string, status: Order["status"]) => {
    setIsUpdating(true)
    try {
      const success = await updateOrderStatus(orderId, status)

      if (success) {
        // Update the order in the local state
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status } : order)))

        // Update the selected order if it's open
        if (selectedOrder && selectedOrder.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status })
        }

        toast({
          title: mounted ? t("orders.updated") : "Order Updated",
          description: mounted ? t("orders.statusUpdated") : "Order status has been updated successfully",
        })
      } else {
        throw new Error("Failed to update order status")
      }
    } catch (error) {
      console.error("Error updating order status:", error)
      toast({
        title: mounted ? t("orders.error") : "Error",
        description: "Failed to update order status. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUpdating(false)
    }
  }

  const getStatusBadgeVariant = (status: Order["status"]) => {
    switch (status) {
      case "pending":
        return "secondary"
      case "accepted":
        return "default"
      case "in-progress":
        return "default"
      case "ready":
        return "success"
      case "delivered":
        return "outline"
      default:
        return "secondary"
    }
  }

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat("en-US", {
        dateStyle: "medium",
        timeStyle: "short",
      }).format(date)
    } catch (error) {
      console.error("Error formatting date:", error)
      return dateString
    }
  }

  // Translated text with fallbacks for SSR
  const ordersTitle = mounted ? t("orders.title") : "Orders"
  const ordersSubtitle = mounted ? t("orders.subtitle") : "View and manage all orders"
  const clientLabel = mounted ? t("common.client") : "Client"
  const statusLabel = mounted ? t("common.status") : "Status"
  const totalLabel = mounted ? t("common.total") : "Total"
  const dateLabel = mounted ? t("common.date") : "Date"
  const actionsLabel = mounted ? t("common.actions") : "Actions"
  const viewDetailsLabel = mounted ? t("orders.viewDetails") : "View Details"
  const orderDetailsTitle = mounted ? t("orders.orderDetails") : "Order Details"
  const orderItemsLabel = mounted ? t("orders.orderItems") : "Order Items"
  const productLabel = mounted ? t("common.product") : "Product"
  const quantityLabel = mounted ? t("common.quantity") : "Quantity"
  const priceLabel = mounted ? t("common.price") : "Price"
  const observationLabel = mounted ? t("common.observation") : "Observation"
  const updateStatusLabel = mounted ? t("orders.updateStatus") : "Update Status"
  const pendingStatus = mounted ? t("orders.pending") : "Pending"
  const acceptedStatus = mounted ? t("orders.accepted") : "Accepted"
  const inProgressStatus = mounted ? t("orders.inProgress") : "In Progress"
  const readyStatus = mounted ? t("orders.ready") : "Ready"
  const deliveredStatus = mounted ? t("orders.delivered") : "Delivered"
  const noOrdersText = mounted ? t("orders.noOrders") : "No orders found"
  const loadingText = mounted ? t("common.loading") : "Loading..."
  const createOrderText = mounted ? t("orders.createOrder") : "Create Order"

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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{ordersTitle}</h2>
          <p className="text-muted-foreground">{ordersSubtitle}</p>
        </div>
        <Button asChild>
          <Link href="/order">
            <ShoppingCart className="mr-2 h-4 w-4" />
            {createOrderText}
          </Link>
        </Button>
      </div>

      {orders.length === 0 ? (
        <div className="mt-6 flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">{noOrdersText}</p>
        </div>
      ) : (
        <Card className="mt-6">
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{clientLabel}</TableHead>
                  <TableHead>{statusLabel}</TableHead>
                  <TableHead>{totalLabel}</TableHead>
                  <TableHead>{dateLabel}</TableHead>
                  <TableHead className="text-right">{actionsLabel}</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-medium">{order.clientName}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(order.status)}>
                        {order.status === "pending" && pendingStatus}
                        {order.status === "accepted" && acceptedStatus}
                        {order.status === "in-progress" && inProgressStatus}
                        {order.status === "ready" && readyStatus}
                        {order.status === "delivered" && deliveredStatus}
                      </Badge>
                    </TableCell>
                    <TableCell>${order.total.toFixed(2)}</TableCell>
                    <TableCell>{formatDate(order.createdAt)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedOrder(order)
                          setIsOrderDetailsOpen(true)
                        }}
                      >
                        <Eye className="mr-2 h-4 w-4" />
                        {viewDetailsLabel}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>{orderDetailsTitle}</DialogTitle>
            <DialogDescription>
              {clientLabel}: {selectedOrder?.clientName} ({selectedOrder?.clientPhone})
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-muted-foreground">{dateLabel}</p>
                  <p>{formatDate(selectedOrder.createdAt)}</p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{statusLabel}</p>
                  <Badge variant={getStatusBadgeVariant(selectedOrder.status)}>
                    {selectedOrder.status === "pending" && pendingStatus}
                    {selectedOrder.status === "accepted" && acceptedStatus}
                    {selectedOrder.status === "in-progress" && inProgressStatus}
                    {selectedOrder.status === "ready" && readyStatus}
                    {selectedOrder.status === "delivered" && deliveredStatus}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">{totalLabel}</p>
                  <p className="font-medium">${selectedOrder.total.toFixed(2)}</p>
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium">{orderItemsLabel}</h3>
                <div className="space-y-4">
                  {selectedOrder.items.map((item: OrderItem) => (
                    <div key={item.id} className="rounded-md border p-4">
                      <div className="flex flex-col gap-2">
                        <h4 className="font-medium">{item.productName}</h4>
                        <div className="grid grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="text-muted-foreground">{quantityLabel}</p>
                            <p>{item.quantity}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{priceLabel}</p>
                            <p>${item.price.toFixed(2)}</p>
                          </div>
                          <div>
                            <p className="text-muted-foreground">{totalLabel}</p>
                            <p>${(item.price * item.quantity).toFixed(2)}</p>
                          </div>
                        </div>
                        {item.observation && (
                          <div className="mt-2">
                            <p className="text-muted-foreground">{observationLabel}</p>
                            <p>{item.observation}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h3 className="mb-4 text-lg font-medium">{updateStatusLabel}</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant={selectedOrder.status === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "pending")}
                    disabled={isUpdating || selectedOrder.status === "pending"}
                  >
                    {pendingStatus}
                  </Button>
                  <Button
                    variant={selectedOrder.status === "accepted" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "accepted")}
                    disabled={isUpdating || selectedOrder.status === "accepted"}
                  >
                    {acceptedStatus}
                  </Button>
                  <Button
                    variant={selectedOrder.status === "in-progress" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "in-progress")}
                    disabled={isUpdating || selectedOrder.status === "in-progress"}
                  >
                    {inProgressStatus}
                  </Button>
                  <Button
                    variant={selectedOrder.status === "ready" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "ready")}
                    disabled={isUpdating || selectedOrder.status === "ready"}
                  >
                    {readyStatus}
                  </Button>
                  <Button
                    variant={selectedOrder.status === "delivered" ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleUpdateStatus(selectedOrder.id, "delivered")}
                    disabled={isUpdating || selectedOrder.status === "delivered"}
                  >
                    {deliveredStatus}
                  </Button>
                </div>
              </div>
              <div className="mt-4">
                <h3 className="mb-4 text-lg font-medium">{mounted ? t("orders.shareOrder") : "Share Order"}</h3>
                <div className="flex flex-wrap gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-green-500 text-white hover:bg-green-600"
                    onClick={() => {
                      if (selectedOrder) {
                        window.open(createWhatsAppLink(selectedOrder), "_blank")
                      }
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="white"
                      className="mr-2"
                    >
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                    </svg>
                    {mounted ? t("orders.shareViaWhatsApp") : "Share via WhatsApp"}
                  </Button>

                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => {
                      if (selectedOrder && selectedOrder.clientPhone) {
                        // Clean the phone number to only contain digits
                        const cleanPhone = selectedOrder.clientPhone.replace(/\D/g, "")
                        window.open(createWhatsAppLink(selectedOrder, cleanPhone), "_blank")
                      }
                    }}
                    disabled={!selectedOrder?.clientPhone}
                  >
                    {mounted ? t("orders.sendToClient") : "Send to Client"}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
