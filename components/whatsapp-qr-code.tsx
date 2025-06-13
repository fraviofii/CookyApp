"use client"

import { useLanguage } from "@/lib/i18n/language-context"
import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

type WhatsAppQRCodeProps = {
  phoneNumber: string
  size?: number
  className?: string
}

export function WhatsAppQRCode({ phoneNumber, size = 200, className }: WhatsAppQRCodeProps) {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [businessPhone, setBusinessPhone] = useState(phoneNumber || "5511999999999") // Default number

  useEffect(() => {
    setMounted(true)
    // If a phone number is provided, use it
    if (phoneNumber) {
      setBusinessPhone(phoneNumber.replace(/\D/g, ""))
    }
  }, [phoneNumber])

  // Create a template message for customers to fill out
  const createOrderTemplate = () => {
    let message = `*${mounted ? t("whatsapp.newOrderRequest") : "New Order Request"}*\n\n`
    message += `${mounted ? t("whatsapp.orderInstructions") : "Please fill out the following information to place your order:"}\n\n`
    message += `*${mounted ? t("common.name") : "Name"}*: \n`
    message += `*${mounted ? t("common.phone") : "Phone"}*: \n\n`
    message += `*${mounted ? t("whatsapp.orderDetails") : "Order Details"}*:\n`
    message += `(${mounted ? t("whatsapp.productQuantityFormat") : "Product name - Quantity"})\n\n`
    message += `1. \n2. \n3. \n\n`
    message += `*${mounted ? t("whatsapp.specialInstructions") : "Special Instructions"}*:\n\n`
    message += `${mounted ? t("whatsapp.thankYou") : "Thank you for your order!"}`

    return encodeURIComponent(message)
  }

  // Generate QR code URL using the Google Charts API
  const qrCodeUrl = `https://chart.googleapis.com/chart?cht=qr&chl=https://wa.me/${businessPhone}?text=${createOrderTemplate()}&chs=${size}x${size}`

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle>{mounted ? t("whatsapp.scanToOrder") : "Scan to Order"}</CardTitle>
        <CardDescription>
          {mounted
            ? t("whatsapp.scanQRCodeToOrder")
            : "Scan this QR code with your phone to place an order via WhatsApp"}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center">
        <img src={qrCodeUrl || "/placeholder.svg"} alt="WhatsApp Order QR Code" width={size} height={size} />
      </CardContent>
    </Card>
  )
}
