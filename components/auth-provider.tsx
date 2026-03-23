"use client"

import type React from "react"

import { createContext, useContext, useEffect, useState } from "react"
import { useRouter, usePathname } from "next/navigation"
import { toast } from "@/components/ui/use-toast"
import { useLanguage } from "@/lib/i18n/language-context"
import { getUserByEmail, checkTablesExist } from "@/lib/db"

type User = {
  id: string
  name: string
  email: string
  role: "manager" | "employee" | "sales"
}

type AuthContextType = {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  isLoading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const pathname = usePathname()

  // Initialize language context outside the try-catch block
  const languageContext = useLanguage()

  const { t } = languageContext

  useEffect(() => {
    // Check if user is stored in localStorage
    try {
      const storedUser = localStorage.getItem("user")
      if (storedUser) {
        setUser(JSON.parse(storedUser))
      }
    } catch (error) {
      console.error("Error loading user from localStorage:", error)
    }
    setIsLoading(false)
  }, [])

  useEffect(() => {
    // Protect routes that require authentication
    const protectedPaths = [
      "/dashboard",
      "/users",
      "/products",
      "/kitchen",
      "/reports",
      "/clients",
      "/order",
      "/orders",
    ]
    const managerOnlyPaths = ["/users", "/products", "/reports"]
    const salesAndManagerPaths = ["/clients", "/order", "/orders", "/dashboard"]
    const kitchenPaths = ["/kitchen"]

    if (!isLoading) {
      // Redirect from home to login if not logged in
      if (pathname === "/" && !user) {
        router.push("/login")
        return
      }

      if (protectedPaths.some((path) => pathname.startsWith(path))) {
        if (!user) {
          router.push("/login")
          toast({
            title: t("auth.required"),
            description: "Please login to access this page",
            variant: "destructive",
          })
        } else if (managerOnlyPaths.some((path) => pathname.startsWith(path)) && user.role !== "manager") {
          // Redirect non-managers from manager-only paths
          if (user.role === "sales") {
            router.push("/clients")
          } else {
            router.push("/kitchen")
          }
          toast({
            title: t("auth.accessDenied"),
            description: t("auth.noPermission"),
            variant: "destructive",
          })
        } else if (
          salesAndManagerPaths.some((path) => pathname.startsWith(path)) &&
          user.role !== "manager" &&
          user.role !== "sales"
        ) {
          // Redirect non-sales/non-managers from sales paths
          router.push("/kitchen")
          toast({
            title: t("auth.accessDenied"),
            description: t("auth.noPermission"),
            variant: "destructive",
          })
        } else if (
          kitchenPaths.some((path) => pathname.startsWith(path)) &&
          user.role !== "manager" &&
          user.role !== "employee"
        ) {
          // Redirect sales from kitchen paths
          router.push("/clients")
          toast({
            title: t("auth.accessDenied"),
            description: t("auth.noPermission"),
            variant: "destructive",
          })
        }
      }
    }
  }, [pathname, user, isLoading, router, t])

  const login = async (email: string, password: string) => {
    try {
      // Check if tables exist first
      const tablesExist = await checkTablesExist()

      if (!tablesExist) {
        toast({
          title: t("login.failed"),
          description: "Database not initialized. Please visit /admin/init-db to set up your database.",
          variant: "destructive",
        })
        return
      }

      // Get user from database
      const dbUser = await getUserByEmail(email)

      if (dbUser && dbUser.password === password) {
        // In a real app, you would use a secure password comparison
        const user = {
          id: dbUser.id,
          name: dbUser.name,
          email: dbUser.email,
          role: dbUser.role,
        }

        setUser(user)
        localStorage.setItem("user", JSON.stringify(user))

        // Redirect based on role
        setTimeout(() => {
          if (user.role === "employee") {
            router.push("/kitchen")
          } else if (user.role === "sales") {
            router.push("/clients")
          } else {
            router.push("/dashboard")
          }

          toast({
            title: t("login.success"),
            description: `${t("common.welcome")}, ${t(`common.${user.role}`)}!`,
          })
        }, 0)
      } else {
        toast({
          title: t("login.failed"),
          description: t("login.invalidCredentials"),
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Login error:", error)
      toast({
        title: t("login.failed"),
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      })
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("user")
    router.push("/login")
    toast({
      title: t("common.logout"),
      description: t("login.loggedOut"),
    })
  }

  return <AuthContext.Provider value={{ user, login, logout, isLoading }}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
