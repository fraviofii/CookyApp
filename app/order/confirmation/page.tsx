"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Home } from "lucide-react"

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
  status: string
  createdAt: string
}

export default function OrderConfirmationPage() {
  const [order, setOrder] = useState<Order | null>(null)
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    // In a real app, this would be an API call to get the order details
    // For demo purposes, we'll get it from localStorage
    const storedOrder = localStorage.getItem("currentOrder")
    if (storedOrder) {
      setOrder(JSON.parse(storedOrder))
    }
  }, [])

  if (!order) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>{mounted ? t("orders.noOrders") : "No Order Found"}</CardTitle>
            <CardDescription>
              {mounted ? t("orders.noOrderDetails") : "We couldn't find your order details"}
            </CardDescription>
          </CardHeader>
          <CardFooter>
            <Link href="/order" className="w-full">
              <Button className="w-full">{mounted ? t("orders.placeNewOrder") : "Place a New Order"}</Button>
            </Link>
          </CardFooter>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date)
  }

  const getStatusBadge = (status: string) => {
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
      <Badge variant="outline" className={colorMap[status as keyof typeof colorMap] || ""}>
        {statusMap[status as keyof typeof statusMap] || "Unknown"}
      </Badge>
    )
  }

  // Translated text
  const orderConfirmedText = mounted ? t("orders.orderConfirmed") : "Order Confirmed!"
  const thankYouText = mounted ? t("orders.thankYou") : "Thank you for your order. We'll start preparing it right away."
  const orderDetailsText = mounted ? t("orders.orderDetails") : "Order Details"
  const customerInfoText = mounted ? t("orders.customerInfo") : "Customer Information"
  const nameText = mounted ? t("common.name") : "Name"
  const phoneText = mounted ? t("common.phone") : "Phone"
  const subtotalText = mounted ? t("common.subtotal") : "Subtotal"
  const taxText = mounted ? t("common.tax") : "Tax"
  const totalText = mounted ? t("common.total") : "Total"
  const estimatedTimeText = mounted ? t("orders.estimatedTime") : "Estimated Preparation Time"
  const readyInText = mounted ? t("orders.readyIn") : "Your order will be ready in approximately 20-30 minutes"
  const returnHomeText = mounted ? t("orders.returnHome") : "Return to Home"
  const placedOnText = mounted ? t("orders.placedOn") : "Placed on"
  const noteText = mounted ? t("orders.note") : "Note"

  return (
    <div className="min-h-screen bg-muted/40">
      <header className="sticky top-0 z-40 border-b bg-background">
        <div className="container flex h-16 items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <Link href="/">
              <h1 className="text-2xl font-bold">Sucré</h1>
            </Link>
          </div>
        </div>
      </header>

      <main className="container py-10">
        <div className="mx-auto max-w-2xl">
          <div className="mb-8 flex flex-col items-center justify-center text-center">
            <div className="mb-4 rounded-full bg-green-100 p-3">
              <CheckCircle className="h-12 w-12 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold">{orderConfirmedText}</h1>
            <p className="mt-2 text-muted-foreground">{thankYouText}</p>
          </div>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>
                    {t("orders.orderNumber")} {order.id.slice(-4)}
                  </CardTitle>
                  <CardDescription>
                    {placedOnText} {formatDate(order.createdAt)}
                  </CardDescription>
                </div>
                {getStatusBadge(order.status)}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="mb-2 font-medium">{orderDetailsText}</h3>
                <div className="rounded-md border">
                  {order.items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between border-b p-4 last:border-0">
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

              <div className="rounded-md border p-4">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-muted-foreground">{subtotalText}</span>
                  <span>${order.total.toFixed(2)}</span>
                </div>
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-muted-foreground">{taxText}</span>
                  <span>$0.00</span>
                </div>
                <div className="flex items-center justify-between border-t pt-4">
                  <span className="font-medium">{totalText}</span>
                  <span className="font-bold">${order.total.toFixed(2)}</span>
                </div>
              </div>

              <div className="rounded-md border p-4">
                <h3 className="mb-2 font-medium">{customerInfoText}</h3>
                <div className="text-sm">
                  <p>
                    <span className="font-medium">{nameText}:</span> {order.clientName}
                  </p>
                  <p>
                    <span className="font-medium">{phoneText}:</span> {order.clientPhone}
                  </p>
                </div>
              </div>

              <div className="rounded-md border bg-muted/50 p-4">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <h3 className="font-medium">{estimatedTimeText}</h3>
                    <p className="text-sm text-muted-foreground">{readyInText}</p>
                  </div>
                </div>
              </div>
            </CardContent>
            <CardFooter className="flex flex-col space-y-4">
              <Link href="/" className="w-full">
                <Button className="w-full" variant="outline">
                  <Home className="mr-2 h-4 w-4" />
                  {returnHomeText}
                </Button>
              </Link>
            </CardFooter>
          </Card>
        </div>
      </main>
    </div>
  )
}
