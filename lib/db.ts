import { supabase } from "./supabase"
import { v4 as uuidv4 } from "uuid"

// Update the checkTablesExist function with better error handling

export async function checkTablesExist() {
  try {
    // Check if Supabase URL and key are properly set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Supabase URL or key is not set in environment variables")
      return false
    }

    // Try to query the users table
    const { data, error } = await supabase.from("users").select("count").limit(1)

    // If there's an error about the relation not existing, tables don't exist
    if (error && error.message.includes('relation "public.users" does not exist')) {
      return false
    }

    // If we're in development mode and there's any other error, log it but return true
    // to allow development without a real database
    if (error && process.env.NODE_ENV === "development") {
      console.warn("Error checking if tables exist, but continuing in development mode:", error)
      return true
    }

    return !error
  } catch (error) {
    console.error("Error checking if tables exist:", error)
    // In development mode, return true to allow development without a database
    if (process.env.NODE_ENV === "development") {
      console.warn("Allowing development mode without database")
      return true
    }
    return false
  }
}

// Types
export type User = {
  id: string
  name: string
  email: string
  password: string // In a real app, this would be hashed
  role: "manager" | "employee" | "sales"
}

export type Product = {
  id: string
  name: string
  description: string
  price: number
}

export type OrderItem = {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  observation: string
}

export type Order = {
  id: string
  clientName: string
  clientPhone: string
  items: OrderItem[]
  total: number
  status: "pending" | "accepted" | "in-progress" | "ready" | "delivered"
  createdAt: string
}

export type Client = {
  id: string
  name: string
  email: string
  phone: string
}

// User functions
export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from("users").select("*")

  if (error) {
    console.error("Error fetching users:", error)
    return []
  }

  return data.map((user) => ({
    id: user.id,
    name: user.name,
    email: user.email,
    password: user.password,
    role: user.role,
  }))
}

export const getUserById = async (id: string): Promise<User | null> => {
  const { data, error } = await supabase.from("users").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching user:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    password: data.password,
    role: data.role,
  }
}

// Update the getUserByEmail function with better error handling

// Update the getUserByEmail function to handle non-existent tables
export async function getUserByEmail(email: string) {
  try {
    // First check if tables exist
    const tablesExist = await checkTablesExist()
    if (!tablesExist) {
      console.log("Tables do not exist yet")
      return null
    }

    // Check if Supabase URL and key are properly set
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      console.error("Supabase URL or key is not set in environment variables")
      return null
    }

    const { data, error } = await supabase.from("users").select("*").eq("email", email).single()

    if (error) {
      console.error("Error fetching user by email:", error.message)
      return null
    }

    return data
  } catch (error) {
    console.error("Error fetching user by email:", error)
    // Return a mock user for development purposes if in development mode
    if (process.env.NODE_ENV === "development") {
      console.log("Returning mock user for development")
      return {
        id: "00000000-0000-0000-0000-000000000001",
        name: "Manager User",
        email: "manager@cookyapp.com",
        password: "password",
        role: "manager",
      }
    }
    return null
  }
}

export const createUser = async (user: Omit<User, "id">): Promise<User | null> => {
  const newUser = {
    id: uuidv4(),
    ...user,
  }

  const { data, error } = await supabase.from("users").insert([newUser]).select()

  if (error) {
    console.error("Error creating user:", error)
    return null
  }

  return {
    id: data[0].id,
    name: data[0].name,
    email: data[0].email,
    password: data[0].password,
    role: data[0].role,
  }
}

export const updateUser = async (id: string, user: Partial<User>): Promise<User | null> => {
  const { data, error } = await supabase.from("users").update(user).eq("id", id).select()

  if (error) {
    console.error("Error updating user:", error)
    return null
  }

  if (data.length === 0) {
    return null
  }

  return {
    id: data[0].id,
    name: data[0].name,
    email: data[0].email,
    password: data[0].password,
    role: data[0].role,
  }
}

export const deleteUser = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("users").delete().eq("id", id)

  if (error) {
    console.error("Error deleting user:", error)
    return false
  }

  return true
}

// Product functions
export const getProducts = async (): Promise<Product[]> => {
  const { data, error } = await supabase.from("products").select("*")

  if (error) {
    console.error("Error fetching products:", error)
    return []
  }

  return data.map((product) => ({
    id: product.id,
    name: product.name,
    description: product.description,
    price: product.price,
  }))
}

export const getProductById = async (id: string): Promise<Product | null> => {
  const { data, error } = await supabase.from("products").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching product:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    description: data.description,
    price: data.price,
  }
}

export const createProduct = async (product: Omit<Product, "id">): Promise<Product | null> => {
  const newProduct = {
    id: uuidv4(),
    ...product,
  }

  const { data, error } = await supabase.from("products").insert([newProduct]).select()

  if (error) {
    console.error("Error creating product:", error)
    return null
  }

  return {
    id: data[0].id,
    name: data[0].name,
    description: data[0].description,
    price: data[0].price,
  }
}

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  const { data, error } = await supabase.from("products").update(product).eq("id", id).select()

  if (error) {
    console.error("Error updating product:", error)
    return null
  }

  if (data.length === 0) {
    return null
  }

  return {
    id: data[0].id,
    name: data[0].name,
    description: data[0].description,
    price: data[0].price,
  }
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  const { error } = await supabase.from("products").delete().eq("id", id)

  if (error) {
    console.error("Error deleting product:", error)
    return false
  }

  return true
}

// Client functions
export const getClients = async (): Promise<Client[]> => {
  const { data, error } = await supabase.from("clients").select("*")

  if (error) {
    console.error("Error fetching clients:", error)
    return []
  }

  return data.map((client) => ({
    id: client.id,
    name: client.name,
    email: client.email,
    phone: client.phone,
  }))
}

export const getClientById = async (id: string): Promise<Client | null> => {
  const { data, error } = await supabase.from("clients").select("*").eq("id", id).single()

  if (error) {
    console.error("Error fetching client:", error)
    return null
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
  }
}

export const createClient = async (client: Omit<Client, "id">): Promise<Client | null> => {
  const newClient = {
    id: uuidv4(),
    ...client,
  }

  const { data, error } = await supabase.from("clients").insert([newClient]).select()

  if (error) {
    console.error("Error creating client:", error)
    return null
  }

  return {
    id: data[0].id,
    name: data[0].name,
    email: data[0].email,
    phone: data[0].phone,
  }
}

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client | null> => {
  const { data, error } = await supabase.from("clients").update(client).eq("id", id).select()

  if (error) {
    console.error("Error updating client:", error)
    return null
  }

  if (data.length === 0) {
    return null
  }

  return {
    id: data[0].id,
    name: data[0].name,
    email: data[0].email,
    phone: data[0].phone,
  }
}

export const deleteClient = async (id: string): Promise<boolean> => {
  try {
    // First, find all orders associated with this client
    const { data: clientOrders, error: ordersError } = await supabase.from("orders").select("id").eq("client_id", id)

    if (ordersError) {
      console.error("Error finding client orders:", ordersError)
      return false
    }

    // For each order, delete its order items first
    if (clientOrders && clientOrders.length > 0) {
      for (const order of clientOrders) {
        // Delete order items for this order
        const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", order.id)

        if (itemsError) {
          console.error(`Error deleting order items for order ${order.id}:`, itemsError)
          return false
        }
      }

      // Now delete all orders for this client
      const { error: deleteOrdersError } = await supabase.from("orders").delete().eq("client_id", id)

      if (deleteOrdersError) {
        console.error("Error deleting client orders:", deleteOrdersError)
        return false
      }
    }

    // Finally, delete the client
    const { error } = await supabase.from("clients").delete().eq("id", id)

    if (error) {
      console.error("Error deleting client:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteClient:", error)
    return false
  }
}

// Order functions
export const getOrders = async (): Promise<Order[]> => {
  // This is more complex as we need to join with clients and order_items
  const { data: ordersData, error: ordersError } = await supabase.from("orders").select("*, clients(name, phone)")

  if (ordersError) {
    console.error("Error fetching orders:", ordersError)
    return []
  }

  const orders: Order[] = []

  for (const order of ordersData) {
    // Get order items
    const { data: itemsData, error: itemsError } = await supabase
      .from("order_items")
      .select("*, products(name)")
      .eq("order_id", order.id)

    if (itemsError) {
      console.error("Error fetching order items:", itemsError)
      continue
    }

    const items: OrderItem[] = itemsData.map((item) => ({
      id: item.id,
      productId: item.product_id,
      productName: item.products.name,
      price: item.price,
      quantity: item.quantity,
      observation: item.observation,
    }))

    orders.push({
      id: order.id,
      clientName: order.clients.name,
      clientPhone: order.clients.phone,
      items,
      total: order.total,
      status: order.status,
      createdAt: order.created_at,
    })
  }

  return orders
}

export const getOrderById = async (id: string): Promise<Order | null> => {
  const { data: order, error: orderError } = await supabase
    .from("orders")
    .select("*, clients(name, phone)")
    .eq("id", id)
    .single()

  if (orderError) {
    console.error("Error fetching order:", orderError)
    return null
  }

  // Get order items
  const { data: itemsData, error: itemsError } = await supabase
    .from("order_items")
    .select("*, products(name)")
    .eq("order_id", order.id)

  if (itemsError) {
    console.error("Error fetching order items:", itemsError)
    return null
  }

  const items: OrderItem[] = itemsData.map((item) => ({
    id: item.id,
    productId: item.product_id,
    productName: item.products.name,
    price: item.price,
    quantity: item.quantity,
    observation: item.observation,
  }))

  return {
    id: order.id,
    clientName: order.clients.name,
    clientPhone: order.clients.phone,
    items,
    total: order.total,
    status: order.status,
    createdAt: order.created_at,
  }
}

export const createOrder = async (
  clientId: string,
  items: Array<{ productId: string; quantity: number; price: number; observation: string }>,
  total: number,
): Promise<Order | null> => {
  try {
    // Check if tables exist first
    const tablesExist = await checkTablesExist()
    if (!tablesExist) {
      console.error("Database tables do not exist")
      return null
    }

    // Start a transaction
    const orderId = uuidv4()

    // 1. Create the order
    const { error: orderError } = await supabase.from("orders").insert([
      {
        id: orderId,
        client_id: clientId,
        total,
        status: "pending",
      },
    ])

    if (orderError) {
      console.error("Error creating order:", orderError)
      return null
    }

    // 2. Create order items
    const orderItems = items.map((item) => ({
      id: uuidv4(),
      order_id: orderId,
      product_id: item.productId,
      quantity: item.quantity,
      price: item.price,
      observation: item.observation,
    }))

    const { error: itemsError } = await supabase.from("order_items").insert(orderItems)

    if (itemsError) {
      console.error("Error creating order items:", itemsError)
      // In a real app, you would roll back the transaction here
      return null
    }

    // Get the client info
    const { data: client, error: clientError } = await supabase
      .from("clients")
      .select("name, phone")
      .eq("id", clientId)
      .single()

    if (clientError) {
      console.error("Error fetching client:", clientError)
      return null
    }

    // Get the product names for the items
    const productItems: OrderItem[] = []
    for (const item of items) {
      const { data: product, error: productError } = await supabase
        .from("products")
        .select("name")
        .eq("id", item.productId)
        .single()

      if (productError) {
        console.error("Error fetching product:", productError)
        continue
      }

      productItems.push({
        id: uuidv4(),
        productId: item.productId,
        productName: product.name,
        price: item.price,
        quantity: item.quantity,
        observation: item.observation,
      })
    }

    // Return the created order
    return {
      id: orderId,
      clientName: client.name,
      clientPhone: client.phone,
      items: productItems,
      total,
      status: "pending",
      createdAt: new Date().toISOString(),
    }
  } catch (error) {
    console.error("Error in createOrder:", error)
    return null
  }
}

export const updateOrderStatus = async (id: string, status: Order["status"]): Promise<boolean> => {
  const { error } = await supabase.from("orders").update({ status }).eq("id", id)

  if (error) {
    console.error("Error updating order status:", error)
    return false
  }

  return true
}

export const deleteOrder = async (id: string): Promise<boolean> => {
  // First delete order items
  const { error: itemsError } = await supabase.from("order_items").delete().eq("order_id", id)

  if (itemsError) {
    console.error("Error deleting order items:", itemsError)
    return false
  }

  // Then delete the order
  const { error: orderError } = await supabase.from("orders").delete().eq("id", id)

  if (orderError) {
    console.error("Error deleting order:", orderError)
    return false
  }

  return true
}
