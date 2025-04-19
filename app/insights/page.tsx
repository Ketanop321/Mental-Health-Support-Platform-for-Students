"use client"

import { Badge } from "@/components/ui/badge"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { Loader2, Calendar, BarChart3, LineChart, TrendingUp, Brain } from "lucide-react"
import {
  ResponsiveContainer,
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  BarChart as RechartsBarChart,
  Bar,
  PieChart as RechartsPieChart,
  Pie,
  Cell,
} from "recharts"

// Sample data - will be replaced with real data from API
const COLORS = ["#8b5cf6", "#ec4899", "#10b981", "#3b82f6", "#f59e0b", "#ef4444"]

export default function InsightsPage() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(true)
  const [moodData, setMoodData] = useState<any[]>([])
  const [journalData, setJournalData] = useState<any[]>([])
  const [insights, setInsights] = useState<any[]>([])
  const [timeRange, setTimeRange] = useState("month")

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true)
      try {
        // Fetch mood data
        const moodResponse = await fetch(`/api/mood?range=${timeRange}`)
        if (moodResponse.ok) {
          const { entries } = await moodResponse.json()
          setMoodData(entries)
        }

        // Fetch journal data
        const journalResponse = await fetch(`/api/journal?range=${timeRange}`)
        if (journalResponse.ok) {
          const { entries } = await journalResponse.json()
          setJournalData(entries)
        }

        // Fetch AI insights
        const insightsResponse = await fetch("/api/insights")
        if (insightsResponse.ok) {
          const { insights } = await insightsResponse.json()
          setInsights(insights)
        }
      } catch (error) {
        console.error("Error fetching data:", error)
        toast({
          title: "Error",
          description: "Failed to load insights data",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange, toast])

  // Process mood data for charts
  const processedMoodData = moodData
    .map((entry) => ({
      date: new Date(entry.date).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
      mood: entry.mood,
      stress: entry.stress,
    }))
    .reverse()

  // Calculate mood distribution
  const moodDistribution = [1, 2, 3, 4, 5].map((level) => ({
    name:
      level === 1 ? "Very Sad" : level === 2 ? "Sad" : level === 3 ? "Neutral" : level === 4 ? "Happy" : "Very Happy",
    value: moodData.filter((entry) => entry.mood === level).length,
  }))

  // Calculate sentiment distribution from journal entries
  const sentimentDistribution = [
    { name: "Positive", value: journalData.filter((entry) => entry.sentiment === "positive").length },
    { name: "Neutral", value: journalData.filter((entry) => entry.sentiment === "neutral").length },
    { name: "Negative", value: journalData.filter((entry) => entry.sentiment === "negative").length },
  ]

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Wellness Insights</h1>
          <p className="text-muted-foreground">
            Visualize your mental health data and discover patterns in your wellbeing journey.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Button variant={timeRange === "week" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("week")}>
            Week
          </Button>
          <Button
            variant={timeRange === "month" ? "default" : "outline"}
            size="sm"
            onClick={() => setTimeRange("month")}
          >
            Month
          </Button>
          <Button variant={timeRange === "year" ? "default" : "outline"} size="sm" onClick={() => setTimeRange("year")}>
            Year
          </Button>
        </div>
      </div>

      <Tabs defaultValue="overview">
        <TabsList>
          <TabsTrigger value="overview" className="flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            <span>Overview</span>
          </TabsTrigger>
          <TabsTrigger value="mood" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            <span>Mood Tracking</span>
          </TabsTrigger>
          <TabsTrigger value="journal" className="flex items-center gap-2">
            <LineChart className="h-4 w-4" />
            <span>Journal Analysis</span>
          </TabsTrigger>
          <TabsTrigger value="ai-insights" className="flex items-center gap-2">
            <Brain className="h-4 w-4" />
            <span>AI Insights</span>
          </TabsTrigger>
        </TabsList>

        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Mood Trends</CardTitle>
                <CardDescription>Your mood and stress levels over time</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {processedMoodData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={processedMoodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="mood" stroke="#8b5cf6" name="Mood" />
                      <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Stress" />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No mood data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Journal Sentiment</CardTitle>
                <CardDescription>Emotional tone of your journal entries</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {sentimentDistribution.some((item) => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={sentimentDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        {sentimentDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No journal data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Insights</CardTitle>
              <CardDescription>Personalized observations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <Card key={index} className="bg-muted/50">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-md">{insight.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm">{insight.description}</p>
                      </CardContent>
                    </Card>
                  ))
                ) : (
                  <div className="col-span-3 py-6 text-center">
                    <p className="text-muted-foreground">
                      Continue tracking your mood and journaling to receive personalized insights.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Mood Tracking Tab */}
        <TabsContent value="mood" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Mood Distribution</CardTitle>
                <CardDescription>Frequency of different mood levels</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {moodDistribution.some((item) => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart data={moodDistribution}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#8b5cf6" name="Frequency" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No mood data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Stress Levels Over Time</CardTitle>
                <CardDescription>Track your stress patterns</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {processedMoodData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsLineChart data={processedMoodData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="date" />
                      <YAxis domain={[1, 5]} />
                      <Tooltip />
                      <Line type="monotone" dataKey="stress" stroke="#ef4444" name="Stress" strokeWidth={2} />
                    </RechartsLineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No stress data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Mood Calendar</CardTitle>
              <CardDescription>View your mood patterns by date</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex justify-center">
                <Calendar className="h-64 w-64 text-primary" />
                <p className="text-center text-muted-foreground mt-4">Calendar view coming soon</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Journal Analysis Tab */}
        <TabsContent value="journal" className="space-y-6 mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Sentiment Analysis</CardTitle>
                <CardDescription>Emotional tone of your journal entries</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {sentimentDistribution.some((item) => item.value > 0) ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsPieChart>
                      <Pie
                        data={sentimentDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      >
                        <Cell fill="#10b981" /> {/* Positive */}
                        <Cell fill="#f59e0b" /> {/* Neutral */}
                        <Cell fill="#ef4444" /> {/* Negative */}
                      </Pie>
                      <Tooltip />
                    </RechartsPieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No journal data available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium">Journal Frequency</CardTitle>
                <CardDescription>How often you write journal entries</CardDescription>
              </CardHeader>
              <CardContent className="h-[300px]">
                {journalData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <RechartsBarChart
                      data={[
                        { name: "Week 1", count: 3 },
                        { name: "Week 2", count: 5 },
                        { name: "Week 3", count: 2 },
                        { name: "Week 4", count: 4 },
                      ]}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8b5cf6" name="Entries" />
                    </RechartsBarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex justify-center items-center h-full">
                    <p className="text-muted-foreground">No journal data available</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Common Themes</CardTitle>
              <CardDescription>Frequently mentioned topics in your journal</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 justify-center">
                {journalData.length > 0 ? (
                  <>
                    <Badge className="text-lg py-2 px-4 bg-primary/10 hover:bg-primary/20">stress</Badge>
                    <Badge className="text-lg py-2 px-4 bg-primary/10 hover:bg-primary/20">school</Badge>
                    <Badge className="text-lg py-2 px-4 bg-primary/10 hover:bg-primary/20">sleep</Badge>
                    <Badge className="text-lg py-2 px-4 bg-primary/10 hover:bg-primary/20">friends</Badge>
                    <Badge className="text-lg py-2 px-4 bg-primary/10 hover:bg-primary/20">anxiety</Badge>
                    <Badge className="text-lg py-2 px-4 bg-primary/10 hover:bg-primary/20">exams</Badge>
                    <Badge className="text-lg py-2 px-4 bg-primary/10 hover:bg-primary/20">self-care</Badge>
                    <Badge className="text-lg py-2 px-4 bg-primary/10 hover:bg-primary/20">future</Badge>
                  </>
                ) : (
                  <p className="text-muted-foreground py-6">
                    Continue journaling to see common themes in your entries.
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* AI Insights Tab */}
        <TabsContent value="ai-insights" className="space-y-6 mt-6">
          <Card>
            <CardHeader>
              <CardTitle>AI-Generated Wellness Insights</CardTitle>
              <CardDescription>Personalized observations and recommendations based on your data</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {insights.length > 0 ? (
                  insights.map((insight, index) => (
                    <div key={index} className="p-4 border rounded-lg">
                      <h3 className="text-lg font-medium mb-2">{insight.title}</h3>
                      <p className="text-muted-foreground">{insight.description}</p>
                    </div>
                  ))
                ) : (
                  <div className="py-12 text-center">
                    <Brain className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium mb-2">Not Enough Data Yet</h3>
                    <p className="text-muted-foreground max-w-md mx-auto">
                      Continue tracking your mood and journaling regularly to receive personalized AI insights about
                      your mental wellbeing patterns.
                    </p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Mood Correlations</CardTitle>
                <CardDescription>Factors that may influence your mood</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span>Sleep Quality</span>
                    <div className="w-2/3 bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "85%" }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Exercise</span>
                    <div className="w-2/3 bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "65%" }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Social Interaction</span>
                    <div className="w-2/3 bg-muted rounded-full h-2.5">
                      <div className="bg-primary h-2.5 rounded-full" style={{ width: "70%" }}></div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span>Academic Stress</span>
                    <div className="w-2/3 bg-muted rounded-full h-2.5">
                      <div className="bg-destructive h-2.5 rounded-full" style={{ width: "80%" }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Recommended Actions</CardTitle>
                <CardDescription>Personalized suggestions for your wellbeing</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <span>Try the breathing exercise game to reduce stress levels</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <span>Consider journaling more regularly to track your emotions</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <span>Watch the recommended anxiety relief videos</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <div className="rounded-full bg-primary/10 p-1 mt-0.5">
                      <div className="h-2 w-2 rounded-full bg-primary"></div>
                    </div>
                    <span>Connect with the community for peer support</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
