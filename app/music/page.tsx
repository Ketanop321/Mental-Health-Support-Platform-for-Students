"use client"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Music,
  Headphones,
  Radio,
} from "lucide-react"
import Image from "next/image"

// Sample music data
const musicTracks = [
  {
    id: "1",
    title: "Calm Waters",
    artist: "Serenity Sounds",
    duration: 183,
    cover: "/placeholder.svg?height=300&width=300",
    category: "meditation",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "2",
    title: "Forest Whispers",
    artist: "Nature Melodies",
    duration: 247,
    cover: "/placeholder.svg?height=300&width=300",
    category: "meditation",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "3",
    title: "Ocean Waves",
    artist: "Coastal Sounds",
    duration: 195,
    cover: "/placeholder.svg?height=300&width=300",
    category: "meditation",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "4",
    title: "Study Focus",
    artist: "Concentration Beats",
    duration: 221,
    cover: "/placeholder.svg?height=300&width=300",
    category: "focus",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "5",
    title: "Deep Work",
    artist: "Productivity Sounds",
    duration: 264,
    cover: "/placeholder.svg?height=300&width=300",
    category: "focus",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "6",
    title: "Gentle Rain",
    artist: "Sleep Sounds",
    duration: 312,
    cover: "/placeholder.svg?height=300&width=300",
    category: "sleep",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "7",
    title: "Night Stars",
    artist: "Dream Melodies",
    duration: 278,
    cover: "/placeholder.svg?height=300&width=300",
    category: "sleep",
    audioSrc: "/placeholder.mp3",
  },
]

// Sample podcast data
const podcasts = [
  {
    id: "p1",
    title: "Mindfulness for Students",
    host: "Dr. Sarah Johnson",
    duration: 1845,
    cover: "/placeholder.svg?height=300&width=300",
    description: "Learn practical mindfulness techniques specifically designed for busy students.",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "p2",
    title: "Overcoming Academic Anxiety",
    host: "Professor Mark Williams",
    duration: 2130,
    cover: "/placeholder.svg?height=300&width=300",
    description: "Strategies to manage anxiety related to exams, presentations, and academic performance.",
    audioSrc: "/placeholder.mp3",
  },
  {
    id: "p3",
    title: "The Science of Sleep",
    host: "Dr. Emily Chen",
    duration: 1920,
    cover: "/placeholder.svg?height=300&width=300",
    description: "How quality sleep impacts mental health and academic performance, with practical tips.",
    audioSrc: "/placeholder.mp3",
  },
]

export default function MusicPage() {
  const [activeTab, setActiveTab] = useState("music")
  const [activeCategory, setActiveCategory] = useState("all")
  const [currentTrack, setCurrentTrack] = useState<any>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [volume, setVolume] = useState(0.7)
  const [isMuted, setIsMuted] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [isRepeat, setIsRepeat] = useState(false)
  const [isShuffle, setIsShuffle] = useState(false)

  const audioRef = useRef<HTMLAudioElement | null>(null)
  const intervalRef = useRef<NodeJS.Timeout | null>(null)

  // Filter tracks by category
  const filteredTracks =
    activeCategory === "all" ? musicTracks : musicTracks.filter((track) => track.category === activeCategory)

  // Initialize audio element
  useEffect(() => {
    audioRef.current = new Audio()

    audioRef.current.addEventListener("timeupdate", updateProgress)
    audioRef.current.addEventListener("loadedmetadata", () => {
      if (audioRef.current) {
        setDuration(audioRef.current.duration)
      }
    })
    audioRef.current.addEventListener("ended", handleTrackEnd)

    return () => {
      if (audioRef.current) {
        audioRef.current.pause()
        audioRef.current.removeEventListener("timeupdate", updateProgress)
        audioRef.current.removeEventListener("loadedmetadata", () => {})
        audioRef.current.removeEventListener("ended", handleTrackEnd)
      }

      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [])

  // Update audio source when track changes
  useEffect(() => {
    if (currentTrack && audioRef.current) {
      audioRef.current.src = currentTrack.audioSrc
      audioRef.current.load()

      if (isPlaying) {
        audioRef.current.play()
      }
    }
  }, [currentTrack])

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

  // Handle track end
  const handleTrackEnd = () => {
    if (isRepeat) {
      // Repeat current track
      if (audioRef.current) {
        audioRef.current.currentTime = 0
        audioRef.current.play()
      }
    } else {
      // Play next track
      playNextTrack()
    }
  }

  // Play/pause toggle
  const togglePlay = () => {
    if (!currentTrack) {
      // If no track is selected, play the first one
      const firstTrack = activeTab === "music" ? filteredTracks[0] : podcasts[0]
      setCurrentTrack(firstTrack)
      setIsPlaying(true)

      if (audioRef.current) {
        audioRef.current.src = firstTrack.audioSrc
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

  // Play specific track
  const playTrack = (track: any) => {
    setCurrentTrack(track)
    setIsPlaying(true)

    if (audioRef.current) {
      audioRef.current.src = track.audioSrc
      audioRef.current.load()
      audioRef.current.play()
    }
  }

  // Play previous track
  const playPreviousTrack = () => {
    if (!currentTrack) return

    const tracks = activeTab === "music" ? filteredTracks : podcasts
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id)

    if (currentIndex > 0) {
      playTrack(tracks[currentIndex - 1])
    } else {
      // Wrap around to the last track
      playTrack(tracks[tracks.length - 1])
    }
  }

  // Play next track
  const playNextTrack = () => {
    if (!currentTrack) return

    const tracks = activeTab === "music" ? filteredTracks : podcasts
    const currentIndex = tracks.findIndex((t) => t.id === currentTrack.id)

    if (isShuffle) {
      // Play random track
      const randomIndex = Math.floor(Math.random() * tracks.length)
      playTrack(tracks[randomIndex])
    } else if (currentIndex < tracks.length - 1) {
      playTrack(tracks[currentIndex + 1])
    } else {
      // Wrap around to the first track
      playTrack(tracks[0])
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

  // Format time (seconds to MM:SS)
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60)
    const seconds = Math.floor(time % 60)
    return `${minutes}:${seconds.toString().padStart(2, "0")}`
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Music & Podcasts</h1>
        <p className="text-muted-foreground">
          Discover calming music and insightful podcasts to support your mental wellbeing.
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="music" className="flex items-center gap-2">
            <Music className="h-4 w-4" />
            <span>Music</span>
          </TabsTrigger>
          <TabsTrigger value="podcasts" className="flex items-center gap-2">
            <Headphones className="h-4 w-4" />
            <span>Podcasts</span>
          </TabsTrigger>
          <TabsTrigger value="radio" className="flex items-center gap-2">
            <Radio className="h-4 w-4" />
            <span>Live Radio</span>
          </TabsTrigger>
        </TabsList>

        {/* Music Tab */}
        <TabsContent value="music" className="space-y-6">
          <div className="flex overflow-x-auto pb-2 gap-2">
            <Button
              variant={activeCategory === "all" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("all")}
            >
              All
            </Button>
            <Button
              variant={activeCategory === "meditation" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("meditation")}
            >
              Meditation
            </Button>
            <Button
              variant={activeCategory === "focus" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("focus")}
            >
              Focus
            </Button>
            <Button
              variant={activeCategory === "sleep" ? "default" : "outline"}
              size="sm"
              onClick={() => setActiveCategory("sleep")}
            >
              Sleep
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTracks.map((track) => (
              <Card
                key={track.id}
                className={`overflow-hidden transition-all hover:shadow-md ${
                  currentTrack?.id === track.id ? "border-primary" : ""
                }`}
              >
                <div className="relative aspect-square">
                  <Image src={track.cover || "/placeholder.svg"} alt={track.title} fill className="object-cover" />
                  <Button
                    variant="secondary"
                    size="icon"
                    className="absolute bottom-4 right-4 rounded-full w-12 h-12"
                    onClick={() => (currentTrack?.id === track.id ? togglePlay() : playTrack(track))}
                  >
                    {currentTrack?.id === track.id && isPlaying ? (
                      <Pause className="h-6 w-6" />
                    ) : (
                      <Play className="h-6 w-6" />
                    )}
                  </Button>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold">{track.title}</h3>
                  <p className="text-sm text-muted-foreground">{track.artist}</p>
                  <div className="flex justify-between items-center mt-2">
                    <Badge variant="outline" className="capitalize">
                      {track.category}
                    </Badge>
                    <span className="text-xs text-muted-foreground">{formatTime(track.duration)}</span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Podcasts Tab */}
        <TabsContent value="podcasts" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {podcasts.map((podcast) => (
              <Card
                key={podcast.id}
                className={`overflow-hidden transition-all hover:shadow-md ${
                  currentTrack?.id === podcast.id ? "border-primary" : ""
                }`}
              >
                <div className="flex flex-col md:flex-row">
                  <div className="relative w-full md:w-1/3 aspect-square md:aspect-auto">
                    <Image
                      src={podcast.cover || "/placeholder.svg"}
                      alt={podcast.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1 p-4">
                    <h3 className="font-semibold">{podcast.title}</h3>
                    <p className="text-sm text-muted-foreground mb-2">Hosted by {podcast.host}</p>
                    <p className="text-sm line-clamp-3 mb-4">{podcast.description}</p>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-muted-foreground">{formatTime(podcast.duration)}</span>
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1"
                        onClick={() => (currentTrack?.id === podcast.id ? togglePlay() : playTrack(podcast))}
                      >
                        {currentTrack?.id === podcast.id && isPlaying ? (
                          <>
                            <Pause className="h-4 w-4" />
                            Pause
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4" />
                            Play
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Live Radio Tab */}
        <TabsContent value="radio" className="space-y-6">
          <Card className="bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 border-none">
            <CardHeader>
              <CardTitle>Live Radio Stations</CardTitle>
              <CardDescription>
                Tune into live radio stations focused on mental wellbeing, meditation, and relaxing music.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center py-8">
                Coming soon! We're working on bringing live radio stations to the platform.
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Player */}
      {currentTrack && (
        <Card className="sticky bottom-0 border-t shadow-lg bg-background/80 backdrop-blur-md">
          <CardContent className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex items-center gap-4">
                <div className="relative h-16 w-16 flex-shrink-0 rounded-md overflow-hidden">
                  <Image
                    src={currentTrack.cover || "/placeholder.svg"}
                    alt={currentTrack.title}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-medium truncate">{currentTrack.title}</h3>
                  <p className="text-sm text-muted-foreground truncate">{currentTrack.artist || currentTrack.host}</p>
                </div>
              </div>

              <div className="flex-1 flex flex-col justify-center">
                <div className="flex items-center justify-center gap-4 mb-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsShuffle(!isShuffle)}
                    className={isShuffle ? "text-primary" : ""}
                  >
                    <Shuffle className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="icon" onClick={playPreviousTrack}>
                    <SkipBack className="h-5 w-5" />
                  </Button>
                  <Button variant="secondary" size="icon" className="rounded-full w-10 h-10" onClick={togglePlay}>
                    {isPlaying ? <Pause className="h-5 w-5" /> : <Play className="h-5 w-5" />}
                  </Button>
                  <Button variant="ghost" size="icon" onClick={playNextTrack}>
                    <SkipForward className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setIsRepeat(!isRepeat)}
                    className={isRepeat ? "text-primary" : ""}
                  >
                    <Repeat className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground w-10 text-right">{formatTime(currentTime)}</span>
                  <Slider
                    value={[currentTime]}
                    max={duration || currentTrack.duration}
                    step={1}
                    onValueChange={seekTo}
                    className="flex-1"
                  />
                  <span className="text-xs text-muted-foreground w-10">
                    {formatTime(duration || currentTrack.duration)}
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
