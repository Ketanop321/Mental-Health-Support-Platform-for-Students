"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Slider } from "@/components/ui/slider"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Loader2 } from "lucide-react"

export default function AddMood() {
  const [moodValue, setMoodValue] = useState(3)
  const [stressValue, setStressValue] = useState(3)
  const [notes, setNotes] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const getMoodEmoji = (value: number) => {
    switch (value) {
      case 1:
        return "😢"
      case 2:
        return "😕"
      case 3:
        return "😐"
      case 4:
        return "🙂"
      case 5:
        return "😄"
      default:
        return "😐"
    }
  }

  const getStressEmoji = (value: number) => {
    switch (value) {
      case 1:
        return "😌"
      case 2:
        return "🙂"
      case 3:
        return "😐"
      case 4:
        return "😟"
      case 5:
        return "😫"
      default:
        return "😐"
    }
  }

  const getMoodLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Very Sad"
      case 2:
        return "Sad"
      case 3:
        return "Neutral"
      case 4:
        return "Happy"
      case 5:
        return "Very Happy"
      default:
        return "Neutral"
    }
  }

  const getStressLabel = (value: number) => {
    switch (value) {
      case 1:
        return "Very Relaxed"
      case 2:
        return "Relaxed"
      case 3:
        return "Neutral"
      case 4:
        return "Stressed"
      case 5:
        return "Very Stressed"
      default:
        return "Neutral"
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/mood", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: moodValue,
          stress: stressValue,
          notes,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to save mood entry")
      }

      toast({
        title: "Mood logged successfully",
        description: "Your mood has been recorded for today.",
      })

      router.push("/mood-tracker")
    } catch (error) {
      console.error("Error saving mood entry:", error)
      toast({
        title: "Error",
        description: "Failed to save mood entry. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-md mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>Log Today's Mood</CardTitle>
          <CardDescription>How are you feeling today? Track your mood and stress levels.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-8">
            <div className="space-y-4">
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Mood</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getMoodEmoji(moodValue)}</span>
                    <span className="text-sm font-medium">{getMoodLabel(moodValue)}</span>
                  </div>
                </div>
                <Slider
                  value={[moodValue]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => setMoodValue(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Sad</span>
                  <span>Very Happy</span>
                </div>
              </div>

              <div className="space-y-2 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">Stress Level</span>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{getStressEmoji(stressValue)}</span>
                    <span className="text-sm font-medium">{getStressLabel(stressValue)}</span>
                  </div>
                </div>
                <Slider
                  value={[stressValue]}
                  min={1}
                  max={5}
                  step={1}
                  onValueChange={(value) => setStressValue(value[0])}
                />
                <div className="flex justify-between text-xs text-muted-foreground">
                  <span>Very Relaxed</span>
                  <span>Very Stressed</span>
                </div>
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="notes" className="text-sm font-medium">
                Notes (Optional)
              </label>
              <Textarea
                id="notes"
                placeholder="What's on your mind today? Any specific events that affected your mood?"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Saving...
                </>
              ) : (
                "Save Mood Entry"
              )}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
