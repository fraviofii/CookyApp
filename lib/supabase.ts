import { createClient } from "@supabase/supabase-js"

// Type definitions for our database tables
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          name: string
          email: string
          password: string // In a real app, this would be hashed
          role: "manager" | "employee" | "sales"
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          password: string
          role: "manager" | "employee" | "sales"
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          password?: string
          role?: "manager" | "employee" | "sales"
          created_at?: string
        }
      }
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          created_at?: string
        }
      }
      clients: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          created_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          created_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          created_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          client_id: string
          total: number
          status: "pending" | "accepted" | "in-progress" | "ready" | "delivered"
          created_at: string
        }
        Insert: {
          id?: string
          client_id: string
          total: number
          status: "pending" | "accepted" | "in-progress" | "ready" | "delivered"
          created_at?: string
        }
        Update: {
          id?: string
          client_id?: string
          total?: number
          status?: "pending" | "accepted" | "in-progress" | "ready" | "delivered"
          created_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          observation: string
          created_at: string
        }
        Insert: {
          id?: string
          order_id: string
          product_id: string
          quantity: number
          price: number
          observation: string
          created_at?: string
        }
        Update: {
          id?: string
          order_id?: string
          product_id?: string
          quantity?: number
          price?: number
          observation?: string
          created_at?: string
        }
      }
    }
  }
}

// Update the supabase client initialization with better error handling
// and fallback values for environment variables

// Create a single supabase client for interacting with your database
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "https://your-project.supabase.co"
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "your-anon-key"

// Add console logs to help debug the environment variables
console.log("Supabase URL:", process.env.NEXT_PUBLIC_SUPABASE_URL ? "Set" : "Not set")
console.log("Supabase Key:", process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? "Set" : "Not set")

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)
