"use client"

import { useState, useEffect, useRef } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw } from "lucide-react"

type BreathingPattern = {
  name: string
  inhale: number
  hold1: number
  exhale: number
  hold2: number
  description: string
}

const breathingPatterns: BreathingPattern[] = [
  {
    name: "Box Breathing",
    inhale: 4,
    hold1: 4,
    exhale: 4,
    hold2: 4,
    description: "Equal counts for inhale, hold, exhale, and hold. Great for stress reduction and focus.",
  },
  {
    name: "4-7-8 Breathing",
    inhale: 4,
    hold1: 7,
    exhale: 8,
    hold2: 0,
    description: "Inhale for 4, hold for 7, exhale for 8. Helps with anxiety and sleep.",
  },
  {
    name: "Relaxing Breath",
    inhale: 5,
    hold1: 2,
    exhale: 7,
    hold2: 0,
    description: "Longer exhale than inhale promotes relaxation and calm.",
  },
  {
    name: "Energizing Breath",
    inhale: 6,
    hold1: 0,
    exhale: 4,
    hold2: 0,
    description: "Longer inhale than exhale helps increase energy and alertness.",
  },
]

export default function BreathingExercisePage() {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPhase, setCurrentPhase] = useState<"inhale" | "hold1" | "exhale" | "hold2">("inhale")
  const [progress, setProgress] = useState(0)
  const [selectedPattern, setSelectedPattern] = useState<BreathingPattern>(breathingPatterns[0])
  const [cycles, setCycles] = useState(0)
  const [totalTime, setTotalTime] = useState(0)
  const [speed, setSpeed] = useState(1)
  const animationRef = useRef<number | null>(null)
  const lastTimeRef = useRef<number | null>(null)

  const getCurrentPhaseDuration = () => {
    const durations = {
      inhale: selectedPattern.inhale,
      hold1: selectedPattern.hold1,
      exhale: selectedPattern.exhale,
      hold2: selectedPattern.hold2,
    }
    return durations[currentPhase] / speed
  }

  const getPhaseMessage = () => {
    switch (currentPhase) {
      case "inhale":
        return "Breathe In"
      case "hold1":
        return "Hold"
      case "exhale":
        return "Breathe Out"
      case "hold2":
        return "Hold"
      default:
        return ""
    }
  }

  const nextPhase = () => {
    if (currentPhase === "inhale") {
      if (selectedPattern.hold1 > 0) {
        setCurrentPhase("hold1")
      } else {
        setCurrentPhase("exhale")
      }
    } else if (currentPhase === "hold1") {
      setCurrentPhase("exhale")
    } else if (currentPhase === "exhale") {
      if (selectedPattern.hold2 > 0) {
        setCurrentPhase("hold2")
      } else {
        setCurrentPhase("inhale")
        setCycles((prev) => prev + 1)
      }
    } else if (currentPhase === "hold2") {
      setCurrentPhase("inhale")
      setCycles((prev) => prev + 1)
    }
    setProgress(0)
  }

  const animate = (timestamp: number) => {
    if (!lastTimeRef.current) {
      lastTimeRef.current = timestamp
    }

    const deltaTime = timestamp - lastTimeRef.current
    lastTimeRef.current = timestamp

    if (isPlaying) {
      setTotalTime((prev) => prev + deltaTime / 1000)

      const phaseDuration = getCurrentPhaseDuration() * 1000 // convert to ms
      setProgress((prev) => {
        const newProgress = prev + deltaTime / phaseDuration
        if (newProgress >= 1) {
          nextPhase()
          return 0
        }
        return newProgress
      })

      animationRef.current = requestAnimationFrame(animate)
    }
  }

  useEffect(() => {
    if (isPlaying) {
      lastTimeRef.current = null
      animationRef.current = requestAnimationFrame(animate)
    } else if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [isPlaying, currentPhase, selectedPattern, speed])

  const togglePlay = () => {
    setIsPlaying(!isPlaying)
  }

  const resetExercise = () => {
    setIsPlaying(false)
    setCurrentPhase("inhale")
    setProgress(0)
    setCycles(0)
    setTotalTime(0)
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Breathing Exercise</CardTitle>
          <CardDescription>Follow the animation to practice mindful breathing and reduce stress.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-64 h-64 flex items-center justify-center">
              <div
                className={`absolute w-full h-full rounded-full border-4 border-primary/20 transition-all duration-1000 ${
                  isPlaying ? "opacity-100" : "opacity-50"
                }`}
              ></div>
              <div
                className={`absolute rounded-full bg-primary/10 border-4 border-primary transition-all duration-500 flex items-center justify-center text-xl font-bold text-primary`}
                style={{
                  width: `${
                    currentPhase === "inhale"
                      ? 40 + progress * 60
                      : currentPhase === "exhale"
                        ? 100 - progress * 60
                        : currentPhase === "hold1" || currentPhase === "hold2"
                          ? 100
                          : 40
                  }%`,
                  height: `${
                    currentPhase === "inhale"
                      ? 40 + progress * 60
                      : currentPhase === "exhale"
                        ? 100 - progress * 60
                        : currentPhase === "hold1" || currentPhase === "hold2"
                          ? 100
                          : 40
                  }%`,
                }}
              >
                <span>{getPhaseMessage()}</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <p className="text-2xl font-semibold text-primary">{getPhaseMessage()}</p>
              <p className="text-sm text-muted-foreground mt-1">
                {currentPhase === "inhale" && `Inhale for ${selectedPattern.inhale} seconds`}
                {currentPhase === "hold1" && `Hold for ${selectedPattern.hold1} seconds`}
                {currentPhase === "exhale" && `Exhale for ${selectedPattern.exhale} seconds`}
                {currentPhase === "hold2" && `Hold for ${selectedPattern.hold2} seconds`}
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Breathing Pattern</label>
                <span className="text-sm text-muted-foreground">{selectedPattern.name}</span>
              </div>
              <Select
                value={selectedPattern.name}
                onValueChange={(value) => {
                  const pattern = breathingPatterns.find((p) => p.name === value)
                  if (pattern) {
                    setSelectedPattern(pattern)
                    resetExercise()
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a breathing pattern" />
                </SelectTrigger>
                <SelectContent>
                  {breathingPatterns.map((pattern) => (
                    <SelectItem key={pattern.name} value={pattern.name}>
                      {pattern.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <p className="text-xs text-muted-foreground">{selectedPattern.description}</p>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between">
                <label className="text-sm font-medium">Speed</label>
                <span className="text-sm text-muted-foreground">{speed}x</span>
              </div>
              <Slider value={[speed]} min={0.5} max={2} step={0.1} onValueChange={(value) => setSpeed(value[0])} />
            </div>

            <div className="grid grid-cols-2 gap-4 pt-2">
              <div className="bg-muted rounded-md p-3 text-center">
                <p className="text-sm text-muted-foreground">Cycles Completed</p>
                <p className="text-2xl font-bold">{cycles}</p>
              </div>
              <div className="bg-muted rounded-md p-3 text-center">
                <p className="text-sm text-muted-foreground">Total Time</p>
                <p className="text-2xl font-bold">{formatTime(totalTime)}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={resetExercise}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button onClick={togglePlay}>
            {isPlaying ? <Pause className="mr-2 h-4 w-4" /> : <Play className="mr-2 h-4 w-4" />}
            {isPlaying ? "Pause" : "Start"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}
