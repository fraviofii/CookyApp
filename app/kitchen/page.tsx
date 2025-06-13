"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { toast } from "@/components/ui/use-toast"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, Eye, Loader2 } from "lucide-react"
import { getOrders, updateOrderStatus } from "@/lib/db"
import { createWhatsAppLink } from "@/lib/whatsapp-utils"

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

export default function KitchenPage() {
  const { t } = useLanguage()
  const [orders, setOrders] = useState<Order[]>([])
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [isDetailsOpen, setIsDetailsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState("all")
  // Add a mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

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

  const handleViewDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsOpen(true)
  }

  const handleUpdateStatus = async (orderId: string, newStatus: Order["status"]) => {
    try {
      const success = await updateOrderStatus(orderId, newStatus)

      if (success) {
        // Update the order in the local state
        setOrders(orders.map((order) => (order.id === orderId ? { ...order, status: newStatus } : order)))

        // Update the selected order if it's open
        if (selectedOrder?.id === orderId) {
          setSelectedOrder({ ...selectedOrder, status: newStatus })
        }

        const statusMessages = {
          accepted: mounted ? t("kitchen.statusChangedToAccepted") : "Order status changed to accepted",
          "in-progress": mounted ? t("kitchen.statusChangedToInProgress") : "Order status changed to in-progress",
          ready: mounted ? t("kitchen.statusChangedToReady") : "Order status changed to ready",
          delivered: mounted ? t("kitchen.statusChangedToDelivered") : "Order status changed to delivered",
        }

        toast({
          title: mounted ? t("kitchen.orderUpdated") : "Order updated",
          description: `${mounted ? t("orders.orderNumber") : "Order #"}${orderId.slice(-4)} ${statusMessages[newStatus as keyof typeof statusMessages] || ""}`,
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
    }
  }

  const formatDate = (dateString: string | undefined) => {
    if (!dateString) return "N/A"
    try {
      const date = new Date(dateString)
      return new Intl.DateTimeFormat(mounted ? "pt-BR" : "en-US", {
        dateStyle: "short",
        timeStyle: "short",
      }).format(date)
    } catch (error) {
      console.error("Invalid date format:", dateString)
      return "Invalid date"
    }
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

  const filteredOrders = activeTab === "all" ? orders : orders.filter((order) => order.status === activeTab)

  // Translated text with fallbacks for SSR
  const allOrdersTab = mounted ? t("status.all") : "All Orders"
  const pendingTab = mounted ? t("status.pending") : "Pending"
  const acceptedTab = mounted ? t("status.accepted") : "Accepted"
  const inProgressTab = mounted ? t("status.inProgress") : "In Progress"
  const readyTab = mounted ? t("status.ready") : "Ready"
  const deliveredTab = mounted ? t("status.delivered") : "Delivered"
  const noOrdersText = mounted ? t("orders.noOrders") : "No orders found"
  const detailsText = mounted ? t("common.details") : "Details"
  const acceptText = mounted ? t("kitchen.accept") : "Accept"
  const startPreparingText = mounted ? t("kitchen.startPreparing") : "Start Preparing"
  const markReadyText = mounted ? t("kitchen.markReady") : "Mark Ready"
  const deliveredText = mounted ? t("kitchen.delivered") : "Delivered"
  const acceptOrderText = mounted ? t("kitchen.acceptOrder") : "Accept Order"
  const startPreparingOrderText = mounted ? t("kitchen.startPreparingOrder") : "Start Preparing"
  const markReadyOrderText = mounted ? t("kitchen.markReadyOrder") : "Mark Ready"
  const markDeliveredText = mounted ? t("kitchen.markDelivered") : "Mark Delivered"
  const statusText = mounted ? t("common.status") : "Status"
  const customerInfoText = mounted ? t("orders.customerInfo") : "Customer Information"
  const orderItemsText = mounted ? t("orders.orderItems") : "Order Items"
  const noteText = mounted ? t("orders.note") : "Note"
  const subtotalText = mounted ? t("common.subtotal") : "Subtotal"
  const taxText = mounted ? t("common.tax") : "Tax"
  const totalText = mounted ? t("common.total") : "Total"
  const itemsText = mounted ? t("orders.items") : "item(s)"

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{mounted ? t("common.loading") : "Loading..."}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      {mounted && (
        <div className="mb-6">
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">{allOrdersTab}</TabsTrigger>
              <TabsTrigger value="pending">{pendingTab}</TabsTrigger>
              <TabsTrigger value="accepted">{acceptedTab}</TabsTrigger>
              <TabsTrigger value="in-progress">{inProgressTab}</TabsTrigger>
              <TabsTrigger value="ready">{readyTab}</TabsTrigger>
              <TabsTrigger value="delivered">{deliveredTab}</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      )}

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredOrders.length === 0 ? (
          <div className="col-span-full flex h-40 items-center justify-center rounded-md border border-dashed">
            <p className="text-muted-foreground">{noOrdersText}</p>
          </div>
        ) : (
          filteredOrders.map((order) => (
            <Card key={order.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle>
                    {mounted ? t("orders.orderNumber") : "Order #"}
                    {order.id.slice(-4)}
                  </CardTitle>
                  {getStatusBadge(order.status)}
                </div>
                <CardDescription className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  {formatDate(order.createdAt)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="mb-4 space-y-1">
                  <div className="font-medium">{order.clientName}</div>
                  <div className="text-sm text-muted-foreground">{order.clientPhone}</div>
                </div>
                <div className="mb-4">
                  <div className="text-sm text-muted-foreground">
                    {order.items.length} {itemsText} - ${order.total.toFixed(2)}
                  </div>
                  <div className="mt-1 line-clamp-1 text-sm">
                    {order.items.map((item) => `${item.quantity}x ${item.productName}`).join(", ")}
                  </div>
                </div>
                <div className="flex flex-wrap gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleViewDetails(order)}>
                    <Eye className="mr-1 h-4 w-4" />
                    {detailsText}
                  </Button>
                  {order.status === "pending" && (
                    <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(order.id, "accepted")}>
                      {acceptText}
                    </Button>
                  )}
                  {order.status === "accepted" && (
                    <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(order.id, "in-progress")}>
                      {startPreparingText}
                    </Button>
                  )}
                  {order.status === "in-progress" && (
                    <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(order.id, "ready")}>
                      {markReadyText}
                    </Button>
                  )}
                  {order.status === "ready" && (
                    <Button variant="outline" size="sm" onClick={() => handleUpdateStatus(order.id, "delivered")}>
                      {deliveredText}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      <Dialog open={isDetailsOpen} onOpenChange={setIsDetailsOpen}>
        <DialogContent className="max-h-[90vh] overflow-auto sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{detailsText}</DialogTitle>
            <DialogDescription>
              {mounted ? t("orders.orderNumber") : "Order #"}
              {selectedOrder?.id.slice(-4)} - {selectedOrder ? formatDate(selectedOrder.createdAt) : ""}
            </DialogDescription>
          </DialogHeader>
          {selectedOrder && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium">{statusText}</h3>
                  {getStatusBadge(selectedOrder.status)}
                </div>
                <div className="flex gap-2">
                  {selectedOrder.status === "pending" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        handleUpdateStatus(selectedOrder.id, "accepted")
                        setIsDetailsOpen(false)
                      }}
                    >
                      {acceptOrderText}
                    </Button>
                  )}
                  {selectedOrder.status === "accepted" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        handleUpdateStatus(selectedOrder.id, "in-progress")
                        setIsDetailsOpen(false)
                      }}
                    >
                      {startPreparingOrderText}
                    </Button>
                  )}
                  {selectedOrder.status === "in-progress" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        handleUpdateStatus(selectedOrder.id, "ready")
                        setIsDetailsOpen(false)
                      }}
                    >
                      {markReadyOrderText}
                    </Button>
                  )}
                  {selectedOrder.status === "ready" && (
                    <Button
                      size="sm"
                      onClick={() => {
                        handleUpdateStatus(selectedOrder.id, "delivered")
                        setIsDetailsOpen(false)
                      }}
                    >
                      {markDeliveredText}
                    </Button>
                  )}
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">{customerInfoText}</h3>
                <div className="rounded-md border p-3">
                  <div className="font-medium">{selectedOrder.clientName}</div>
                  <div className="text-sm text-muted-foreground">{selectedOrder.clientPhone}</div>
                </div>
              </div>

              <div>
                <h3 className="mb-2 font-medium">{orderItemsText}</h3>
                <div className="rounded-md border">
                  {selectedOrder.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b p-3 last:border-0">
                      <div>
                        <div className="font-medium">
                          {item.quantity}x {item.productName}
                        </div>
                        {item.observation && (
                          <div className="text-sm text-muted-foreground">
                            {noteText}: {item.observation}
                          </div>
                        )}
                      </div>
                      <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="rounded-md border p-3">
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground">{subtotalText}</span>
                  <span>${selectedOrder.total.toFixed(2)}</span>
                </div>
                <div className="mb-2 flex items-center justify-between">
                  <span className="text-muted-foreground">{taxText}</span>
                  <span>$0.00</span>
                </div>
                <div className="flex items-center justify-between border-t pt-2">
                  <span className="font-medium">{totalText}</span>
                  <span className="font-bold">${selectedOrder.total.toFixed(2)}</span>
                </div>
              </div>
            </div>
          )}
          {selectedOrder && selectedOrder.clientPhone && (
            <div className="mt-4">
              <Button
                variant="outline"
                size="sm"
                className="bg-green-500 text-white hover:bg-green-600 w-full"
                onClick={() => {
                  const cleanPhone = selectedOrder.clientPhone.replace(/\D/g, "")
                  window.open(createWhatsAppLink(selectedOrder, cleanPhone), "_blank")
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
                {mounted ? t("kitchen.contactCustomer") : "Contact Customer via WhatsApp"}
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
