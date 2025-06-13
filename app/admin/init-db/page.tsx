"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { CheckCircle, Database, Loader2 } from "lucide-react"
import Link from "next/link"

export default function InitDbPage() {
  const [isInitializing, setIsInitializing] = useState(false)
  const [result, setResult] = useState<{
    success: boolean
    message: string
    error?: string
    data?: any
  } | null>(null)

  const initializeDatabase = async () => {
    setIsInitializing(true)
    setResult(null)

    try {
      const response = await fetch("/api/init-db")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        message: "Failed to initialize database",
        error: (error as Error).message,
      })
    } finally {
      setIsInitializing(false)
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-muted/40 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <div className="flex justify-center mb-4">
            <Database className="h-12 w-12 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold text-center">Database Initialization</CardTitle>
          <CardDescription className="text-center">Set up your database tables and seed initial data</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {result && (
            <Alert variant={result.success ? "default" : "destructive"}>
              <div className="flex items-center gap-2">
                {result.success ? <CheckCircle className="h-4 w-4" /> : <Database className="h-4 w-4" />}
                <AlertTitle>{result.success ? "Success" : "Error"}</AlertTitle>
              </div>
              <AlertDescription>
                {result.message}
                {result.error && (
                  <div className="mt-2 text-sm">
                    <code>{result.error}</code>
                  </div>
                )}
              </AlertDescription>
            </Alert>
          )}

          <div className="text-sm text-muted-foreground">
            <p className="mb-2">This will:</p>
            <ol className="list-decimal pl-5 space-y-1">
              <li>Create all necessary database tables if they don't exist</li>
              <li>Seed the database with initial users, products, and clients</li>
            </ol>
            <p className="mt-2 font-medium">
              Warning: This is meant to be run only once when setting up your application.
            </p>
          </div>
          <div className="mt-4 p-3 bg-blue-50 text-blue-800 rounded-md text-sm">
            <p className="font-medium">Alternative Setup Method</p>
            <p className="mt-1">
              If you're having trouble with the automatic setup, you can manually run the SQL script in the Supabase SQL
              Editor:
            </p>
            <ol className="list-decimal pl-5 mt-2 space-y-1">
              <li>
                Go to your{" "}
                <a href="https://app.supabase.com" target="_blank" rel="noopener noreferrer" className="underline">
                  Supabase project
                </a>
              </li>
              <li>Navigate to the SQL Editor</li>
              <li>
                Copy and paste the SQL script from the <code>database-setup.sql</code> file
              </li>
              <li>Run the script</li>
            </ol>
            <p className="mt-2">
              After setting up the database, you can{" "}
              <Link href="/login" className="underline">
                return to the login page
              </Link>
              .
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button className="w-full" onClick={initializeDatabase} disabled={isInitializing}>
            {isInitializing ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Initializing...
              </>
            ) : (
              "Initialize Database"
            )}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
