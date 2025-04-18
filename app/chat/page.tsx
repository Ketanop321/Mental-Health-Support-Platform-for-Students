"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Send, Info, Sparkles } from "lucide-react"
import { cn } from "@/lib/utils"

type Message = {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
}

// Sample responses for the rule-based chatbot
const botResponses = {
  greeting: [
    "Hello! I'm here to support you. How are you feeling today?",
    "Hi there! How can I help you with your mental wellbeing today?",
    "Welcome to the support chat. How are you doing right now?",
  ],
  anxiety: [
    "I'm sorry to hear you're feeling anxious. Would you like to try a quick breathing exercise?",
    "Anxiety can be challenging. Remember that your feelings are valid. Would a grounding technique help right now?",
    "When you're feeling anxious, it can help to focus on the present moment. Would you like some mindfulness tips?",
  ],
  depression: [
    "I'm here for you. Depression can make everything feel harder. Have you been able to talk to someone you trust about how you're feeling?",
    "I'm sorry you're going through this. Remember that seeking help is a sign of strength. Would you like some resources for depression support?",
    "Depression can be isolating, but you're not alone. Small steps can help. Would you like some self-care suggestions?",
  ],
  stress: [
    "College can definitely be stressful. Would you like to try a quick stress-relief technique?",
    "Academic pressure can build up. Remember to take breaks and be kind to yourself. Would you like some stress management tips?",
    "Stress is a normal response, but it's important to manage it. Have you tried any relaxation techniques recently?",
  ],
  sleep: [
    "Sleep is so important for mental health. Would you like some tips for better sleep hygiene?",
    "Trouble sleeping can affect everything else. Have you tried establishing a bedtime routine?",
    "Sleep difficulties are common among students. Would you like to learn about some techniques that might help?",
  ],
  gratitude: [
    "Practicing gratitude can be powerful. Can you think of three things you're grateful for today?",
    "Even on difficult days, finding small moments of gratitude can help shift perspective. Would you like to try a gratitude exercise?",
    "Gratitude practices have been shown to improve wellbeing. Would you like to learn more about incorporating gratitude into your routine?",
  ],
  resources: [
    "Our resource center has articles, videos, and tools that might help. Would you like me to point you to some specific resources?",
    "There are many resources available both on campus and online. What specific type of support are you looking for?",
    "Sometimes external resources can provide the support we need. Would you like information about campus counseling services?",
  ],
  breathing: [
    "Let's try a simple breathing exercise: Breathe in for 4 counts, hold for 2, and exhale for 6. Repeat this 5 times. Would you like to try?",
    "Box breathing can help calm your nervous system. Breathe in for 4, hold for 4, exhale for 4, hold for 4. Shall we practice together?",
    "Deep breathing activates your parasympathetic nervous system. Try breathing deeply into your belly rather than your chest. Would you like more breathing techniques?",
  ],
  unknown: [
    "I'm here to listen. Can you tell me more about what you're experiencing?",
    "Thank you for sharing. Would it help to talk more about what's on your mind?",
    "I appreciate you reaching out. How else can I support you today?",
  ],
}

// Function to get a random response from a category
const getRandomResponse = (category: keyof typeof botResponses) => {
  const responses = botResponses[category]
  return responses[Math.floor(Math.random() * responses.length)]
}

// Simple rule-based response generator
const generateResponse = (message: string): string => {
  const lowerMessage = message.toLowerCase()

  if (lowerMessage.includes("hello") || lowerMessage.includes("hi") || lowerMessage.match(/^hey/)) {
    return getRandomResponse("greeting")
  } else if (
    lowerMessage.includes("anxious") ||
    lowerMessage.includes("anxiety") ||
    lowerMessage.includes("nervous") ||
    lowerMessage.includes("worry")
  ) {
    return getRandomResponse("anxiety")
  } else if (
    lowerMessage.includes("depress") ||
    lowerMessage.includes("sad") ||
    lowerMessage.includes("hopeless") ||
    lowerMessage.includes("unmotivated")
  ) {
    return getRandomResponse("depression")
  } else if (
    lowerMessage.includes("stress") ||
    lowerMessage.includes("overwhelm") ||
    lowerMessage.includes("pressure") ||
    lowerMessage.includes("too much")
  ) {
    return getRandomResponse("stress")
  } else if (
    lowerMessage.includes("sleep") ||
    lowerMessage.includes("insomnia") ||
    lowerMessage.includes("tired") ||
    lowerMessage.includes("rest")
  ) {
    return getRandomResponse("sleep")
  } else if (
    lowerMessage.includes("grateful") ||
    lowerMessage.includes("gratitude") ||
    lowerMessage.includes("thankful") ||
    lowerMessage.includes("appreciate")
  ) {
    return getRandomResponse("gratitude")
  } else if (
    lowerMessage.includes("resource") ||
    lowerMessage.includes("help") ||
    lowerMessage.includes("support") ||
    lowerMessage.includes("where can i")
  ) {
    return getRandomResponse("resources")
  } else if (
    lowerMessage.includes("breath") ||
    lowerMessage.includes("calm") ||
    lowerMessage.includes("relax") ||
    lowerMessage.includes("meditation")
  ) {
    return getRandomResponse("breathing")
  } else {
    return getRandomResponse("unknown")
  }
}

export default function ChatSupport() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hi there! I'm your mental wellness assistant. How are you feeling today?",
      sender: "bot",
      timestamp: new Date(),
    },
  ])
  const [input, setInput] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const handleSendMessage = () => {
    if (!input.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input,
      sender: "user",
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")
    setIsTyping(true)

    // Simulate bot typing delay
    setTimeout(
      () => {
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: generateResponse(input),
          sender: "bot",
          timestamp: new Date(),
        }

        setMessages((prev) => [...prev, botMessage])
        setIsTyping(false)
      },
      1000 + Math.random() * 1000,
    ) // Random delay between 1-2 seconds
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <div className="max-w-3xl mx-auto py-8">
      <Card className="h-[calc(100vh-200px)] flex flex-col">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="AI Assistant" />
              <AvatarFallback>AI</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle>Mental Wellness Assistant</CardTitle>
              <CardDescription>I'm here to support your mental wellbeing</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message) => (
            <div key={message.id} className={cn("flex", message.sender === "user" ? "justify-end" : "justify-start")}>
              <div
                className={cn(
                  "max-w-[80%] rounded-lg p-4",
                  message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted",
                )}
              >
                <p>{message.content}</p>
                <p className="text-xs opacity-70 mt-1">
                  {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </p>
              </div>
            </div>
          ))}
          {isTyping && (
            <div className="flex justify-start">
              <div className="max-w-[80%] rounded-lg p-4 bg-muted">
                <div className="flex space-x-2">
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "0ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "150ms" }}
                  ></div>
                  <div
                    className="w-2 h-2 rounded-full bg-muted-foreground animate-bounce"
                    style={{ animationDelay: "300ms" }}
                  ></div>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </CardContent>
        <CardFooter className="border-t p-4">
          <div className="flex items-center w-full gap-2">
            <Button variant="outline" size="icon" className="shrink-0">
              <Info className="h-4 w-4" />
              <span className="sr-only">Help</span>
            </Button>
            <div className="relative flex-1">
              <Input
                placeholder="Type your message..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                className="pr-10"
              />
              <Sparkles className="absolute right-3 top-2.5 h-4 w-4 text-muted-foreground" />
            </div>
            <Button size="icon" onClick={handleSendMessage} disabled={!input.trim()} className="shrink-0">
              <Send className="h-4 w-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  )
}
