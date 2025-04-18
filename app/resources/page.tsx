import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import ResourceCard from "@/components/resource-card"

// Sample resource data - in a real app, this would come from your database
const resources = {
  articles: [
    {
      id: "1",
      title: "Understanding Test Anxiety",
      description: "Learn about the causes of test anxiety and strategies to overcome it.",
      category: "anxiety",
      type: "article",
      readTime: "5 min read",
      author: "Dr. Sarah Johnson",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "2",
      title: "Mindfulness for College Students",
      description: "Simple mindfulness practices you can incorporate into your busy student life.",
      category: "mindfulness",
      type: "article",
      readTime: "8 min read",
      author: "Mark Williams, PhD",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "3",
      title: "Balancing Academics and Mental Health",
      description: "Tips for maintaining your wellbeing while managing academic pressures.",
      category: "stress",
      type: "article",
      readTime: "6 min read",
      author: "Emily Chen, MSW",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "4",
      title: "Recognizing Depression in College",
      description: "Signs, symptoms, and when to seek help for depression as a student.",
      category: "depression",
      type: "article",
      readTime: "7 min read",
      author: "Dr. Michael Rivera",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
  ],
  videos: [
    {
      id: "5",
      title: "5-Minute Anxiety Relief Breathing Exercise",
      description: "A quick breathing technique you can use anywhere to reduce anxiety.",
      category: "anxiety",
      type: "video",
      duration: "5:23",
      presenter: "Alex Taylor, Meditation Coach",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "6",
      title: "Understanding Your Stress Response",
      description: "Learn how your body responds to stress and how to manage it effectively.",
      category: "stress",
      type: "video",
      duration: "12:45",
      presenter: "Dr. Lisa Patel, Neuropsychologist",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "7",
      title: "Sleep Hygiene for Better Mental Health",
      description: "Practical tips for improving your sleep quality and mental wellbeing.",
      category: "sleep",
      type: "video",
      duration: "8:17",
      presenter: "Dr. James Wilson, Sleep Specialist",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
  ],
  exercises: [
    {
      id: "8",
      title: "Gratitude Journaling Practice",
      description: "A structured approach to developing a gratitude practice for improved wellbeing.",
      category: "mindfulness",
      type: "exercise",
      timeNeeded: "10 minutes daily",
      author: "Mindful Campus Team",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "9",
      title: "Progressive Muscle Relaxation",
      description: "A step-by-step guide to releasing physical tension and mental stress.",
      category: "anxiety",
      type: "exercise",
      timeNeeded: "15 minutes",
      author: "Dr. Rebecca Lee, Physical Therapist",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
    {
      id: "10",
      title: "Cognitive Restructuring Worksheet",
      description: "Learn to identify and challenge negative thought patterns.",
      category: "depression",
      type: "exercise",
      timeNeeded: "20 minutes",
      author: "Dr. Thomas Grant, Clinical Psychologist",
      imageUrl: "/placeholder.svg?height=200&width=300",
    },
  ],
}

export default function Resources() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Resource Center</h1>
        <p className="text-muted-foreground">Explore our curated resources to support your mental wellbeing.</p>
      </div>

      <div className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input type="search" placeholder="Search resources..." className="pl-8 w-full md:max-w-md" />
      </div>

      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All Resources</TabsTrigger>
          <TabsTrigger value="articles">Articles</TabsTrigger>
          <TabsTrigger value="videos">Videos</TabsTrigger>
          <TabsTrigger value="exercises">Exercises</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...resources.articles, ...resources.videos, ...resources.exercises].map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="articles" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.articles.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="videos" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.videos.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="exercises" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resources.exercises.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </TabsContent>
      </Tabs>

      <Card>
        <CardHeader>
          <CardTitle>Need More Support?</CardTitle>
          <CardDescription>
            If you're in crisis or need immediate support, please reach out to these resources.
          </CardDescription>
        </CardHeader>
        <CardContent className="grid gap-6 md:grid-cols-2">
          <div className="space-y-2">
            <h3 className="font-medium">Campus Resources</h3>
            <ul className="space-y-1 text-sm">
              <li>Student Counseling Center: (555) 123-4567</li>
              <li>24/7 Campus Crisis Line: (555) 987-6543</li>
              <li>Student Health Services: Building 8, Room 120</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h3 className="font-medium">National Resources</h3>
            <ul className="space-y-1 text-sm">
              <li>National Suicide Prevention Lifeline: 988</li>
              <li>Crisis Text Line: Text HOME to 741741</li>
              <li>SAMHSA Helpline: 1-800-662-HELP (4357)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
