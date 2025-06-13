"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Trash, Plus, Loader2 } from "lucide-react"
import { getClients, getProducts, createOrder, type Client, type Product } from "@/lib/db"
// Add the useRouter import at the top with the other imports
import { useRouter } from "next/navigation"

type OrderItem = {
  id: string
  productId: string
  productName: string
  price: number
  quantity: number
  observation: string
}

export default function OrderPage() {
  const { t } = useLanguage()
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [selectedClient, setSelectedClient] = useState("")
  const [items, setItems] = useState<OrderItem[]>([])
  const [isAddItemOpen, setIsAddItemOpen] = useState(false)
  const [newItem, setNewItem] = useState<{
    productId: string
    quantity: number
    observation: string
  }>({
    productId: "",
    quantity: 1,
    observation: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  // Add a mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)
  // Add the router declaration in the component
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
    fetchData()
  }, [])

  const fetchData = async () => {
    setIsLoading(true)
    try {
      // Fetch clients and products in parallel
      const [clientsData, productsData] = await Promise.all([getClients(), getProducts()])

      setClients(clientsData)
      setProducts(productsData)
    } catch (error) {
      console.error("Error fetching data:", error)
      toast({
        title: mounted ? t("common.error") : "Error",
        description: "Failed to load data. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = () => {
    if (!newItem.productId || newItem.quantity <= 0) {
      toast({
        title: mounted ? t("order.error") : "Error",
        description: mounted ? t("order.invalidItem") : "Please select a product and enter a valid quantity",
        variant: "destructive",
      })
      return
    }

    const product = products.find((p) => p.id === newItem.productId)
    if (!product) return

    const newOrderItem: OrderItem = {
      id: Math.random().toString(36).substring(2, 9),
      productId: product.id,
      productName: product.name,
      price: product.price,
      quantity: newItem.quantity,
      observation: newItem.observation,
    }

    setItems([...items, newOrderItem])
    setIsAddItemOpen(false)
    setNewItem({
      productId: "",
      quantity: 1,
      observation: "",
    })
  }

  const handleRemoveItem = (id: string) => {
    setItems(items.filter((item) => item.id !== id))
  }

  const calculateTotal = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  // Update the handleSubmitOrder function to redirect after success
  // Find the handleSubmitOrder function and replace it with this updated version:

  const handleSubmitOrder = async () => {
    if (!selectedClient) {
      toast({
        title: mounted ? t("order.error") : "Error",
        description: mounted ? t("order.selectClient") : "Please select a client",
        variant: "destructive",
      })
      return
    }

    if (items.length === 0) {
      toast({
        title: mounted ? t("order.error") : "Error",
        description: mounted ? t("order.addItems") : "Please add at least one item to the order",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      const orderItems = items.map((item) => ({
        productId: item.productId,
        quantity: item.quantity,
        price: item.price,
        observation: item.observation,
      }))

      const total = calculateTotal()

      const order = await createOrder(selectedClient, orderItems, total)

      if (order) {
        toast({
          title: mounted ? t("order.success") : "Success",
          description: mounted ? t("order.orderCreated") : "Order created successfully",
        })

        // Reset form
        setSelectedClient("")
        setItems([])

        // Redirect to orders page
        router.push("/orders")
      } else {
        throw new Error("Failed to create order")
      }
    } catch (error) {
      console.error("Error creating order:", error)
      toast({
        title: mounted ? t("order.error") : "Error",
        description: "Failed to create order. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Translated text with fallbacks for SSR
  const createOrderTitle = mounted ? t("order.createOrder") : "Create Order"
  const createOrderSubtitle = mounted ? t("order.createOrderDesc") : "Create a new order for a client"
  const selectClientLabel = mounted ? t("order.selectClient") : "Select Client"
  const noClientsText = mounted ? t("order.noClients") : "No clients available"
  const orderItemsLabel = mounted ? t("order.orderItems") : "Order Items"
  const addItemButton = mounted ? t("order.addItem") : "Add Item"
  const noItemsText = mounted ? t("order.noItems") : "No items added to the order"
  const productLabel = mounted ? t("common.product") : "Product"
  const quantityLabel = mounted ? t("common.quantity") : "Quantity"
  const priceLabel = mounted ? t("common.price") : "Price"
  const observationLabel = mounted ? t("common.observation") : "Observation"
  const totalLabel = mounted ? t("common.total") : "Total"
  const submitOrderButton = mounted ? t("order.submitOrder") : "Submit Order"
  const addItemTitle = mounted ? t("order.addItem") : "Add Item"
  const addItemDesc = mounted ? t("order.addItemDesc") : "Add a new item to the order"
  const selectProductLabel = mounted ? t("order.selectProduct") : "Select Product"
  const noProductsText = mounted ? t("order.noProducts") : "No products available"
  const cancelButton = mounted ? t("common.cancel") : "Cancel"
  const addButton = mounted ? t("common.add") : "Add"
  const loadingText = mounted ? t("common.loading") : "Loading..."

  if (isLoading) {
    return (
      <DashboardLayout>
        <div className="flex h-[50vh] items-center justify-center">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
            <p className="text-muted-foreground">{loadingText}</p>
          </div>
        </div>
      </DashboardLayout>
    )
  }

  return (
    <DashboardLayout>
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{createOrderTitle}</h2>
        <p className="text-muted-foreground">{createOrderSubtitle}</p>
      </div>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>{selectClientLabel}</CardTitle>
        </CardHeader>
        <CardContent>
          {clients.length === 0 ? (
            <p className="text-muted-foreground">{noClientsText}</p>
          ) : (
            <Select value={selectedClient} onValueChange={setSelectedClient}>
              <SelectTrigger>
                <SelectValue placeholder={selectClientLabel} />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.name} ({client.phone})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>{orderItemsLabel}</CardTitle>
          </div>
          <Dialog open={isAddItemOpen} onOpenChange={setIsAddItemOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                {addItemButton}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>{addItemTitle}</DialogTitle>
                <DialogDescription>{addItemDesc}</DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="product">{selectProductLabel}</Label>
                  {products.length === 0 ? (
                    <p className="text-muted-foreground">{noProductsText}</p>
                  ) : (
                    <Select
                      value={newItem.productId}
                      onValueChange={(value) => setNewItem({ ...newItem, productId: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={selectProductLabel} />
                      </SelectTrigger>
                      <SelectContent>
                        {products.map((product) => (
                          <SelectItem key={product.id} value={product.id}>
                            {product.name} - ${product.price.toFixed(2)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="quantity">{quantityLabel}</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: Number.parseInt(e.target.value) || 1 })}
                  />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="observation">{observationLabel}</Label>
                  <Textarea
                    id="observation"
                    value={newItem.observation}
                    onChange={(e) => setNewItem({ ...newItem, observation: e.target.value })}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddItemOpen(false)}>
                  {cancelButton}
                </Button>
                <Button onClick={handleAddItem}>{addButton}</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {items.length === 0 ? (
            <div className="flex h-40 items-center justify-center rounded-md border border-dashed">
              <p className="text-muted-foreground">{noItemsText}</p>
            </div>
          ) : (
            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.id} className="rounded-md border p-4">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-medium">{item.productName}</h3>
                      <div className="mt-1 text-sm text-muted-foreground">
                        <div>
                          {quantityLabel}: {item.quantity}
                        </div>
                        <div>
                          {priceLabel}: ${item.price.toFixed(2)}
                        </div>
                        <div>
                          {totalLabel}: ${(item.price * item.quantity).toFixed(2)}
                        </div>
                        {item.observation && (
                          <div className="mt-2">
                            <span className="font-medium">{observationLabel}:</span> {item.observation}
                          </div>
                        )}
                      </div>
                    </div>
                    <Button variant="outline" size="icon" onClick={() => handleRemoveItem(item.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
        <CardFooter className="flex flex-col items-start">
          <div className="mb-4 w-full">
            <div className="flex justify-between py-2 text-sm">
              <span>{totalLabel}:</span>
              <span className="font-medium">${calculateTotal().toFixed(2)}</span>
            </div>
          </div>
          <Button
            className="w-full"
            onClick={handleSubmitOrder}
            disabled={isSubmitting || items.length === 0 || !selectedClient}
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                {mounted ? t("common.submitting") : "Submitting..."}
              </>
            ) : (
              submitOrderButton
            )}
          </Button>
        </CardFooter>
      </Card>
    </DashboardLayout>
  )
}
