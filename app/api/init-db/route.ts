import { NextResponse } from "next/server"
import { seedDatabase } from "@/lib/seed-db"
import { supabase } from "@/lib/supabase"

export async function GET() {
  try {
    // First, create the tables
    await createTables()

    // Then seed the database
    const result = await seedDatabase()

    return NextResponse.json({
      success: true,
      message: "Database initialized successfully",
      data: result,
    })
  } catch (error) {
    console.error("Error initializing database:", error)
    return NextResponse.json(
      {
        success: false,
        message: "Failed to initialize database",
        error: (error as Error).message,
      },
      { status: 500 },
    )
  }
}

async function createTables() {
  console.log("Creating database tables...")

  try {
    // Create users table
    const { error: usersError } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS users (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255) UNIQUE NOT NULL,
          password VARCHAR(255) NOT NULL,
          role VARCHAR(50) NOT NULL CHECK (role IN ('manager', 'employee', 'sales')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `,
    })

    if (usersError) {
      console.error("Error creating users table:", usersError)
      throw new Error(`Failed to create users table: ${usersError.message}`)
    }

    // Create products table
    const { error: productsError } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS products (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          description TEXT,
          price DECIMAL(10, 2) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `,
    })

    if (productsError) {
      console.error("Error creating products table:", productsError)
      throw new Error(`Failed to create products table: ${productsError.message}`)
    }

    // Create clients table
    const { error: clientsError } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS clients (
          id UUID PRIMARY KEY,
          name VARCHAR(255) NOT NULL,
          email VARCHAR(255),
          phone VARCHAR(50) NOT NULL,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `,
    })

    if (clientsError) {
      console.error("Error creating clients table:", clientsError)
      throw new Error(`Failed to create clients table: ${clientsError.message}`)
    }

    // Create orders table
    const { error: ordersError } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS orders (
          id UUID PRIMARY KEY,
          client_id UUID NOT NULL REFERENCES clients(id),
          total DECIMAL(10, 2) NOT NULL,
          status VARCHAR(50) NOT NULL CHECK (status IN ('pending', 'accepted', 'in-progress', 'ready', 'delivered')),
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `,
    })

    if (ordersError) {
      console.error("Error creating orders table:", ordersError)
      throw new Error(`Failed to create orders table: ${ordersError.message}`)
    }

    // Create order_items table
    const { error: orderItemsError } = await supabase.rpc("exec_sql", {
      sql_query: `
        CREATE TABLE IF NOT EXISTS order_items (
          id UUID PRIMARY KEY,
          order_id UUID NOT NULL REFERENCES orders(id),
          product_id UUID NOT NULL REFERENCES products(id),
          quantity INTEGER NOT NULL,
          price DECIMAL(10, 2) NOT NULL,
          observation TEXT,
          created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
        )
      `,
    })

    if (orderItemsError) {
      console.error("Error creating order_items table:", orderItemsError)
      throw new Error(`Failed to create order_items table: ${orderItemsError.message}`)
    }

    console.log("All tables created successfully")
  } catch (error) {
    console.error("Error creating tables:", error)
    throw error
  }
}
