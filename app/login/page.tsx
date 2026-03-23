"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "@/components/auth-provider"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Cookie } from "lucide-react"
import { LanguageSwitcher } from "@/components/language-switcher"
import { checkTablesExist } from "@/lib/db"

export default function LoginPage() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const { t } = useLanguage()
  // Add a mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)
  const [dbInitialized, setDbInitialized] = useState<boolean | null>(null)

  useEffect(() => {
    setMounted(true)
  }, [])

  useEffect(() => {
    const checkDb = async () => {
      const exists = await checkTablesExist()
      setDbInitialized(exists)
    }

    checkDb()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await login(email, password)
  }

  // Use simple text for labels during SSR to avoid hydration mismatch
  const emailLabel = mounted ? t("common.email") : "Email"
  const passwordLabel = mounted ? t("common.password") : "Password"
  const loginButton = mounted ? t("common.login") : "Login"
  const credentialsText = mounted ? t("common.enterCredentials") : "Enter your credentials to access your account"

  const dbMessage = !dbInitialized ? (
    <div className="mb-4 p-3 bg-yellow-50 text-yellow-800 rounded-md text-sm">
      <p className="font-medium">Database not initialized</p>
      <p>
        Please visit{" "}
        <a href="/admin/init-db" className="underline">
          the database setup page
        </a>{" "}
        to initialize your database.
      </p>
    </div>
  ) : null

  const debugInfo =
    process.env.NODE_ENV === "development" ? (
      <div className="mb-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
        <p className="font-medium">Debug Information</p>
        <p>Database Initialized: {dbInitialized === null ? "Checking..." : dbInitialized ? "Yes" : "No"}</p>
      </div>
    ) : null

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <div className="absolute top-4 right-4">
        <LanguageSwitcher />
      </div>
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <Cookie className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Cooky App</CardTitle>
          <CardDescription className="text-center">{credentialsText}</CardDescription>
        </CardHeader>
        {dbMessage}
        {debugInfo}
        <form onSubmit={handleSubmit} className="space-y-4">
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">{emailLabel}</Label>
              <Input
                id="email"
                type="email"
                placeholder="m@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">{passwordLabel}</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full">
              {loginButton}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
