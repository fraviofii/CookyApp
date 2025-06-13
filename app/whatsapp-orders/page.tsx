"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { WhatsAppQRCode } from "@/components/whatsapp-qr-code"
import { WhatsAppOrderButton } from "@/components/whatsapp-order-button"
import { ExternalLink, AlertCircle, CheckCircle2 } from "lucide-react"

export default function WhatsAppOrdersPage() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState("")

  useEffect(() => {
    setMounted(true)
    // Load saved WhatsApp number from localStorage
    const savedNumber = localStorage.getItem("whatsappBusinessNumber")
    if (savedNumber) {
      setWhatsappNumber(savedNumber)
    }
  }, [])

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {mounted ? t("whatsapp.whatsappOrders") : "WhatsApp Orders"}
          </h2>
          <p className="text-muted-foreground">
            {mounted ? t("whatsapp.manageWhatsappOrders") : "Manage orders received via WhatsApp"}
          </p>
        </div>
      </div>

      {!whatsappNumber ? (
        <Alert variant="destructive" className="mt-6">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{mounted ? t("whatsapp.noNumberConfigured") : "No WhatsApp Number Configured"}</AlertTitle>
          <AlertDescription>
            {mounted ? (
              <>
                {t("whatsapp.pleaseConfigureNumber")}{" "}
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="/settings">{t("settings.title")}</a>
                </Button>
              </>
            ) : (
              <>
                Please configure your WhatsApp business number in{" "}
                <Button variant="link" className="p-0 h-auto" asChild>
                  <a href="/settings">Settings</a>
                </Button>
              </>
            )}
          </AlertDescription>
        </Alert>
      ) : (
        <div className="mt-6 space-y-6">
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertTitle>{mounted ? t("whatsapp.whatsappIntegrationActive") : "WhatsApp Integration Active"}</AlertTitle>
            <AlertDescription>
              {mounted ? t("whatsapp.openWhatsappToViewOrders") : "Open WhatsApp to view and process incoming orders."}
            </AlertDescription>
          </Alert>

          <Card>
            <CardHeader>
              <CardTitle>{mounted ? t("whatsapp.howToManageOrders") : "How to Manage WhatsApp Orders"}</CardTitle>
              <CardDescription>
                {mounted ? t("whatsapp.followTheseSteps") : "Follow these steps to manage orders received via WhatsApp"}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">1. {mounted ? t("whatsapp.openWhatsapp") : "Open WhatsApp"}</h3>
                <p className="text-sm text-muted-foreground">
                  {mounted
                    ? t("whatsapp.openWhatsappDesc")
                    : "Open WhatsApp on your phone or WhatsApp Web on your computer."}
                </p>
                <Button variant="outline" asChild>
                  <a href="https://web.whatsapp.com" target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {mounted ? t("whatsapp.openWhatsappWeb") : "Open WhatsApp Web"}
                  </a>
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">2. {mounted ? t("whatsapp.reviewMessages") : "Review Messages"}</h3>
                <p className="text-sm text-muted-foreground">
                  {mounted
                    ? t("whatsapp.reviewMessagesDesc")
                    : "Check for new messages from customers using the order template."}
                </p>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  3. {mounted ? t("whatsapp.createOrder") : "Create Order in System"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {mounted
                    ? t("whatsapp.createOrderDesc")
                    : "After receiving an order via WhatsApp, create it in the system to track and process it."}
                </p>
                <Button asChild>
                  <a href="/order">{mounted ? t("orders.createNewOrder") : "Create New Order"}</a>
                </Button>
              </div>

              <div className="space-y-2">
                <h3 className="text-lg font-medium">
                  4. {mounted ? t("whatsapp.confirmOrder") : "Confirm Order with Customer"}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {mounted
                    ? t("whatsapp.confirmOrderDesc")
                    : "Reply to the customer to confirm their order has been received and is being processed."}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>{mounted ? t("whatsapp.orderButton") : "Order Button"}</CardTitle>
                <CardDescription>
                  {mounted
                    ? t("whatsapp.orderButtonDesc")
                    : "Share this button with customers to place orders via WhatsApp"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <WhatsAppOrderButton phoneNumber={whatsappNumber} />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>{mounted ? t("whatsapp.orderQRCode") : "Order QR Code"}</CardTitle>
                <CardDescription>
                  {mounted ? t("whatsapp.orderQRCodeDesc") : "Display this QR code in your store for easy ordering"}
                </CardDescription>
              </CardHeader>
              <CardContent className="flex justify-center">
                <WhatsAppQRCode phoneNumber={whatsappNumber} size={150} />
              </CardContent>
            </Card>
          </div>
        </div>
      )}
    </DashboardLayout>
  )
}
