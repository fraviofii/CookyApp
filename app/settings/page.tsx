"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { WhatsAppQRCode } from "@/components/whatsapp-qr-code"
import { WhatsAppOrderButton } from "@/components/whatsapp-order-button"

export default function SettingsPage() {
  const { t } = useLanguage()
  const [mounted, setMounted] = useState(false)
  const [whatsappNumber, setWhatsappNumber] = useState("")
  const [savedWhatsappNumber, setSavedWhatsappNumber] = useState("")

  useEffect(() => {
    setMounted(true)
    // Load saved WhatsApp number from localStorage
    const savedNumber = localStorage.getItem("whatsappBusinessNumber")
    if (savedNumber) {
      setWhatsappNumber(savedNumber)
      setSavedWhatsappNumber(savedNumber)
    }
  }, [])

  const saveWhatsappNumber = () => {
    // Basic validation
    if (!whatsappNumber) {
      toast({
        title: mounted ? t("settings.error") : "Error",
        description: mounted ? t("settings.enterValidNumber") : "Please enter a valid phone number",
        variant: "destructive",
      })
      return
    }

    // Save to localStorage
    localStorage.setItem("whatsappBusinessNumber", whatsappNumber)
    setSavedWhatsappNumber(whatsappNumber)

    toast({
      title: mounted ? t("settings.success") : "Success",
      description: mounted ? t("settings.whatsappNumberSaved") : "WhatsApp business number saved successfully",
    })
  }

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{mounted ? t("settings.title") : "Settings"}</h2>
          <p className="text-muted-foreground">
            {mounted ? t("settings.subtitle") : "Configure your application settings"}
          </p>
        </div>
      </div>

      <Tabs defaultValue="whatsapp" className="mt-6">
        <TabsList>
          <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
          <TabsTrigger value="general">{mounted ? t("settings.general") : "General"}</TabsTrigger>
        </TabsList>
        <TabsContent value="whatsapp" className="space-y-4 mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{mounted ? t("settings.whatsappIntegration") : "WhatsApp Integration"}</CardTitle>
              <CardDescription>
                {mounted
                  ? t("settings.configureWhatsappNumber")
                  : "Configure your WhatsApp business phone number for order processing"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="whatsapp-number">
                    {mounted ? t("settings.whatsappBusinessNumber") : "WhatsApp Business Number"}
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="whatsapp-number"
                      placeholder="5511999999999"
                      value={whatsappNumber}
                      onChange={(e) => setWhatsappNumber(e.target.value)}
                    />
                    <Button onClick={saveWhatsappNumber}>{mounted ? t("common.save") : "Save"}</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {mounted
                      ? t("settings.whatsappNumberFormat")
                      : "Enter your full number with country code, no spaces or special characters (e.g., 5511999999999)"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {savedWhatsappNumber && (
            <>
              <Card>
                <CardHeader>
                  <CardTitle>{mounted ? t("settings.whatsappOrderButton") : "WhatsApp Order Button"}</CardTitle>
                  <CardDescription>
                    {mounted
                      ? t("settings.whatsappOrderButtonDesc")
                      : "Add this button to your website or share the link with customers"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center my-4">
                    <WhatsAppOrderButton phoneNumber={savedWhatsappNumber} />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{mounted ? t("settings.whatsappQRCode") : "WhatsApp QR Code"}</CardTitle>
                  <CardDescription>
                    {mounted
                      ? t("settings.whatsappQRCodeDesc")
                      : "Display this QR code in your store for customers to scan and place orders"}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-center">
                    <WhatsAppQRCode phoneNumber={savedWhatsappNumber} />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button
                    onClick={() => {
                      const canvas = document.querySelector('img[alt="WhatsApp Order QR Code"]') as HTMLImageElement
                      if (canvas) {
                        const link = document.createElement("a")
                        link.download = "whatsapp-order-qr-code.png"
                        link.href = canvas.src
                        link.click()
                      }
                    }}
                  >
                    {mounted ? t("settings.downloadQRCode") : "Download QR Code"}
                  </Button>
                </CardFooter>
              </Card>
            </>
          )}
        </TabsContent>
        <TabsContent value="general" className="mt-4">
          <Card>
            <CardHeader>
              <CardTitle>{mounted ? t("settings.generalSettings") : "General Settings"}</CardTitle>
              <CardDescription>
                {mounted ? t("settings.generalSettingsDesc") : "Configure general application settings"}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">{mounted ? t("settings.comingSoon") : "Coming soon"}</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </DashboardLayout>
  )
}
