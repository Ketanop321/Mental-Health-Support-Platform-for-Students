import type React from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { ArrowRight, MessageCircle, Video, Gamepad2, Music } from "lucide-react"
import MoodChart from "@/components/mood-chart"
import RecentJournalEntries from "@/components/recent-journal-entries"
import WellnessScore from "@/components/wellness-score"
import Image from "next/image"

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

      {/* Inspirational Quote */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-none">
        <CardContent className="p-6">
          <blockquote className="text-center italic">
            "Self-care is not self-indulgence, it is self-preservation."
            <footer className="text-sm mt-2 text-muted-foreground">— Audre Lorde</footer>
          </blockquote>
        </CardContent>
      </Card>

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
              icon={<Video className="h-5 w-5 text-primary" />}
              title="Anxiety Relief Videos"
              description="Watch expert-guided anxiety relief techniques"
              href="/videos"
            />
            <RecommendationItem
              icon={<Gamepad2 className="h-5 w-5 text-primary" />}
              title="Breathing Exercise"
              description="Try our interactive breathing exercise for stress relief"
              href="/games/breathing"
            />
            <RecommendationItem
              icon={<Music className="h-5 w-5 text-primary" />}
              title="Calming Music"
              description="Listen to soothing tracks for better focus and relaxation"
              href="/music"
            />
            <RecommendationItem
              icon={<MessageCircle className="h-5 w-5 text-primary" />}
              title="Community Support"
              description="Connect with peers facing similar challenges"
              href="/community"
            />
          </CardContent>
        </Card>
      </div>

      {/* Featured Wellness Activities */}
      <div>
        <h2 className="text-2xl font-bold mb-4">Featured Wellness Activities</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <Link href="/games/breathing" className="group">
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Breathing Exercise"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-3 text-white">
                  <h3 className="font-medium">Breathing Exercise</h3>
                  <p className="text-xs text-white/80">Reduce anxiety in minutes</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/videos" className="group">
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Meditation Videos"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-3 text-white">
                  <h3 className="font-medium">Meditation Videos</h3>
                  <p className="text-xs text-white/80">Guided practices for mindfulness</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/games/color-therapy" className="group">
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Color Therapy"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-3 text-white">
                  <h3 className="font-medium">Color Therapy</h3>
                  <p className="text-xs text-white/80">Express yourself through art</p>
                </div>
              </div>
            </div>
          </Link>
          <Link href="/music" className="group">
            <div className="relative rounded-lg overflow-hidden aspect-video">
              <Image
                src="/placeholder.svg?height=200&width=300"
                alt="Calming Music"
                fill
                className="object-cover transition-transform group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
                <div className="p-3 text-white">
                  <h3 className="font-medium">Calming Music</h3>
                  <p className="text-xs text-white/80">Soothing sounds for relaxation</p>
                </div>
              </div>
            </div>
          </Link>
        </div>
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
