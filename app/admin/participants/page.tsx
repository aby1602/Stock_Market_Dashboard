"use client"

import { useState } from "react"
import { ProtectedRoute } from "@/components/protected-route"
import { useApp } from "@/contexts/app-context"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { DollarSign } from "lucide-react"

function ParticipantManagementContent() {
  const { participants, updateWalletBalance } = useApp()
  const [editingParticipant, setEditingParticipant] = useState<string | null>(null)
  const [newBalance, setNewBalance] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleUpdateBalance = (participantId: string) => {
    if (newBalance) {
      updateWalletBalance(participantId, Number.parseFloat(newBalance))
      setEditingParticipant(null)
      setNewBalance("")
      setIsDialogOpen(false)
    }
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-8">Participant Management</h1>

      <Card>
        <CardHeader>
          <CardTitle>Participants</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Wallet Balance</TableHead>
                <TableHead>Portfolio Value</TableHead>
                <TableHead>Total Value</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {participants.map((participant) => (
                <TableRow key={participant.id}>
                  <TableCell className="font-medium">{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                  <TableCell>${participant.walletBalance.toLocaleString()}</TableCell>
                  <TableCell>${participant.totalPortfolioValue.toLocaleString()}</TableCell>
                  <TableCell className="font-semibold">
                    ${(participant.walletBalance + participant.totalPortfolioValue).toLocaleString()}
                  </TableCell>
                  <TableCell>
                    <Dialog
                      open={isDialogOpen && editingParticipant === participant.id}
                      onOpenChange={(open) => {
                        setIsDialogOpen(open)
                        if (!open) {
                          setEditingParticipant(null)
                          setNewBalance("")
                        }
                      }}
                    >
                      <DialogTrigger asChild>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setEditingParticipant(participant.id)
                            setNewBalance(participant.walletBalance.toString())
                            setIsDialogOpen(true)
                          }}
                        >
                          <DollarSign className="h-4 w-4 mr-1" />
                          Update Balance
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Update Wallet Balance</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <p>
                            Updating balance for: <strong>{participant.name}</strong>
                          </p>
                          <Input
                            type="number"
                            step="0.01"
                            placeholder="New balance"
                            value={newBalance}
                            onChange={(e) => setNewBalance(e.target.value)}
                          />
                          <Button onClick={() => handleUpdateBalance(participant.id)} className="w-full">
                            Update Balance
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}

export default function ParticipantManagement() {
  return (
    <ProtectedRoute allowedRoles={["admin"]}>
      <ParticipantManagementContent />
    </ProtectedRoute>
  )
}
