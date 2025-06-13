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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"
import { Edit, Plus, Trash, Loader2 } from "lucide-react"
import { getUsers, createUser, updateUser, deleteUser, type User } from "@/lib/db"
import { useAuth } from "@/components/auth-provider"

export default function UsersPage() {
  const { t } = useLanguage()
  const { user: loggedInUser } = useAuth() // Get the current logged-in user
  const [users, setUsers] = useState<User[]>([])
  const [isAddUserOpen, setIsAddUserOpen] = useState(false)
  const [isEditUserOpen, setIsEditUserOpen] = useState(false)
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "employee" as const,
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  // Add a mounted state to prevent hydration issues
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    fetchUsers()
  }, [])

  const fetchUsers = async () => {
    setIsLoading(true)
    try {
      const usersData = await getUsers()
      setUsers(usersData)
    } catch (error) {
      console.error("Error fetching users:", error)
      toast({
        title: mounted ? t("users.error") : "Error",
        description: "Failed to load users. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddUser = async () => {
    // Validate inputs
    if (!newUser.name || !newUser.email || !newUser.password) {
      toast({
        title: mounted ? t("users.error") : "Error",
        description: "Name, email, and password are required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const user = await createUser({
        name: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      })

      if (user) {
        setUsers([...users, user])
        setIsAddUserOpen(false)
        setNewUser({
          name: "",
          email: "",
          password: "",
          role: "employee",
        })

        toast({
          title: mounted ? t("users.added") : "User added",
          description: mounted
            ? `${user.name} ${t("users.hasBeenAddedAs")} ${t(`common.${user.role}`)}`
            : `${user.name} has been added as ${user.role}`,
        })
      } else {
        throw new Error("Failed to create user")
      }
    } catch (error) {
      console.error("Error adding user:", error)
      toast({
        title: mounted ? t("users.error") : "Error",
        description: "Failed to add user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEditUser = async () => {
    if (!currentUser) return

    // Validate inputs
    if (!currentUser.name || !currentUser.email) {
      toast({
        title: mounted ? t("users.error") : "Error",
        description: "Name and email are required",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const updatedUser = await updateUser(currentUser.id, {
        name: currentUser.name,
        email: currentUser.email,
        role: currentUser.role,
        // Only update password if it's provided and not empty
        ...(currentUser.password && currentUser.password.trim() !== "" ? { password: currentUser.password } : {}),
      })

      if (updatedUser) {
        setUsers(users.map((user) => (user.id === updatedUser.id ? updatedUser : user)))
        setIsEditUserOpen(false)
        setCurrentUser(null)

        toast({
          title: mounted ? t("users.updated") : "User updated",
          description: mounted
            ? `${updatedUser.name} ${t("users.hasBeenUpdated")}`
            : `${updatedUser.name}'s information has been updated`,
        })
      } else {
        throw new Error("Failed to update user")
      }
    } catch (error) {
      console.error("Error updating user:", error)
      toast({
        title: mounted ? t("users.error") : "Error",
        description: "Failed to update user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteUser = async (id: string) => {
    // Check if this is the main manager account
    const userToDelete = users.find((user) => user.id === id)
    if (userToDelete?.email === "manager@sucrebiscoiteria.com.br") {
      toast({
        title: mounted ? t("users.cannotDelete") : "Cannot delete",
        description: mounted ? t("users.cannotDeleteMainManager") : "You cannot delete the main manager account",
        variant: "destructive",
      })
      return
    }

    // Check if user is trying to delete themselves
    if (loggedInUser && loggedInUser.id === id) {
      toast({
        title: mounted ? t("users.cannotDelete") : "Cannot delete",
        description: mounted ? t("users.cannotDeleteSelf") : "You cannot delete your own account",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)
    try {
      const success = await deleteUser(id)

      if (success) {
        setUsers(users.filter((user) => user.id !== id))
        toast({
          title: mounted ? t("users.deleted") : "User deleted",
          description: mounted ? t("users.hasBeenDeleted") : "The user has been deleted successfully",
        })
      } else {
        throw new Error("Failed to delete user")
      }
    } catch (error) {
      console.error("Error deleting user:", error)
      toast({
        title: mounted ? t("users.error") : "Error",
        description: "Failed to delete user. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Translated text with fallbacks for SSR
  const userManagementTitle = mounted ? t("users.title") : "User Management"
  const addUserButton = mounted ? t("users.addUser") : "Add User"
  const addNewUserTitle = mounted ? t("users.addUser") : "Add New User"
  const addUserDescription = mounted ? t("users.addUserDesc") : "Create a new user account for your staff"
  const editUserTitle = mounted ? t("users.editUser") : "Edit User"
  const editUserDescription = mounted ? t("users.editUserDesc") : "Update user information"
  const nameLabel = mounted ? t("common.name") : "Name"
  const emailLabel = mounted ? t("common.email") : "Email"
  const passwordLabel = mounted ? t("common.password") : "Password"
  const roleLabel = mounted ? t("users.role") : "Role"
  const managerText = mounted ? t("common.manager") : "Manager"
  const employeeText = mounted ? t("common.employee") : "Employee"
  const salesText = mounted ? t("common.sales") : "Sales"
  const cancelButton = mounted ? t("common.cancel") : "Cancel"
  const addButton = mounted ? t("common.add") : "Add User"
  const updateButton = mounted ? t("common.save") : "Update"
  const loadingText = mounted ? t("common.loading") : "Loading..."
  const noUsersText = mounted ? t("users.noUsers") : "No users found"

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
        <h2 className="text-2xl font-bold tracking-tight">{userManagementTitle}</h2>
        <Dialog open={isAddUserOpen} onOpenChange={setIsAddUserOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              {addUserButton}
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{addNewUserTitle}</DialogTitle>
              <DialogDescription>{addUserDescription}</DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">{nameLabel}</Label>
                <Input
                  id="name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">{emailLabel}</Label>
                <Input
                  id="email"
                  type="email"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">{passwordLabel}</Label>
                <Input
                  id="password"
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="role">{roleLabel}</Label>
                <Select
                  value={newUser.role}
                  onValueChange={(value: "manager" | "employee" | "sales") => setNewUser({ ...newUser, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={mounted ? t("users.selectRole") : "Select role"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">{managerText}</SelectItem>
                    <SelectItem value="employee">{employeeText}</SelectItem>
                    <SelectItem value="sales">{salesText}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddUserOpen(false)} disabled={isSubmitting}>
                {cancelButton}
              </Button>
              <Button onClick={handleAddUser} disabled={isSubmitting}>
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

      {users.length === 0 ? (
        <div className="mt-6 flex h-40 items-center justify-center rounded-md border border-dashed">
          <p className="text-muted-foreground">{noUsersText}</p>
        </div>
      ) : (
        <div className="mt-6 grid gap-6">
          {users.map((user) => (
            <Card key={user.id}>
              <CardHeader className="pb-2">
                <CardTitle>{user.name}</CardTitle>
                <CardDescription>{user.email}</CardDescription>
              </CardHeader>
              <CardContent className="flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold capitalize">
                    {mounted ? t(`common.${user.role}`) : user.role}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => {
                      setCurrentUser({ ...user, password: "" }) // Clear password field for editing
                      setIsEditUserOpen(true)
                    }}
                    disabled={isSubmitting}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => handleDeleteUser(user.id)}
                    disabled={
                      isSubmitting ||
                      user.email === "manager@sucrebiscoiteria.com.br" ||
                      (loggedInUser && loggedInUser.id === user.id)
                    }
                    title={
                      user.email === "manager@sucrebiscoiteria.com.br"
                        ? mounted
                          ? t("users.cannotDeleteMainManager")
                          : "You cannot delete the main manager account"
                        : loggedInUser && loggedInUser.id === user.id
                          ? mounted
                            ? t("users.cannotDeleteSelf")
                            : "You cannot delete your own account"
                          : ""
                    }
                  >
                    <Trash className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Edit User Dialog */}
      <Dialog open={isEditUserOpen} onOpenChange={setIsEditUserOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editUserTitle}</DialogTitle>
            <DialogDescription>{editUserDescription}</DialogDescription>
          </DialogHeader>
          {currentUser && (
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="edit-name">{nameLabel}</Label>
                <Input
                  id="edit-name"
                  value={currentUser.name}
                  onChange={(e) => setCurrentUser({ ...currentUser, name: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-email">{emailLabel}</Label>
                <Input
                  id="edit-email"
                  type="email"
                  value={currentUser.email}
                  onChange={(e) => setCurrentUser({ ...currentUser, email: e.target.value })}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-password">{`${passwordLabel} (${mounted ? t("users.leaveBlankToKeep") : "Leave blank to keep current"})`}</Label>
                <Input
                  id="edit-password"
                  type="password"
                  value={currentUser.password}
                  onChange={(e) => setCurrentUser({ ...currentUser, password: e.target.value })}
                  placeholder="••••••••"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="edit-role">{roleLabel}</Label>
                <Select
                  value={currentUser.role}
                  onValueChange={(value: "manager" | "employee" | "sales") =>
                    setCurrentUser({ ...currentUser, role: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder={mounted ? t("users.selectRole") : "Select role"} />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manager">{managerText}</SelectItem>
                    <SelectItem value="employee">{employeeText}</SelectItem>
                    <SelectItem value="sales">{salesText}</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditUserOpen(false)} disabled={isSubmitting}>
              {cancelButton}
            </Button>
            <Button onClick={handleEditUser} disabled={isSubmitting}>
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
