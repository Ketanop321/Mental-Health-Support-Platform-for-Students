"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import VideoCard from "@/components/video-card"
import { fetchYouTubeVideos } from "@/lib/youtube"
import { Skeleton } from "@/components/ui/skeleton"

export default function VideosPage() {
  const [videos, setVideos] = useState<any>({
    anxiety: [],
    depression: [],
    mindfulness: [],
    sleep: [],
  })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [searching, setSearching] = useState(false)

  useEffect(() => {
    const loadVideos = async () => {
      setLoading(true)
      try {
        const anxietyVideos = await fetchYouTubeVideos("anxiety relief techniques for students")
        const depressionVideos = await fetchYouTubeVideos("overcoming depression for college students")
        const mindfulnessVideos = await fetchYouTubeVideos("mindfulness meditation for beginners")
        const sleepVideos = await fetchYouTubeVideos("sleep meditation for students")

        setVideos({
          anxiety: anxietyVideos,
          depression: depressionVideos,
          mindfulness: mindfulnessVideos,
          sleep: sleepVideos,
        })
      } catch (error) {
        console.error("Error fetching videos:", error)
      } finally {
        setLoading(false)
      }
    }

    loadVideos()
  }, [])

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!searchQuery.trim()) return

    setSearching(true)
    try {
      const results = await fetchYouTubeVideos(`${searchQuery} mental health`)
      setSearchResults(results)
    } catch (error) {
      console.error("Error searching videos:", error)
    } finally {
      setSearching(false)
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Mental Health Videos</h1>
        <p className="text-muted-foreground">
          Watch expert-curated videos to help with anxiety, depression, mindfulness, and sleep.
        </p>
      </div>

      <form onSubmit={handleSearch} className="relative">
        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search for mental health videos..."
          className="pl-8 w-full md:max-w-md"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </form>

      {searchQuery && searchResults.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Search Results</h2>
          {searching ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[1, 2, 3].map((i) => (
                <Card key={i}>
                  <Skeleton className="h-48 w-full rounded-t-lg" />
                  <CardContent className="p-4">
                    <Skeleton className="h-4 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-full mt-2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((video: any) => (
                <VideoCard key={video.id.videoId} video={video} />
              ))}
            </div>
          )}
        </div>
      )}

      <Tabs defaultValue="anxiety">
        <TabsList className="grid grid-cols-4 w-full md:w-auto">
          <TabsTrigger value="anxiety">Anxiety Relief</TabsTrigger>
          <TabsTrigger value="depression">Depression</TabsTrigger>
          <TabsTrigger value="mindfulness">Mindfulness</TabsTrigger>
          <TabsTrigger value="sleep">Sleep</TabsTrigger>
        </TabsList>

        {Object.keys(videos).map((category) => (
          <TabsContent key={category} value={category} className="mt-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {loading ? (
                // Skeleton loaders
                [1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i}>
                    <Skeleton className="h-48 w-full rounded-t-lg" />
                    <CardContent className="p-4">
                      <Skeleton className="h-4 w-3/4 mb-2" />
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-full mt-2" />
                    </CardContent>
                  </Card>
                ))
              ) : videos[category].length > 0 ? (
                videos[category].map((video: any) => <VideoCard key={video.id.videoId} video={video} />)
              ) : (
                <p>No videos found. Please try again later.</p>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-none">
        <CardHeader>
          <CardTitle>Video Recommendations</CardTitle>
          <CardDescription>
            Watching videos about mental health can provide valuable insights and techniques for managing your
            wellbeing.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm">
            <span className="font-medium">Anxiety Relief:</span> These videos offer practical techniques to manage
            anxiety, including breathing exercises, grounding methods, and cognitive strategies.
          </p>
          <p className="text-sm">
            <span className="font-medium">Depression Support:</span> Learn about coping mechanisms, understanding
            depression symptoms, and strategies that have helped others navigate through difficult times.
          </p>
          <p className="text-sm">
            <span className="font-medium">Mindfulness Practice:</span> Guided meditations and mindfulness exercises to
            help you stay present, reduce stress, and cultivate a peaceful mindset.
          </p>
          <p className="text-sm">
            <span className="font-medium">Sleep Improvement:</span> Techniques to improve sleep quality, including
            bedtime routines, sleep meditations, and relaxation methods for better rest.
          </p>
        </CardContent>
      </Card>
    </div>
  )
}
