"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Badge } from "@/components/ui/badge"
import { Play, Pause, SkipBack, SkipForward, Volume2, VolumeX, Clock, Heart } from "lucide-react"
import Image from "next/image"

// Sample meditation data
const meditations = [
  {
    id: "1",
    title: "5-Minute Breathing Meditation",
    description: "A quick meditation focusing on breath to reduce anxiety and stress.",
    duration: 300, // 5 minutes in seconds
    category: "anxiety",
    level: "beginner",
    coverImage: "/placeholder.svg?height=300&width=300",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "2",
    title: "Body Scan Relaxation",
    description: "A guided meditation to release tension throughout your body.",
    duration: 600, // 10 minutes in seconds
    category: "stress",
    level: "beginner",
    coverImage: "/placeholder.svg?height=300&width=300",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "3",
    title: "Loving-Kindness Meditation",
    description: "Develop compassion for yourself and others with this gentle practice.",
    duration: 900, // 15 minutes in seconds
    category: "wellbeing",
    level: "intermediate",
    coverImage: "/placeholder.svg?height=300&width=300",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "4",
    title: "Sleep Meditation",
    description: "Calm your mind and prepare for restful sleep with this soothing meditation.",
    duration: 1200, // 20 minutes in seconds
    category: "sleep",
    level: "beginner",
    coverImage: "/placeholder.svg?height=300&width=300",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "5",
    title: "Mindful Focus for Study",
    description: "Improve concentration and focus for academic work.",
    duration: 600, // 10 minutes in seconds
    category: "focus",
    level: "intermediate",
    coverImage: "/placeholder.svg?height=300&width=300",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "6",
    title: "Overcoming Negative Thoughts",
    description: "Learn to observe and release negative thought patterns.",
    duration: 900, // 15 minutes in seconds
    category: "depression",
    level: "intermediate",
    coverImage: "/placeholder.svg?height=300&width=300",
    audioSrc: "/placeholder.mp3",
  },
]

export default function MeditationPage() {
  const [activeCategory, setActiveCategory] = useState("all")
  const [currentMeditation, setCurrentMeditation] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [favorites, setFavorites] = useState<string[]>([])

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Filter meditations by category
  const filteredMeditations =
    activeCategory === "all" ? meditations : meditations.filter((m) => m.category === activeCategory)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()

    audioRef.current.addEventListener("timeupdate", updateProgress)
    audioRef.current.addEventListener("loadedmetadata", () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration)
      }
    })
    audioRef.current.addEventListener("ended", handleMeditationEnd)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("timeupdate", updateProgress)
        audioRef.current.removeEventListener("loadedmetadata", () => {})
        audioRef.current.removeEventListener("ended", handleMeditationEnd)
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Update audio source when meditation changes
  useEffect(() => {
    if (currentMeditation && audioRef.current) {
      audioRef.current.src = currentMeditation.audioSrc
      audioRef.current.load()

      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentMeditation])

  // Update volume when changed
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = isMuted ? 0 : volume
    }
  }, [volume, isMuted])

  // Update progress
  const updateProgress = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime)
    }
  }

  // Handle meditation end
  const handleMeditationEnd = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    if (audioRef.current) {
      audioRef.current.currentTime = 0
    }
  }

  // Play/pause toggle
  const togglePlay = () => {
    if (!currentMeditation) {
      // If no meditation is selected, play the first one
      const firstMeditation = filteredMeditations[0]
      setCurrentMeditation(firstMeditation)
      setIsPlaying(true)

      if (audioRef.current) {
        audioRef.current.src = firstMeditation.audioSrc
        audioRef.current.load()
        audioRef.current.play()
      }
    } else {
      setIsPlaying(!isPlaying)

      if (audioRef.current) {
        if (isPlaying) {
          audioRef.current.pause()
        } else {
          audioRef.current.play()
        }
      }
    }
  }

  // Play specific meditation
  const playMeditation = (meditation: any) => {
    setCurrentMeditation(meditation)
    setIsPlaying(true)

    if (audioRef.current) {
      audioRef.current.src = meditation.audioSrc
      audioRef.current.load()
      audioRef.current.play()
    }
  }

  // Seek to position
  const seekTo = (value: number[]) => {
    if (audioRef.current) {
      audioRef.current.currentTime = value[0]
      setCurrentTime(value[0])
    }
  }

  // Toggle mute
  const toggleMute = () => {
    setIsMuted(!isMuted)
  }

  // Toggle favorite
  const toggleFavorite = (id: string) => {
    if (favorites.includes(id)) {
      setFavorites(favorites.filter((favId) => favId !== id))
    } else {
      setFavorites([...favorites, id])
    }
  }

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Guided Meditation</h1>
        <p className="text-muted-foreground">
          Practice mindfulness with guided meditations for anxiety, stress, sleep, and more.
        </p>
      </div>

      <div className="flex overflow-x-auto pb-2 gap-2">
        <Button
          variant={activeCategory === "all" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("all")}
        >
          All
        </Button>
        <Button
          variant={activeCategory === "anxiety" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("anxiety")}
        >
          Anxiety
        </Button>
        <Button
          variant={activeCategory === "stress" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("stress")}
        >
          Stress
        </Button>
        <Button
          variant={activeCategory === "depression" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("depression")}
        >
          Depression
        </Button>
        <Button
          variant={activeCategory === "sleep" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("sleep")}
        >
          Sleep
        </Button>
        <Button
          variant={activeCategory === "focus" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("focus")}
        >
          Focus
        </Button>
        <Button
          variant={activeCategory === "wellbeing" ? "default" : "outline"}
          size="sm"
          onClick={() => setActiveCategory("wellbeing")}
        >
          Wellbeing
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMeditations.map((meditation) => (
          <Card
            key={meditation.id}
            className={`overflow-hidden transition-all hover:shadow-md ${
              currentMeditation?.id === meditation.id ? "border-primary" : ""
            }`}
          >
            <div className="relative aspect-square">
              <Image
                src={meditation.coverImage || "/placeholder.svg"}
                alt={meditation.title}
                fill
                className="object-cover"
              />
              <Button
                variant="secondary"
                size="icon"
                className="absolute bottom-4 right-4 rounded-full w-12 h-12"
                onClick={() => (currentMeditation?.id === meditation.id ? togglePlay() : playMeditation(meditation))}
              >
                {currentMeditation?.id === meditation.id && isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6" />
                )}
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 rounded-full bg-background/80 hover:bg-background/90"
                onClick={() => toggleFavorite(meditation.id)}
              >
                <Heart className={`h-5 w-5 ${favorites.includes(meditation.id) ? "fill-red-500 text-red-500" : ""}`} />
              </Button>
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold">{meditation.title}</h3>
              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">{meditation.description}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{formatTime(meditation.duration)}</span>
                </div>
                <div className="flex gap-2">
                  <Badge variant="outline" className="capitalize">
                    {meditation.category}
                  </Badge>
                  <Badge variant="secondary" className="capitalize">
                    {meditation.level}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Benefits of Meditation */}
      <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-none">
        <CardHeader>
          <CardTitle>Benefits of Meditation</CardTitle>
          <CardDescription>
            Regular meditation practice can provide numerous benefits for your mental and physical wellbeing.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <h3 className="font-medium">Reduced Stress & Anxiety</h3>
              <p className="text-sm text-muted-foreground">
                Meditation activates the body's relaxation response, lowering stress hormones and calming the nervous
                system.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Improved Focus</h3>
              <p className="text-sm text-muted-foreground">
                Regular meditation strengthens attention and concentration, helping you stay focused on tasks.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Better Sleep</h3>
              <p className="text-sm text-muted-foreground">
                Meditation can help quiet the mind and prepare the body for restful sleep, reducing insomnia.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Emotional Regulation</h3>
              <p className="text-sm text-muted-foreground">
                Learn to observe emotions without being overwhelmed by them, developing greater emotional resilience.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Enhanced Self-Awareness</h3>
              <p className="text-sm text-muted-foreground">
                Meditation helps you develop a deeper understanding of yourself and your thought patterns.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Improved Academic Performance</h3>
              <p className="text-sm text-muted-foreground">
                Studies show meditation can enhance memory, creativity, and cognitive function in students.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Player */}
      {currentMeditation && (
        <Card className="sticky bottom-0 border-t shadow-lg bg-background/80 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={currentMeditation.coverImage || "/placeholder.svg"}
                    alt={currentMeditation.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{currentMeditation.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{currentMeditation.category}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <Button variant="ghost" size="icon" onClick={() => {}}>
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full w-10 h-10" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={() => {}}>
                    <SkipForward className="h-5 w-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
                  <Slider
                    value={[currentTime]}
                    max={duration || currentMeditation.duration}
                    step={1}
                    onValueChange={seekTo}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-10">
                    {formatTime(duration || currentMeditation.duration)}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 w-32">
                <Button variant="ghost" size="icon" onClick={toggleMute}>
                  {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                </Button>
                <Slider
                  value={[volume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(value) => setVolume(value[0] / 100)}
                  className="flex-1"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
