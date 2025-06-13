import { supabase } from "./supabase"
import { v4 as uuidv4 } from "uuid"

export async function seedDatabase() {
  console.log("Starting database seeding...")

  try {
    // Check if tables exist first
    const { data: usersData, error: usersError } = await supabase.from("users").select("count").limit(1)

    if (usersError && usersError.message.includes('relation "public.users" does not exist')) {
      throw new Error("Database tables do not exist. Please create tables first.")
    }

    // Seed users
    const users = [
      {
        id: uuidv4(),
        name: "Manager User",
        email: "manager@sucrebiscoiteria.com.br",
        password: "password", // In a real app, this would be hashed
        role: "manager" as const,
      },
      {
        id: uuidv4(),
        name: "Employee User",
        email: "employee@sucrebiscoiteria.com.br",
        password: "password",
        role: "employee" as const,
      },
      {
        id: uuidv4(),
        name: "Sales User",
        email: "sales@sucrebiscoiteria.com.br",
        password: "password",
        role: "sales" as const,
      },
    ]

    console.log("Seeding users...")
    for (const user of users) {
      const { error } = await supabase.from("users").upsert([user], { onConflict: "email" })

      if (error) {
        console.error("Error seeding user:", error)
      }
    }

    // Seed products
    const products = [
      {
        id: uuidv4(),
        name: "Chocolate Cake",
        description: "Delicious chocolate cake with rich frosting",
        price: 25.99,
      },
      {
        id: uuidv4(),
        name: "Vanilla Cupcakes",
        description: "Light and fluffy vanilla cupcakes with buttercream",
        price: 12.99,
      },
      {
        id: uuidv4(),
        name: "Strawberry Tart",
        description: "Fresh strawberry tart with custard filling",
        price: 18.5,
      },
    ]

    console.log("Seeding products...")
    for (const product of products) {
      const { error } = await supabase.from("products").upsert([product], { onConflict: "name" })

      if (error) {
        console.error("Error seeding product:", error)
      }
    }

    // Seed clients
    const clients = [
      {
        id: uuidv4(),
        name: "John Doe",
        email: "john@example.com",
        phone: "555-123-4567",
      },
      {
        id: uuidv4(),
        name: "Jane Smith",
        email: "jane@example.com",
        phone: "555-987-6543",
      },
      {
        id: uuidv4(),
        name: "Robert Johnson",
        email: "robert@example.com",
        phone: "555-456-7890",
      },
    ]

    console.log("Seeding clients...")
    for (const client of clients) {
      const { error } = await supabase.from("clients").upsert([client], { onConflict: "email" })

      if (error) {
        console.error("Error seeding client:", error)
      }
    }

    console.log("Database seeding completed!")
    return { users, products, clients }
  } catch (error) {
    console.error("Error seeding database:", error)
    throw error
  }
}
