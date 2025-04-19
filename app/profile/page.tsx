"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Save, User, Bell, Shield, Download } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export default function ProfilePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  // User profile state
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    bio: "",
    avatar: "",
    preferences: {
      emailNotifications: true,
      pushNotifications: false,
      weeklyReport: true,
      theme: "system",
      privacyLevel: "private",
    },
  })

  // Fetch user profile data
  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/login")
      return
    }

    const fetchProfile = async () => {
      try {
        const response = await fetch("/api/user/profile")

        if (response.ok) {
          const data = await response.json()
          setProfile({
            name: data.name || session?.user?.name || "",
            email: data.email || session?.user?.email || "",
            bio: data.bio || "",
            avatar: data.avatar || session?.user?.image || "",
            preferences: {
              ...profile.preferences,
              ...data.preferences,
            },
          })
        } else {
          // If no profile exists yet, use session data
          setProfile({
            ...profile,
            name: session?.user?.name || "",
            email: session?.user?.email || "",
            avatar: session?.user?.image || "",
          })
        }
      } catch (error) {
        console.error("Error fetching profile:", error)
        toast({
          title: "Error",
          description: "Failed to load profile data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchProfile()
  }, [session, status, router, toast])

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)

    try {
      const response = await fetch("/api/user/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(profile),
      })

      if (response.ok) {
        toast({
          title: "Profile updated",
          description: "Your profile has been updated successfully",
        })
      } else {
        throw new Error("Failed to update profile")
      }
    } catch (error) {
      console.error("Error updating profile:", error)
      toast({
        title: "Error",
        description: "Failed to update profile",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  // Handle data export
  const handleExportData = async () => {
    try {
      const response = await fetch("/api/user/export-data")

      if (response.ok) {
        const data = await response.json()

        // Create a downloadable file
        const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" })
        const url = URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = "mindful-campus-data.json"
        document.body.appendChild(a)
        a.click()
        document.body.removeChild(a)
        URL.revokeObjectURL(url)

        toast({
          title: "Data exported",
          description: "Your data has been exported successfully",
        })
      } else {
        throw new Error("Failed to export data")
      }
    } catch (error) {
      console.error("Error exporting data:", error)
      toast({
        title: "Error",
        description: "Failed to export your data",
        variant: "destructive",
      })
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto py-8">
      <h1 className="text-3xl font-bold tracking-tight mb-6">Your Profile</h1>

      <Tabs defaultValue="profile">
        <TabsList className="mb-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="h-4 w-4" />
            <span>Profile</span>
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="h-4 w-4" />
            <span>Notifications</span>
          </TabsTrigger>
          <TabsTrigger value="privacy" className="flex items-center gap-2">
            <Shield className="h-4 w-4" />
            <span>Privacy</span>
          </TabsTrigger>
        </TabsList>

        <form onSubmit={handleSubmit}>
          <TabsContent value="profile">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Update your personal details</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex flex-col items-center space-y-4 mb-4">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={profile.avatar || "/placeholder.svg?height=96&width=96"} alt={profile.name} />
                      <AvatarFallback>{profile.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <Button variant="outline" size="sm">
                      Change Avatar
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={profile.name}
                      onChange={(e) => setProfile({ ...profile, name: e.target.value })}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profile.email}
                      onChange={(e) => setProfile({ ...profile, email: e.target.value })}
                      disabled
                    />
                    <p className="text-xs text-muted-foreground">
                      Email cannot be changed. Contact support for assistance.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>About You</CardTitle>
                  <CardDescription>Share a bit about yourself</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      placeholder="Tell us a bit about yourself..."
                      value={profile.bio}
                      onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
                      rows={6}
                    />
                    <p className="text-xs text-muted-foreground">
                      This information will be visible to community members if you choose to share it.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="theme">Theme Preference</Label>
                    <Select
                      value={profile.preferences.theme}
                      onValueChange={(value) =>
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, theme: value },
                        })
                      }
                    >
                      <SelectTrigger id="theme">
                        <SelectValue placeholder="Select theme" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="light">Light</SelectItem>
                        <SelectItem value="dark">Dark</SelectItem>
                        <SelectItem value="system">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="notifications">
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Manage how you receive notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="email-notifications">Email Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive email notifications about your wellness journey
                    </p>
                  </div>
                  <Switch
                    id="email-notifications"
                    checked={profile.preferences.emailNotifications}
                    onCheckedChange={(checked) =>
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, emailNotifications: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="push-notifications">Push Notifications</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive push notifications for reminders and updates
                    </p>
                  </div>
                  <Switch
                    id="push-notifications"
                    checked={profile.preferences.pushNotifications}
                    onCheckedChange={(checked) =>
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, pushNotifications: checked },
                      })
                    }
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label htmlFor="weekly-report">Weekly Wellness Report</Label>
                    <p className="text-sm text-muted-foreground">
                      Receive a weekly summary of your mood and wellness data
                    </p>
                  </div>
                  <Switch
                    id="weekly-report"
                    checked={profile.preferences.weeklyReport}
                    onCheckedChange={(checked) =>
                      setProfile({
                        ...profile,
                        preferences: { ...profile.preferences, weeklyReport: checked },
                      })
                    }
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="privacy">
            <div className="grid gap-6 md:grid-cols-2">
              <Card>
                <CardHeader>
                  <CardTitle>Privacy Settings</CardTitle>
                  <CardDescription>Control your data and privacy</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="privacy-level">Privacy Level</Label>
                    <Select
                      value={profile.preferences.privacyLevel}
                      onValueChange={(value) =>
                        setProfile({
                          ...profile,
                          preferences: { ...profile.preferences, privacyLevel: value },
                        })
                      }
                    >
                      <SelectTrigger id="privacy-level">
                        <SelectValue placeholder="Select privacy level" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="private">Private (Only you can see your data)</SelectItem>
                        <SelectItem value="limited">Limited (Share with counselors only)</SelectItem>
                        <SelectItem value="community">Community (Share with community members)</SelectItem>
                      </SelectContent>
                    </Select>
                    <p className="text-xs text-muted-foreground">
                      This controls who can see your profile and activity in the community.
                    </p>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Data Management</CardTitle>
                  <CardDescription>Manage your personal data</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div>
                      <h3 className="text-sm font-medium">Export Your Data</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Download a copy of all your data from MindfulCampus
                      </p>
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleExportData}
                        className="flex items-center gap-2"
                      >
                        <Download className="h-4 w-4" />
                        Export Data
                      </Button>
                    </div>

                    <div>
                      <h3 className="text-sm font-medium">Delete Account</h3>
                      <p className="text-sm text-muted-foreground mb-2">
                        Permanently delete your account and all associated data
                      </p>
                      <Button type="button" variant="destructive">
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <div className="mt-6 flex justify-end">
            <Button type="submit" disabled={isSaving}>
              {isSaving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="mr-2 h-4 w-4" />
                  Save Changes
                </>
              )}
            </Button>
          </div>
        </form>
      </Tabs>
    </div>
  )
}
