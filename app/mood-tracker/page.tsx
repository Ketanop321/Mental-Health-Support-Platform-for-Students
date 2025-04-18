import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus } from "lucide-react"
import MoodChart from "@/components/mood-chart"
import MoodCalendar from "@/components/mood-calendar"
import MoodStats from "@/components/mood-stats"

export default function MoodTracker() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Mood Tracker</h1>
          <p className="text-muted-foreground">Track and visualize your daily mood patterns over time.</p>
        </div>
        <Button asChild>
          <Link href="/mood-tracker/add">
            <Plus className="mr-2 h-4 w-4" /> Log Today's Mood
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Mood Trends</CardTitle>
            <CardDescription>Your mood and stress levels over the past week</CardDescription>
          </CardHeader>
          <CardContent>
            <MoodChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mood Stats</CardTitle>
            <CardDescription>Summary of your recent moods</CardDescription>
          </CardHeader>
          <CardContent>
            <MoodStats />
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Monthly Overview</CardTitle>
          <CardDescription>See your mood patterns throughout the month</CardDescription>
        </CardHeader>
        <CardContent>
          <MoodCalendar />
        </CardContent>
      </Card>
    </div>
  )
}
