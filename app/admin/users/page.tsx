"use client"

import { useState, useEffect } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { SimulatedDatabase } from "@/lib/database"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  Eye,
  EyeOff,
  Users,
  Shield,
  UserCheck,
  Search,
  Calendar,
  Clock,
  Edit,
  Trash2,
  UserPlus,
  CheckCircle,
} from "lucide-react"
import type { User } from "@/types"

function UserManagementContent() {
  const [users, setUsers] = useState<User[]>([])
  const [showPasswords, setShowPasswords] = useState<Record<string, boolean>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedUser, setSelectedUser] = useState<User | null>(null)
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")
  const db = SimulatedDatabase.getInstance()

  // New user form state
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "participant" as "admin" | "employee" | "participant",
  })

  // Load users on component mount
  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = () => {
    const loadedUsers = db.getUsers().map((user: any) => ({
      ...user,
      createdAt: new Date(user.createdAt),
      lastLogin: new Date(user.lastLogin),
    }))
    setUsers(loadedUsers)
  }

  const togglePasswordVisibility = (userId: string) => {
    setShowPasswords((prev) => ({
      ...prev,
      [userId]: !prev[userId],
    }))
  }

  const handleCreateUser = async () => {
    if (!newUser.name || !newUser.email || !newUser.password) {
      return
    }

    // Check if email already exists
    if (users.find((u) => u.email === newUser.email)) {
      return
    }

    const user: User = {
      id: `user_${Date.now()}`,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      username: `@${newUser.name.toLowerCase().replace(/\s+/g, "_")}_stocksim`,
      createdAt: new Date(),
      lastLogin: new Date(),
    }

    const updatedUsers = [...users, user]
    setUsers(updatedUsers)
    db.saveUsers(updatedUsers)

    setNewUser({ name: "", email: "", password: "", role: "participant" })
    setIsAddDialogOpen(false)
    setSuccessMessage(`User ${user.name} created successfully!`)
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleUpdateUserRole = (userId: string, newRole: "admin" | "employee" | "participant") => {
    const updatedUsers = users.map((user) => (user.id === userId ? { ...user, role: newRole } : user))
    setUsers(updatedUsers)
    db.saveUsers(updatedUsers)
    setSuccessMessage("User role updated successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleDeleteUser = (userId: string) => {
    const updatedUsers = users.filter((user) => user.id !== userId)
    setUsers(updatedUsers)
    db.saveUsers(updatedUsers)
    setSuccessMessage("User deleted successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const handleUpdateUser = () => {
    if (!editingUser) return

    const updatedUsers = users.map((user) => (user.id === editingUser.id ? editingUser : user))
    setUsers(updatedUsers)
    db.saveUsers(updatedUsers)
    setIsEditDialogOpen(false)
    setEditingUser(null)
    setSuccessMessage("User updated successfully!")
    setTimeout(() => setSuccessMessage(""), 3000)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "admin":
        return "bg-red-500/20 text-red-400 border-red-500/30"
      case "employee":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30"
      case "participant":
        return "bg-green-500/20 text-green-400 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30"
    }
  }

  const getRoleIcon = (role: string) => {
    switch (role) {
      case "admin":
        return <Shield className="h-4 w-4" />
      case "employee":
        return <UserCheck className="h-4 w-4" />
      case "participant":
        return <Users className="h-4 w-4" />
      default:
        return <Users className="h-4 w-4" />
    }
  }

  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.username.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          User Management
        </h1>
        <div className="flex items-center space-x-4">
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700">
                <UserPlus className="h-4 w-4 mr-2" />
                Add User
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 border-gray-700">
              <DialogHeader>
                <DialogTitle className="text-white">Create New User</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Full Name"
                  value={newUser.name}
                  onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Input
                  type="email"
                  placeholder="Email Address"
                  value={newUser.email}
                  onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Input
                  type="password"
                  placeholder="Password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                  className="bg-gray-800 border-gray-600 text-white"
                />
                <Select value={newUser.role} onValueChange={(value: any) => setNewUser({ ...newUser, role: value })}>
                  <SelectTrigger className="bg-gray-800 border-gray-600 text-white">
                    <SelectValue placeholder="Select role" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border-gray-600">
                    <SelectItem value="participant" className="text-white">
                      Participant
                    </SelectItem>
                    <SelectItem value="employee" className="text-white">
                      Employee
                    </SelectItem>
                    <SelectItem value="admin" className="text-white">
                      Admin
                    </SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={handleCreateUser} className="w-full bg-purple-600 hover:bg-purple-700">
                  Create User
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Badge className="bg-red-500/20 text-red-400 border-red-500/30">
            <Shield className="h-4 w-4 mr-2" />
            Admin Access
          </Badge>
        </div>
      </div>

      {successMessage && (
        <Alert className="mb-6 border-green-500/50 bg-green-500/10">
          <CheckCircle className="h-4 w-4 text-green-400" />
          <AlertDescription className="text-green-400">{successMessage}</AlertDescription>
        </Alert>
      )}

      {/* Search */}
      <Card className="mb-6 bg-gray-900/50 border-gray-700">
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search users by name, email, or username..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card className="bg-gray-900/50 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white flex items-center">
            <Users className="h-5 w-5 mr-2" />
            All System Users ({filteredUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-gray-700">
                  <TableHead className="text-gray-300">User Info</TableHead>
                  <TableHead className="text-gray-300">Role</TableHead>
                  <TableHead className="text-gray-300">Credentials</TableHead>
                  <TableHead className="text-gray-300">Account Details</TableHead>
                  <TableHead className="text-gray-300">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id} className="border-gray-700 hover:bg-gray-800/50">
                    <TableCell>
                      <div>
                        <p className="font-medium text-white">{user.name}</p>
                        <p className="text-sm text-gray-400">{user.email}</p>
                        <p className="text-xs text-purple-400">{user.username}</p>
                      </div>
                    </TableCell>

                    <TableCell>
                      <Select value={user.role} onValueChange={(value: any) => handleUpdateUserRole(user.id, value)}>
                        <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
                          <Badge className={getRoleColor(user.role)}>
                            {getRoleIcon(user.role)}
                            <span className="ml-1">{user.role.toUpperCase()}</span>
                          </Badge>
                        </SelectTrigger>
                        <SelectContent className="bg-gray-800 border-gray-600">
                          <SelectItem value="participant" className="text-white">
                            Participant
                          </SelectItem>
                          <SelectItem value="employee" className="text-white">
                            Employee
                          </SelectItem>
                          <SelectItem value="admin" className="text-white">
                            Admin
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>

                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <code className="bg-gray-800 px-2 py-1 rounded text-sm text-green-400">
                          {showPasswords[user.id] ? user.password : "••••••••"}
                        </code>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => togglePasswordVisibility(user.id)}
                          className="text-gray-400 hover:text-white"
                        >
                          {showPasswords[user.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="text-sm">
                        <div className="flex items-center text-gray-400 mb-1">
                          <Calendar className="h-3 w-3 mr-1" />
                          <span>Joined: {user.createdAt.toLocaleDateString()}</span>
                        </div>
                        <div className="flex items-center text-gray-400">
                          <Clock className="h-3 w-3 mr-1" />
                          <span>Last: {user.lastLogin.toLocaleDateString()}</span>
                        </div>
                      </div>
                    </TableCell>

                    <TableCell>
                      <div className="flex space-x-2">
                        <Dialog>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => setSelectedUser(user)}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              View
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">User Details</DialogTitle>
                            </DialogHeader>
                            {selectedUser && (
                              <div className="space-y-4">
                                <div className="grid grid-cols-2 gap-4">
                                  <div>
                                    <label className="text-sm text-gray-400">Full Name</label>
                                    <p className="text-white font-medium">{selectedUser.name}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400">Email</label>
                                    <p className="text-white font-medium">{selectedUser.email}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400">Username</label>
                                    <p className="text-purple-400 font-medium">{selectedUser.username}</p>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400">Role</label>
                                    <Badge className={getRoleColor(selectedUser.role)}>
                                      {selectedUser.role.toUpperCase()}
                                    </Badge>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400">Password</label>
                                    <code className="block bg-gray-800 px-2 py-1 rounded text-green-400">
                                      {selectedUser.password}
                                    </code>
                                  </div>
                                  <div>
                                    <label className="text-sm text-gray-400">User ID</label>
                                    <code className="block bg-gray-800 px-2 py-1 rounded text-blue-400 text-xs">
                                      {selectedUser.id}
                                    </code>
                                  </div>
                                </div>
                                <div className="pt-4 border-t border-gray-700">
                                  <div className="grid grid-cols-2 gap-4">
                                    <div>
                                      <label className="text-sm text-gray-400">Account Created</label>
                                      <p className="text-white">{selectedUser.createdAt.toLocaleString()}</p>
                                    </div>
                                    <div>
                                      <label className="text-sm text-gray-400">Last Login</label>
                                      <p className="text-white">{selectedUser.lastLogin.toLocaleString()}</p>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                          <DialogTrigger asChild>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => {
                                setEditingUser(user)
                                setIsEditDialogOpen(true)
                              }}
                              className="border-gray-600 text-gray-300 hover:bg-gray-700"
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="bg-gray-900 border-gray-700">
                            <DialogHeader>
                              <DialogTitle className="text-white">Edit User</DialogTitle>
                            </DialogHeader>
                            {editingUser && (
                              <div className="space-y-4">
                                <Input
                                  placeholder="Full Name"
                                  value={editingUser.name}
                                  onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                                  className="bg-gray-800 border-gray-600 text-white"
                                />
                                <Input
                                  type="email"
                                  placeholder="Email"
                                  value={editingUser.email}
                                  onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                                  className="bg-gray-800 border-gray-600 text-white"
                                />
                                <Input
                                  type="password"
                                  placeholder="Password"
                                  value={editingUser.password}
                                  onChange={(e) => setEditingUser({ ...editingUser, password: e.target.value })}
                                  className="bg-gray-800 border-gray-600 text-white"
                                />
                                <Button onClick={handleUpdateUser} className="w-full bg-purple-600 hover:bg-purple-700">
                                  Update User
                                </Button>
                              </div>
                            )}
                          </DialogContent>
                        </Dialog>

                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDeleteUser(user.id)}
                          className="bg-red-600 hover:bg-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default function UserManagement() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <UserManagementContent />
    </ProtectedRoute>
  )
}
