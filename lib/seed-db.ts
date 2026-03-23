import { pool } from "./postgres"
import { v4 as uuidv4 } from "uuid"

export async function seedDatabase() {
  console.log("Starting database seeding...")

  try {
    // Verify tables exist
    await pool.query("SELECT 1 FROM users LIMIT 1")

    const users = [
      { id: uuidv4(), name: "Manager User", email: "manager@sucrebiscoiteria.com.br", password: "password", role: "manager" },
      { id: uuidv4(), name: "Employee User", email: "employee@sucrebiscoiteria.com.br", password: "password", role: "employee" },
      { id: uuidv4(), name: "Sales User", email: "sales@sucrebiscoiteria.com.br", password: "password", role: "sales" },
    ]

    console.log("Seeding users...")
    for (const u of users) {
      await pool.query(
        `INSERT INTO users (id, name, email, password, role)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (email) DO NOTHING`,
        [u.id, u.name, u.email, u.password, u.role],
      )
    }

    const products = [
      { id: uuidv4(), name: "Chocolate Cake", description: "Delicious chocolate cake with rich frosting", price: 25.99 },
      { id: uuidv4(), name: "Vanilla Cupcakes", description: "Light and fluffy vanilla cupcakes with buttercream", price: 12.99 },
      { id: uuidv4(), name: "Strawberry Tart", description: "Fresh strawberry tart with custard filling", price: 18.5 },
    ]

    console.log("Seeding products...")
    for (const p of products) {
      await pool.query(
        `INSERT INTO products (id, name, description, price)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (name) DO NOTHING`,
        [p.id, p.name, p.description, p.price],
      )
    }

    const clients = [
      { id: uuidv4(), name: "John Doe", email: "john@example.com", phone: "555-123-4567" },
      { id: uuidv4(), name: "Jane Smith", email: "jane@example.com", phone: "555-987-6543" },
      { id: uuidv4(), name: "Robert Johnson", email: "robert@example.com", phone: "555-456-7890" },
    ]

    console.log("Seeding clients...")
    for (const c of clients) {
      await pool.query(
        `INSERT INTO clients (id, name, email, phone)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (email) DO NOTHING`,
        [c.id, c.name, c.email, c.phone],
      )
    }

    console.log("Database seeding completed!")
    return { users, products, clients }
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}
