"use client"

import { useState, useEffect } from "react"
import { DashboardLayout } from "@/components/dashboard-layout"
import { useLanguage } from "@/lib/i18n/language-context"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
import { Textarea } from "@/components/ui/textarea"
import { toast } from "@/components/ui/use-toast"
import { Edit, Plus, Trash, Loader2 } from "lucide-react"
import { getProducts, createProduct, updateProduct, deleteProduct, type Product } from "@/lib/db"

export default function ProductsPage() {
  const { t } = useLanguage()
  const [products, setProducts] = useState<Product[]>([])
  const [isAddProductOpen, setIsAddProductOpen] = useState(false)
  const [isEditProductOpen, setIsEditProductOpen] = useState(false)
  const [currentProduct, setCurrentProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState({
    name: "",
    description: "",
    price: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Add a mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    setIsLoading(true)
    try {
      const productsData = await getProducts()
      setProducts(productsData)
    } catch (error) {
      console.error("Error fetching products:", error)
      toast({
        title: mounted ? t("products.error") : "Error",
        description: "Failed to load products. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddProduct = async () => {
    // Validate inputs
    if (!newProduct.name || !newProduct.price) {
      toast({
        title: mounted ? t("products.error") : "Error",
        description: mounted ? t("products.requiredFields") : "Name and price are required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const product = await createProduct({
        name: newProduct.name,
        description: newProduct.description,
        price: Number.parseFloat(newProduct.price),
      })

      if (product) {
        setProducts([...products, product])
        setIsAddProductOpen(false)
        setNewProduct({
          name: "",
          description: "",
          price: "",
        })

        toast({
          title: mounted ? t("products.added") : "Product added",
          description: mounted
            ? `${product.name} ${t("products.hasBeenAdded")}`
            : `${product.name} has been added to the menu`,
        })
      } else {
        throw new Error("Failed to create product")
      }
    } catch (error) {
      console.error("Error adding product:", error)
      toast({
        title: mounted ? t("products.error") : "Error",
        description: "Failed to add product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditProduct = async () => {
    if (!currentProduct) return

    // Validate inputs
    if (!currentProduct.name || currentProduct.price <= 0) {
      toast({
        title: mounted ? t("products.error") : "Error",
        description: mounted ? t("products.requiredFields") : "Name and price are required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const updatedProduct = await updateProduct(currentProduct.id, {
        name: currentProduct.name,
        description: currentProduct.description,
        price: currentProduct.price,
      })

      if (updatedProduct) {
        setProducts(products.map((product) => (product.id === updatedProduct.id ? updatedProduct : product)))
        setIsEditProductOpen(false)
        setCurrentProduct(null)

        toast({
          title: mounted ? t("products.updated") : "Product updated",
          description: mounted
            ? `${updatedProduct.name} ${t("products.hasBeenUpdated")}`
            : `${updatedProduct.name} has been updated`,
        })
      } else {
        throw new Error("Failed to update product")
      }
    } catch (error) {
      console.error("Error updating product:", error)
      toast({
        title: mounted ? t("products.error") : "Error",
        description: "Failed to update product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    setIsSubmitting(true)
    try {
      const success = await deleteProduct(id)

      if (success) {
        const productToDelete = products.find((product) => product.id === id)
        setProducts(products.filter((product) => product.id !== id))

        toast({
          title: mounted ? t("products.deleted") : "Product deleted",
          description: mounted
            ? `${productToDelete?.name || ""} ${t("products.hasBeenDeleted")}`
            : "The product has been deleted successfully",
        })
      } else {
        throw new Error("Failed to delete product")
      }
    } catch (error) {
      console.error("Error deleting product:", error)
      toast({
        title: mounted ? t("products.error") : "Error",
        description: "Failed to delete product. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Translated text with fallbacks for SSR
  const productManagementTitle = mounted ? t("products.title") : "Product Management"
  const addProductButton = mounted ? t("products.addProduct") : "Add Product"
  const addNewProductTitle = mounted ? t("products.addProduct") : "Add New Product"
  const addProductDescription = mounted ? t("products.addProductDesc") : "Add a new product to your menu"
  const editProductTitle = mounted ? t("products.editProduct") : "Edit Product"
  const editProductDescription = mounted ? t("products.editProductDesc") : "Update product information"
  const nameLabel = mounted ? t("common.name") : "Name"
  const descriptionLabel = mounted ? t("products.description") : "Description"
  const priceLabel = mounted ? t("products.price") : "Price"
  const cancelButton = mounted ? t("common.cancel") : "Cancel"
  const addButton = mounted ? t("common.add") : "Add"
  const updateButton = mounted ? t("common.save") : "Update"
  const loadingText = mounted ? t("common.loading") : "Loading..."
  const noProductsText = mounted ? t("products.noProducts") : "No products found"

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
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">{productManagementTitle}</h2>
        <Dialog open={isAddProductOpen} onOpenChange={setIsAddProductOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {addProductButton}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{addNewProductTitle}</DialogTitle>
              <DialogDescription>{addProductDescription}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{nameLabel}</Label>
                <Input
                  id="name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">{descriptionLabel}</Label>
                <Textarea
                  id="description"
                  value={newProduct.description}
                  onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="price">{priceLabel}</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddProductOpen(false)} disabled={isSubmitting}>
                {cancelButton}
              </Button>
              <Button onClick={handleAddProduct} disabled={isSubmitting}>
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    {mounted ? t("common.submitting") : "Submitting..."}
                  </>
                ) : (
                  addButton
                )}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {products.length === 0 ? (
        <div className="mt-6 flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">{noProductsText}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {products.map((product) => (
            <Card key={product.id}>
              <CardHeader className="pb-2">
                <CardTitle>{product.name}</CardTitle>
                <CardDescription>${product.price.toFixed(2)}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground mb-4">{product.description}</p>
                <div className="flex items-center justify-end gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setCurrentProduct(product)
                      setIsEditProductOpen(true)
                    }}
                    disabled={isSubmitting}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteProduct(product.id)}
                    disabled={isSubmitting}
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Product Dialog */}
      <Dialog open={isEditProductOpen} onOpenChange={setIsEditProductOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editProductTitle}</DialogTitle>
            <DialogDescription>{editProductDescription}</DialogDescription>
          </DialogHeader>
          {currentProduct && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">{nameLabel}</Label>
                <Input
                  id="edit-name"
                  value={currentProduct.name}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-description">{descriptionLabel}</Label>
                <Textarea
                  id="edit-description"
                  value={currentProduct.description}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, description: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-price">{priceLabel}</Label>
                <Input
                  id="edit-price"
                  type="number"
                  step="0.01"
                  value={currentProduct.price}
                  onChange={(e) => setCurrentProduct({ ...currentProduct, price: Number.parseFloat(e.target.value) })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditProductOpen(false)} disabled={isSubmitting}>
              {cancelButton}
            </Button>
            <Button onClick={handleEditProduct} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {mounted ? t("common.submitting") : "Submitting..."}
                </>
              ) : (
                updateButton
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
