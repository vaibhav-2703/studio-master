"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/hooks/useAuth"
import { User, Mail, Edit3, Save, X, Camera, LogOut, BarChart3, Settings, CreditCard } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { motion } from "framer-motion"
import Link from "next/link"
import * as DialogPrimitive from "@radix-ui/react-dialog"

export function UserProfile() {
  const { user, updateProfile, logout } = useAuth()
  const { toast } = useToast()
  const [isEditing, setIsEditing] = useState(false)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [userStats, setUserStats] = useState({ totalLinks: 0, totalClicks: 0 })
  const [editData, setEditData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    avatar: user?.avatar || ""
  })

  // Fetch user stats on component mount and when dialog opens
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/user/stats')
        if (response.ok) {
          const stats = await response.json()
          setUserStats(stats)
        }
      } catch (error) {
        console.error('Failed to fetch user stats:', error)
      }
    }

    if (user) {
      fetchStats()
    }
  }, [user, isDialogOpen]) // Refetch when dialog opens to get latest stats

  const handleLogout = async () => {
    try {
      await logout()
      toast({
        title: "Logged Out",
        description: "You have been successfully logged out.",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to logout. Please try again.",
      })
    }
  }

  const handleSave = async () => {
    try {
      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: editData.name,
          email: editData.email,
          avatar: editData.avatar
        }),
      });

      const data = await response.json();

      if (response.ok) {
        toast({
          title: "Profile Updated",
          description: "Your profile has been updated successfully.",
        });
        // Update the auth context with the new user data
        updateProfile({
          name: editData.name,
          email: editData.email,
          avatar: editData.avatar
        });
        setIsEditing(false);
      } else {
        throw new Error(data.error || 'Failed to update profile');
      }
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to update profile. Please try again.",
      });
    }
  }

  const handleCancel = () => {
    setEditData({
      name: user?.name || "",
      email: user?.email || "",
      avatar: user?.avatar || ""
    })
    setIsEditing(false)
  }

  const handleAvatarUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        setEditData(prev => ({ ...prev, avatar: e.target?.result as string }))
      }
      reader.readAsDataURL(file)
    }
  }

  if (!user) return null

  return (
    <>
      {/* Dropdown Menu for Avatar */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-9 w-9 rounded-full hover:scale-105 transition-transform duration-200">
            <Avatar className="h-8 w-8">
              <AvatarImage src={editData.avatar || undefined} />
              <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-white text-sm">
                {user.name?.charAt(0)?.toUpperCase() || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user.name}</p>
              <p className="text-xs leading-none text-muted-foreground">
                {user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={() => setIsDialogOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            <span>Profile Settings</span>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/dashboard">
              <User className="mr-2 h-4 w-4" />
              <span>Dashboard</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuItem asChild>
            <Link href="/dashboard/analytics">
              <BarChart3 className="mr-2 h-4 w-4" />
              <span>Analytics</span>
            </Link>
          </DropdownMenuItem>
          
          <DropdownMenuSeparator />
          
          <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Profile Settings Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogPrimitive.Portal>
          {/* Custom Blue Overlay */}
          <DialogPrimitive.Overlay 
            className="fixed inset-0 z-50 bg-gradient-to-br from-blue-600/20 via-blue-500/30 to-blue-800/25 backdrop-blur-sm data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" 
          />
          <DialogPrimitive.Content className="fixed left-[50%] top-[50%] z-50 grid w-full max-w-[500px] max-h-[90vh] overflow-y-auto translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-xl duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[state=closed]:slide-out-to-left-1/2 data-[state=closed]:slide-out-to-top-[48%] data-[state=open]:slide-in-from-left-1/2 data-[state=open]:slide-in-from-top-[48%] sm:rounded-lg">
            <DialogPrimitive.Close className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground">
              <X className="h-4 w-4" />
              <span className="sr-only">Close</span>
            </DialogPrimitive.Close>
        
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Profile Settings
              </DialogTitle>
            </DialogHeader>
        
        <div className="space-y-6">
          {/* Avatar Section */}
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center space-y-4">
                <div className="relative">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={editData.avatar || undefined} />
                    <AvatarFallback className="bg-gradient-to-r from-primary to-primary/80 text-white text-2xl">
                      {user.name?.charAt(0)?.toUpperCase() || "U"}
                    </AvatarFallback>
                  </Avatar>
                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="absolute -bottom-2 -right-2"
                    >
                      <label htmlFor="avatar-upload" className="cursor-pointer">
                        <div className="flex items-center justify-center w-8 h-8 bg-primary text-white rounded-full shadow-lg hover:bg-primary/90 transition-colors">
                          <Camera className="h-4 w-4" />
                        </div>
                        <input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleAvatarUpload}
                          className="hidden"
                        />
                      </label>
                    </motion.div>
                  )}
                </div>
                {!isEditing && (
                  <p className="text-sm text-muted-foreground">Click to upload avatar</p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Profile Information */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <div>
                <CardTitle className="text-lg">Profile Information</CardTitle>
                <CardDescription>Manage your account details</CardDescription>
              </div>
              {!isEditing && (
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={() => setIsEditing(true)}
                  className="gap-2"
                >
                  <Edit3 className="h-4 w-4" />
                  Edit
                </Button>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                {isEditing ? (
                  <Input
                    id="name"
                    value={editData.name}
                    onChange={(e) => setEditData(prev => ({ ...prev, name: e.target.value }))}
                    placeholder="Enter your full name"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <User className="h-4 w-4 text-muted-foreground" />
                    <span>{user.name}</span>
                  </div>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                {isEditing ? (
                  <Input
                    id="email"
                    type="email"
                    value={editData.email}
                    onChange={(e) => setEditData(prev => ({ ...prev, email: e.target.value }))}
                    placeholder="Enter your email"
                  />
                ) : (
                  <div className="flex items-center gap-2 p-2 bg-muted rounded-md">
                    <Mail className="h-4 w-4 text-muted-foreground" />
                    <span>{user.email}</span>
                  </div>
                )}
              </div>

              {isEditing && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-2 pt-4"
                >
                  <Button onClick={handleSave} className="flex-1 gap-2">
                    <Save className="h-4 w-4" />
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={handleCancel} className="gap-2">
                    <X className="h-4 w-4" />
                    Cancel
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>

          {/* Account Stats */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Account Statistics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">{userStats.totalLinks}</p>
                  <p className="text-sm text-muted-foreground">Links Created</p>
                </div>
                <div className="space-y-1">
                  <p className="text-2xl font-bold text-primary">{userStats.totalClicks}</p>
                  <p className="text-sm text-muted-foreground">Total Clicks</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions - Mobile friendly navigation */}
          <Card className="md:hidden">
            <CardHeader>
              <CardTitle className="text-lg">Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/dashboard" className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <User className="h-4 w-4" />
                  Dashboard
                </Button>
              </Link>
              <Link href="/dashboard/analytics" className="block">
                <Button variant="outline" className="w-full justify-start gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Analytics
                </Button>
              </Link>
              <Separator />
              <Button 
                variant="outline" 
                onClick={logout}
                className="w-full justify-start gap-2 text-destructive hover:text-destructive"
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </CardContent>
          </Card>
        </div>
          </DialogPrimitive.Content>
        </DialogPrimitive.Portal>
      </Dialog>
    </>
  )
}
