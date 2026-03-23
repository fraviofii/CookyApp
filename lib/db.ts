"use server"

import { pool } from "./postgres"
import { v4 as uuidv4 } from "uuid"

export async function checkTablesExist(): Promise<boolean> {
  try {
    await pool.query("SELECT 1 FROM users LIMIT 1")
    return true
  } catch (error: any) {
    if (error.code === "42P01") {
      // undefined_table — tables not yet created
      return false
    }
    if (process.env.NODE_ENV === "development") {
      console.warn("Error checking tables, continuing in dev mode:", error.message)
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
  password: string
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

// ─── User functions ────────────────────────────────────────────────────────────

export const getUsers = async (): Promise<User[]> => {
  try {
    const { rows } = await pool.query("SELECT * FROM users ORDER BY created_at ASC")
    return rows.map((r: any) => ({ id: r.id, name: r.name, email: r.email, password: r.password, role: r.role }))
  } catch (error) {
    console.error("Error fetching users:", error)
    return []
  }
}

export const getUserById = async (id: string): Promise<User | null> => {
  try {
    const { rows } = await pool.query("SELECT * FROM users WHERE id = $1", [id])
    if (rows.length === 0) return null
    const r = rows[0]
    return { id: r.id, name: r.name, email: r.email, password: r.password, role: r.role }
  } catch (error) {
    console.error("Error fetching user:", error)
    return null
  }
}

export async function getUserByEmail(email: string): Promise<User | null> {
  try {
    const tablesExist = await checkTablesExist()
    if (!tablesExist) return null

    const { rows } = await pool.query("SELECT * FROM users WHERE email = $1 LIMIT 1", [email])
    if (rows.length === 0) return null
    const r = rows[0]
    return { id: r.id, name: r.name, email: r.email, password: r.password, role: r.role }
  } catch (error) {
    console.error("Error fetching user by email:", error)
    return null
  }
}

export const createUser = async (user: Omit<User, "id">): Promise<User | null> => {
  try {
    const id = uuidv4()
    const { rows } = await pool.query(
      "INSERT INTO users (id, name, email, password, role) VALUES ($1, $2, $3, $4, $5) RETURNING *",
      [id, user.name, user.email, user.password, user.role],
    )
    const r = rows[0]
    return { id: r.id, name: r.name, email: r.email, password: r.password, role: r.role }
  } catch (error) {
    console.error("Error creating user:", error)
    return null
  }
}

export const updateUser = async (id: string, user: Partial<User>): Promise<User | null> => {
  try {
    const fields = (Object.keys(user) as (keyof User)[]).filter((k) => k !== "id")
    if (fields.length === 0) return getUserById(id)

    const setClauses = fields.map((f, i) => `${f} = $${i + 1}`)
    const values = [...fields.map((f) => user[f]), id]

    const { rows } = await pool.query(
      `UPDATE users SET ${setClauses.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`,
      values,
    )
    if (rows.length === 0) return null
    const r = rows[0]
    return { id: r.id, name: r.name, email: r.email, password: r.password, role: r.role }
  } catch (error) {
    console.error("Error updating user:", error)
    return null
  }
}

export const deleteUser = async (id: string): Promise<boolean> => {
  try {
    await pool.query("DELETE FROM users WHERE id = $1", [id])
    return true
  } catch (error) {
    console.error("Error deleting user:", error)
    return false
  }
}

// ─── Product functions ─────────────────────────────────────────────────────────

export const getProducts = async (): Promise<Product[]> => {
  try {
    const { rows } = await pool.query("SELECT * FROM products ORDER BY created_at ASC")
    return rows.map((r: any) => ({ id: r.id, name: r.name, description: r.description, price: parseFloat(r.price) }))
  } catch (error) {
    console.error("Error fetching products:", error)
    return []
  }
}

export const getProductById = async (id: string): Promise<Product | null> => {
  try {
    const { rows } = await pool.query("SELECT * FROM products WHERE id = $1", [id])
    if (rows.length === 0) return null
    const r = rows[0]
    return { id: r.id, name: r.name, description: r.description, price: parseFloat(r.price) }
  } catch (error) {
    console.error("Error fetching product:", error)
    return null
  }
}

export const createProduct = async (product: Omit<Product, "id">): Promise<Product | null> => {
  try {
    const id = uuidv4()
    const { rows } = await pool.query(
      "INSERT INTO products (id, name, description, price) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, product.name, product.description, product.price],
    )
    const r = rows[0]
    return { id: r.id, name: r.name, description: r.description, price: parseFloat(r.price) }
  } catch (error) {
    console.error("Error creating product:", error)
    return null
  }
}

export const updateProduct = async (id: string, product: Partial<Product>): Promise<Product | null> => {
  try {
    const fields = (Object.keys(product) as (keyof Product)[]).filter((k) => k !== "id")
    if (fields.length === 0) return getProductById(id)

    const setClauses = fields.map((f, i) => `${f} = $${i + 1}`)
    const values = [...fields.map((f) => product[f]), id]

    const { rows } = await pool.query(
      `UPDATE products SET ${setClauses.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`,
      values,
    )
    if (rows.length === 0) return null
    const r = rows[0]
    return { id: r.id, name: r.name, description: r.description, price: parseFloat(r.price) }
  } catch (error) {
    console.error("Error updating product:", error)
    return null
  }
}

export const deleteProduct = async (id: string): Promise<boolean> => {
  try {
    await pool.query("DELETE FROM products WHERE id = $1", [id])
    return true
  } catch (error) {
    console.error("Error deleting product:", error)
    return false
  }
}

// ─── Client functions ──────────────────────────────────────────────────────────

export const getClients = async (): Promise<Client[]> => {
  try {
    const { rows } = await pool.query("SELECT * FROM clients ORDER BY created_at ASC")
    return rows.map((r: any) => ({ id: r.id, name: r.name, email: r.email, phone: r.phone }))
  } catch (error) {
    console.error("Error fetching clients:", error)
    return []
  }
}

export const getClientById = async (id: string): Promise<Client | null> => {
  try {
    const { rows } = await pool.query("SELECT * FROM clients WHERE id = $1", [id])
    if (rows.length === 0) return null
    const r = rows[0]
    return { id: r.id, name: r.name, email: r.email, phone: r.phone }
  } catch (error) {
    console.error("Error fetching client:", error)
    return null
  }
}

export const createClient = async (client: Omit<Client, "id">): Promise<Client | null> => {
  try {
    const id = uuidv4()
    const { rows } = await pool.query(
      "INSERT INTO clients (id, name, email, phone) VALUES ($1, $2, $3, $4) RETURNING *",
      [id, client.name, client.email, client.phone],
    )
    const r = rows[0]
    return { id: r.id, name: r.name, email: r.email, phone: r.phone }
  } catch (error) {
    console.error("Error creating client:", error)
    return null
  }
}

export const updateClient = async (id: string, client: Partial<Client>): Promise<Client | null> => {
  try {
    const fields = (Object.keys(client) as (keyof Client)[]).filter((k) => k !== "id")
    if (fields.length === 0) return getClientById(id)

    const setClauses = fields.map((f, i) => `${f} = $${i + 1}`)
    const values = [...fields.map((f) => client[f]), id]

    const { rows } = await pool.query(
      `UPDATE clients SET ${setClauses.join(", ")} WHERE id = $${fields.length + 1} RETURNING *`,
      values,
    )
    if (rows.length === 0) return null
    const r = rows[0]
    return { id: r.id, name: r.name, email: r.email, phone: r.phone }
  } catch (error) {
    console.error("Error updating client:", error)
    return null
  }
}

export const deleteClient = async (id: string): Promise<boolean> => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")

    // Delete order_items for all orders of this client
    await client.query(
      "DELETE FROM order_items WHERE order_id IN (SELECT id FROM orders WHERE client_id = $1)",
      [id],
    )
    // Delete orders for this client
    await client.query("DELETE FROM orders WHERE client_id = $1", [id])
    // Delete the client
    await client.query("DELETE FROM clients WHERE id = $1", [id])

    await client.query("COMMIT")
    return true
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error deleting client:", error)
    return false
  } finally {
    client.release()
  }
}

// ─── Order functions ───────────────────────────────────────────────────────────

export const getOrders = async (): Promise<Order[]> => {
  try {
    const { rows: ordersRows } = await pool.query(`
      SELECT o.id, o.total, o.status, o.created_at, c.name AS client_name, c.phone AS client_phone
      FROM orders o
      JOIN clients c ON c.id = o.client_id
      ORDER BY o.created_at DESC
    `)

    const orders: Order[] = []

    for (const order of ordersRows) {
      const { rows: itemRows } = await pool.query(
        `SELECT oi.id, oi.product_id, oi.quantity, oi.price, oi.observation, p.name AS product_name
         FROM order_items oi
         JOIN products p ON p.id = oi.product_id
         WHERE oi.order_id = $1`,
        [order.id],
      )

      orders.push({
        id: order.id,
        clientName: order.client_name,
        clientPhone: order.client_phone,
        total: parseFloat(order.total),
        status: order.status,
        createdAt: order.created_at,
        items: itemRows.map((i: any) => ({
          id: i.id,
          productId: i.product_id,
          productName: i.product_name,
          price: parseFloat(i.price),
          quantity: i.quantity,
          observation: i.observation ?? "",
        })),
      })
    }

    return orders
  } catch (error) {
    console.error("Error fetching orders:", error)
    return []
  }
}

export const getOrderById = async (id: string): Promise<Order | null> => {
  try {
    const { rows: orderRows } = await pool.query(
      `SELECT o.id, o.total, o.status, o.created_at, c.name AS client_name, c.phone AS client_phone
       FROM orders o
       JOIN clients c ON c.id = o.client_id
       WHERE o.id = $1`,
      [id],
    )
    if (orderRows.length === 0) return null
    const order = orderRows[0]

    const { rows: itemRows } = await pool.query(
      `SELECT oi.id, oi.product_id, oi.quantity, oi.price, oi.observation, p.name AS product_name
       FROM order_items oi
       JOIN products p ON p.id = oi.product_id
       WHERE oi.order_id = $1`,
      [id],
    )

    return {
      id: order.id,
      clientName: order.client_name,
      clientPhone: order.client_phone,
      total: parseFloat(order.total),
      status: order.status,
      createdAt: order.created_at,
      items: itemRows.map((i: any) => ({
        id: i.id,
        productId: i.product_id,
        productName: i.product_name,
        price: parseFloat(i.price),
        quantity: i.quantity,
        observation: i.observation ?? "",
      })),
    }
  } catch (error) {
    console.error("Error fetching order:", error)
    return null
  }
}

export const createOrder = async (
  clientId: string,
  items: Array<{ productId: string; quantity: number; price: number; observation: string }>,
  total: number,
): Promise<Order | null> => {
  const client = await pool.connect()
  try {
    const tablesExist = await checkTablesExist()
    if (!tablesExist) {
      console.error("Database tables do not exist")
      return null
    }

    await client.query("BEGIN")

    const orderId = uuidv4()
    await client.query(
      "INSERT INTO orders (id, client_id, total, status) VALUES ($1, $2, $3, $4)",
      [orderId, clientId, total, "pending"],
    )

    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (id, order_id, product_id, quantity, price, observation) VALUES ($1, $2, $3, $4, $5, $6)",
        [uuidv4(), orderId, item.productId, item.quantity, item.price, item.observation],
      )
    }

    await client.query("COMMIT")

    return getOrderById(orderId)
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error creating order:", error)
    return null
  } finally {
    client.release()
  }
}

export const updateOrderStatus = async (id: string, status: Order["status"]): Promise<boolean> => {
  try {
    await pool.query("UPDATE orders SET status = $1 WHERE id = $2", [status, id])
    return true
  } catch (error) {
    console.error("Error updating order status:", error)
    return false
  }
}

export const deleteOrder = async (id: string): Promise<boolean> => {
  const client = await pool.connect()
  try {
    await client.query("BEGIN")
    await client.query("DELETE FROM order_items WHERE order_id = $1", [id])
    await client.query("DELETE FROM orders WHERE id = $1", [id])
    await client.query("COMMIT")
    return true
  } catch (error) {
    await client.query("ROLLBACK")
    console.error("Error deleting order:", error)
    return false
  } finally {
    client.release()
  }
}
