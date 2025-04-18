"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { X } from "lucide-react"

export default function NewJournalEntry() {
  const [title, setTitle] = useState("")
  const [content, setContent] = useState("")
  const [tag, setTag] = useState("")
  const [tags, setTags] = useState<string[]>([])
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [sentiment, setSentiment] = useState<string | null>(null)
  const { toast } = useToast()
  const router = useRouter()

  const handleAddTag = () => {
    if (tag.trim() && !tags.includes(tag.trim().toLowerCase())) {
      setTags([...tags, tag.trim().toLowerCase()])
      setTag("")
    }
  }

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((t) => t !== tagToRemove))
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault()
      handleAddTag()
    }
  }

  const analyzeSentiment = () => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please write some content before analyzing sentiment.",
        variant: "destructive",
      })
      return
    }

    setIsAnalyzing(true)

    // In a real app, you would call an API for sentiment analysis
    // This is a mock implementation
    setTimeout(() => {
      // Simple mock sentiment analysis based on positive and negative words
      const positiveWords = ["happy", "good", "great", "excellent", "excited", "love", "enjoy", "positive", "success"]
      const negativeWords = ["sad", "excellent", "excited", "love", "enjoy", "positive", "success"]
      const negativeWordsList = [
        "sad",
        "bad",
        "terrible",
        "awful",
        "disappointed",
        "hate",
        "stress",
        "anxiety",
        "negative",
        "failure",
      ]

      const contentLower = content.toLowerCase()
      let positiveCount = 0
      let negativeCount = 0

      positiveWords.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "g")
        const matches = contentLower.match(regex)
        if (matches) positiveCount += matches.length
      })

      negativeWordsList.forEach((word) => {
        const regex = new RegExp(`\\b${word}\\b`, "g")
        const matches = contentLower.match(regex)
        if (matches) negativeCount += matches.length
      })

      const result = positiveCount > negativeCount ? "positive" : negativeCount > positiveCount ? "negative" : "neutral"

      setSentiment(result)
      setIsAnalyzing(false)

      toast({
        title: "Sentiment Analysis Complete",
        description: `Your entry appears to have a ${result} sentiment.`,
      })
    }, 1500)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!title.trim() || !content.trim()) {
      toast({
        title: "Error",
        description: "Please fill in both title and content fields.",
        variant: "destructive",
      })
      return
    }

    // In a real app, you would save this to your database
    console.log({
      title,
      content,
      tags,
      sentiment,
      date: new Date().toISOString(),
    })

    toast({
      title: "Journal entry saved",
      description: "Your journal entry has been saved successfully.",
    })

    router.push("/journal")
  }

  return (
    <div className="max-w-2xl mx-auto py-8">
      <Card>
        <CardHeader>
          <CardTitle>New Journal Entry</CardTitle>
          <CardDescription>Express your thoughts and feelings. Your entries are private and secure.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input
                id="title"
                placeholder="Give your entry a title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                What's on your mind?
              </label>
              <Textarea
                id="content"
                placeholder="Write your thoughts here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="min-h-[200px] journal-paper"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="tags" className="text-sm font-medium">
                Tags (optional)
              </label>
              <div className="flex gap-2">
                <Input
                  id="tags"
                  placeholder="Add tags (press Enter)"
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                  onKeyDown={handleKeyDown}
                />
                <Button type="button" onClick={handleAddTag} variant="outline">
                  Add
                </Button>
              </div>
              {tags.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {tags.map((t) => (
                    <Badge key={t} variant="secondary" className="flex items-center gap-1">
                      {t}
                      <button
                        type="button"
                        onClick={() => handleRemoveTag(t)}
                        className="rounded-full hover:bg-muted p-0.5"
                      >
                        <X className="h-3 w-3" />
                        <span className="sr-only">Remove {t} tag</span>
                      </button>
                    </Badge>
                  ))}
                </div>
              )}
            </div>

            {sentiment && (
              <div className="p-4 rounded-md bg-muted">
                <p className="text-sm font-medium">Sentiment Analysis</p>
                <p className="text-sm">
                  Your entry appears to have a{" "}
                  <span
                    className={
                      sentiment === "positive"
                        ? "text-green-600 dark:text-green-400 font-medium"
                        : sentiment === "negative"
                          ? "text-red-600 dark:text-red-400 font-medium"
                          : "text-amber-600 dark:text-amber-400 font-medium"
                    }
                  >
                    {sentiment}
                  </span>{" "}
                  tone.
                </p>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex flex-col sm:flex-row gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={analyzeSentiment}
              disabled={isAnalyzing || !content.trim()}
              className="w-full sm:w-auto"
            >
              {isAnalyzing ? "Analyzing..." : "Analyze Sentiment"}
            </Button>
            <Button type="submit" className="w-full sm:w-auto">
              Save Journal Entry
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}
