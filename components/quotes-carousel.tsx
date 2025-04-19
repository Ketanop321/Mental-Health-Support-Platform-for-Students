"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"

// Collection of mental health and wellness quotes
const quotes = [
  {
    text: "Self-care is not self-indulgence, it is self-preservation.",
    author: "Audre Lorde",
  },
  {
    text: "You don't have to control your thoughts. You just have to stop letting them control you.",
    author: "Dan Millman",
  },
  {
    text: "Mental health problems don't define who you are. They are something you experience.",
    author: "Roy Chisholm",
  },
  {
    text: "There is hope, even when your brain tells you there isn't.",
    author: "John Green",
  },
  {
    text: "You are not your illness. You have an individual story to tell. You have a name, a history, a personality.",
    author: "Julian Seifter",
  },
  {
    text: "Recovery is not one and done. It is a lifelong journey that takes place one day, one step at a time.",
    author: "Unknown",
  },
  {
    text: "The strongest people are those who win battles we know nothing about.",
    author: "Unknown",
  },
  {
    text: "Your mental health is a priority. Your happiness is essential. Your self-care is a necessity.",
    author: "Unknown",
  },
  {
    text: "You don't have to be positive all the time. It's perfectly okay to feel sad, angry, annoyed, frustrated, scared, or anxious.",
    author: "Lori Deschene",
  },
  {
    text: "Just because no one else can heal or do your inner work for you doesn't mean you can, should, or need to do it alone.",
    author: "Lisa Olivera",
  },
]

export default function QuotesCarousel() {
  const [currentQuoteIndex, setCurrentQuoteIndex] = useState(0)
  const [isAutoplay, setIsAutoplay] = useState(true)

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null

    if (isAutoplay) {
      interval = setInterval(() => {
        setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length)
      }, 8000) // Change quote every 8 seconds
    }

    return () => {
      if (interval) clearInterval(interval)
    }
  }, [isAutoplay])

  const nextQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex + 1) % quotes.length)
    setIsAutoplay(false) // Stop autoplay when manually navigating
  }

  const prevQuote = () => {
    setCurrentQuoteIndex((prevIndex) => (prevIndex - 1 + quotes.length) % quotes.length)
    setIsAutoplay(false) // Stop autoplay when manually navigating
  }

  return (
    <Card className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/30 dark:to-purple-950/30 border-none relative">
      <CardContent className="p-6 min-h-[150px] flex items-center justify-center">
        <Button
          variant="ghost"
          size="icon"
          className="absolute left-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
          onClick={prevQuote}
        >
          <ChevronLeft className="h-6 w-6" />
        </Button>

        <div className="text-center max-w-2xl mx-auto">
          <blockquote className="italic">
            "{quotes[currentQuoteIndex].text}"
            <footer className="text-sm mt-2 text-muted-foreground">— {quotes[currentQuoteIndex].author}</footer>
          </blockquote>
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="absolute right-2 top-1/2 -translate-y-1/2 opacity-70 hover:opacity-100"
          onClick={nextQuote}
        >
          <ChevronRight className="h-6 w-6" />
        </Button>
      </CardContent>
    </Card>
  )
}
