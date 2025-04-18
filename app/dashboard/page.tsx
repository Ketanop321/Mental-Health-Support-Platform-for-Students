import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, BarChart3, BookOpen, MessageCircle, Sparkles } from "lucide-react"
import MoodChart from "@/components/mood-chart"
import RecentJournalEntries from "@/components/recent-journal-entries"
import WellnessScore from "@/components/wellness-score"

export default function Dashboard() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-muted-foreground">Welcome back! Here's an overview of your mental wellness journey.</p>
        </div>
        <div className="flex items-center gap-2">
          <Button asChild>
            <Link href="/mood-tracker/add">Log Today's Mood</Link>
          </Button>
          <Button variant="outline" asChild>
            <Link href="/journal/new">Write Journal Entry</Link>
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="md:col-span-2">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Mood Trends</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/mood-tracker" className="flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <MoodChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Wellness Score</CardTitle>
            <CardDescription>Based on your recent activity</CardDescription>
          </CardHeader>
          <CardContent>
            <WellnessScore score={78} />
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xl font-medium">Recent Journal Entries</CardTitle>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/journal" className="flex items-center gap-1">
                View All <ArrowRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <RecentJournalEntries />
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-xl font-medium">Recommended For You</CardTitle>
            <CardDescription>Based on your recent mood and journal entries</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <RecommendationItem
              icon={<BookOpen className="h-5 w-5 text-primary" />}
              title="5-Minute Journaling Exercise"
              description="A quick gratitude practice to boost your mood"
              href="/resources/journaling-exercise"
            />
            <RecommendationItem
              icon={<BarChart3 className="h-5 w-5 text-primary" />}
              title="Understanding Stress Patterns"
              description="Learn to identify your stress triggers"
              href="/resources/stress-patterns"
            />
            <RecommendationItem
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
              title="Guided Meditation"
              description="10-minute meditation for anxiety relief"
              href="/resources/guided-meditation"
            />
            <RecommendationItem
              icon={<Sparkles className="h-5 w-5 text-primary" />}
              title="Sleep Improvement Tips"
              description="Practical strategies for better sleep"
              href="/resources/sleep-tips"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

function RecommendationItem({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Link href={href} className="block">
      <div className="flex items-start space-x-3 p-3 rounded-md hover:bg-muted transition-colors">
        <div className="mt-0.5">{icon}</div>
        <div>
          <h4 className="font-medium">{title}</h4>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
      </div>
    </Link>
  )
}
