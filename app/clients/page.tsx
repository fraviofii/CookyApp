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
import { toast } from "@/components/ui/use-toast"
import { Edit, Plus, Trash, Phone, Mail } from "lucide-react"
import { getClients, createClient, updateClient, deleteClient, type Client } from "@/lib/db"

export default function ClientsPage() {
  const { t } = useLanguage()
  const [clients, setClients] = useState<Client[]>([])
  const [isAddClientOpen, setIsAddClientOpen] = useState(false)
  const [isEditClientOpen, setIsEditClientOpen] = useState(false)
  const [currentClient, setCurrentClient] = useState<Client | null>(null)
  const [newClient, setNewClient] = useState({
    name: "",
    email: "",
    phone: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  // Add a mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchClients()
  }, [])

  const fetchClients = async () => {
    setIsLoading(true)
    try {
      const clientsData = await getClients()
      setClients(clientsData)
    } catch (error) {
      console.error("Error fetching clients:", error)
      toast({
        title: mounted ? t("clients.error") : "Error",
        description: "Failed to load clients. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddClient = async () => {
    // Validate inputs
    if (!newClient.name || !newClient.phone) {
      toast({
        title: mounted ? t("clients.error") : "Error",
        description: mounted ? t("clients.requiredFields") : "Name and phone number are required",
        variant: "destructive",
      })
      return
    }

    try {
      const client = await createClient(newClient)

      if (client) {
        setClients([...clients, client])
        setIsAddClientOpen(false)
        setNewClient({
          name: "",
          email: "",
          phone: "",
        })

        toast({
          title: mounted ? t("clients.added") : "Client added",
          description: mounted
            ? `${client.name} ${t("clients.hasBeenAdded")}`
            : `${client.name} has been added to your clients`,
        })
      } else {
        throw new Error("Failed to create client")
      }
    } catch (error) {
      console.error("Error adding client:", error)
      toast({
        title: mounted ? t("clients.error") : "Error",
        description: "Failed to add client. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleEditClient = async () => {
    if (!currentClient) return

    // Validate inputs
    if (!currentClient.name || !currentClient.phone) {
      toast({
        title: mounted ? t("clients.error") : "Error",
        description: mounted ? t("clients.requiredFields") : "Name and phone number are required",
        variant: "destructive",
      })
      return
    }

    try {
      const updatedClient = await updateClient(currentClient.id, {
        name: currentClient.name,
        email: currentClient.email,
        phone: currentClient.phone,
      })

      if (updatedClient) {
        setClients(clients.map((client) => (client.id === updatedClient.id ? updatedClient : client)))
        setIsEditClientOpen(false)
        setCurrentClient(null)

        toast({
          title: mounted ? t("clients.updated") : "Client updated",
          description: mounted
            ? `${updatedClient.name} ${t("clients.hasBeenUpdated")}`
            : `${updatedClient.name}'s information has been updated`,
        })
      } else {
        throw new Error("Failed to update client")
      }
    } catch (error) {
      console.error("Error updating client:", error)
      toast({
        title: mounted ? t("clients.error") : "Error",
        description: "Failed to update client. Please try again.",
        variant: "destructive",
      })
    }
  }

  const handleDeleteClient = async (id: string) => {
    try {
      const success = await deleteClient(id)

      if (success) {
        const clientToDelete = clients.find((client) => client.id === id)
        setClients(clients.filter((client) => client.id !== id))

        toast({
          title: mounted ? t("clients.deleted") : "Client deleted",
          description: mounted
            ? `${clientToDelete?.name || ""} ${t("clients.hasBeenDeleted")}`
            : "The client has been deleted successfully",
        })
      } else {
        throw new Error("Failed to delete client")
      }
    } catch (error) {
      console.error("Error deleting client:", error)
      toast({
        title: mounted ? t("clients.error") : "Error",
        description: "Failed to delete client. Please try again.",
        variant: "destructive",
      })
    }
  }

  // Translated text with fallbacks for SSR
  const clientManagementTitle = mounted ? t("clients.title") : "Client Management"
  const clientManagementSubtitle = mounted ? t("clients.subtitle") : "Manage your clients"
  const addClientButton = mounted ? t("clients.addClient") : "Add Client"
  const addNewClientTitle = mounted ? t("clients.addClient") : "Add New Client"
  const addClientDescription = mounted ? t("clients.addClientDesc") : "Add a new client to your database"
  const editClientTitle = mounted ? t("clients.editClient") : "Edit Client"
  const editClientDescription = mounted ? t("clients.editClientDesc") : "Update client information"
  const nameLabel = mounted ? t("common.name") : "Name"
  const emailLabel = mounted ? t("common.email") : "Email"
  const phoneLabel = mounted ? t("common.phone") : "Phone Number"
  const cancelButton = mounted ? t("common.cancel") : "Cancel"
  const addButton = mounted ? t("common.add") : "Add"
  const updateButton = mounted ? t("common.save") : "Update"
  const clientIdText = mounted ? t("clients.clientNumber") : "Client #"
  const noEmailText = mounted ? t("clients.noEmail") : "No email provided"
  const loadingText = mounted ? t("common.loading") : "Loading..."
  const noClientsText = mounted ? t("clients.noClients") : "No clients found"

  return (
    <DashboardLayout>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">{clientManagementTitle}</h2>
          <p className="text-muted-foreground">{clientManagementSubtitle}</p>
        </div>
        <Dialog open={isAddClientOpen} onOpenChange={setIsAddClientOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {addClientButton}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{addNewClientTitle}</DialogTitle>
              <DialogDescription>{addClientDescription}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{nameLabel}</Label>
                <Input
                  id="name"
                  value={newClient.name}
                  onChange={(e) => setNewClient({ ...newClient, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newClient.email}
                  onChange={(e) => setNewClient({ ...newClient, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="phone">{phoneLabel}</Label>
                <Input
                  id="phone"
                  value={newClient.phone}
                  onChange={(e) => setNewClient({ ...newClient, phone: e.target.value })}
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddClientOpen(false)}>
                {cancelButton}
              </Button>
              <Button onClick={handleAddClient}>{addButton}</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="mt-6 flex h-40 items-center justify-center">
          <p className="text-muted-foreground">{loadingText}</p>
        </div>
      ) : clients.length === 0 ? (
        <div className="mt-6 flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">{noClientsText}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {clients.map((client) => (
            <Card key={client.id}>
              <CardHeader className="pb-2">
                <CardTitle>{client.name}</CardTitle>
                <CardDescription>
                  {clientIdText}
                  {client.id.slice(-4)}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center text-sm">
                    <Mail className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{client.email || noEmailText}</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Phone className="mr-2 h-4 w-4 text-muted-foreground" />
                    <span>{client.phone}</span>
                  </div>
                  <div className="flex items-center justify-end gap-2 mt-4">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setCurrentClient(client)
                        setIsEditClientOpen(true)
                      }}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button variant="outline" size="icon" onClick={() => handleDeleteClient(client.id)}>
                      <Trash className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit Client Dialog */}
      <Dialog open={isEditClientOpen} onOpenChange={setIsEditClientOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editClientTitle}</DialogTitle>
            <DialogDescription>{editClientDescription}</DialogDescription>
          </DialogHeader>
          {currentClient && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">{nameLabel}</Label>
                <Input
                  id="edit-name"
                  value={currentClient.name}
                  onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">{emailLabel}</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentClient.email}
                  onChange={(e) => setCurrentClient({ ...currentClient, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-phone">{phoneLabel}</Label>
                <Input
                  id="edit-phone"
                  value={currentClient.phone}
                  onChange={(e) => setCurrentClient({ ...currentClient, phone: e.target.value })}
                />
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditClientOpen(false)}>
              {cancelButton}
            </Button>
            <Button onClick={handleEditClient}>{updateButton}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </DashboardLayout>
  )
}
