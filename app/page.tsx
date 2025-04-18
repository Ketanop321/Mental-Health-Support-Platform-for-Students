import type React from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import {
  ArrowRight,
  Brain,
  BookOpen,
  MessageCircle,
  BarChart3,
  Sparkles,
  Video,
  Gamepad2,
  Music,
  Users,
} from "lucide-react"
import Image from "next/image"

export default function Home() {
  return (
    <div className="space-y-12 pb-8">
      {/* Hero Section */}
      <section className="py-12 md:py-24 lg:py-32 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 space-y-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
            Your Mental Health <span className="text-primary">Matters</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-[600px]">
            A safe space for students to track, understand, and improve their mental wellbeing with personalized
            support.
          </p>
          <div className="flex flex-wrap gap-4 pt-4">
            <Button asChild size="lg">
              <Link href="/dashboard">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              <Link href="/resources">Explore Resources</Link>
            </Button>
          </div>
        </div>
        <div className="flex-1 relative h-[300px] md:h-[400px] w-full rounded-lg overflow-hidden">
          <Image
            src="/placeholder.svg?height=400&width=600"
            alt="Students supporting each other"
            fill
            className="object-cover"
            priority
          />
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">How We Support You</h2>
          <p className="text-muted-foreground max-w-[800px] mx-auto">
            Our platform offers multiple tools to help you understand and improve your mental wellbeing.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<BarChart3 className="h-10 w-10 text-primary" />}
            title="Mood Tracker"
            description="Track your daily mood and visualize patterns over time to better understand your emotional health."
            href="/mood-tracker"
          />
          <FeatureCard
            icon={<BookOpen className="h-10 w-10 text-primary" />}
            title="Mental Health Journal"
            description="Express your thoughts in a private journal with AI-powered sentiment analysis and supportive feedback."
            href="/journal"
          />
          <FeatureCard
            icon={<Video className="h-10 w-10 text-primary" />}
            title="Wellness Videos"
            description="Watch expert-curated videos on anxiety relief, depression management, and mindfulness techniques."
            href="/videos"
          />
          <FeatureCard
            icon={<Gamepad2 className="h-10 w-10 text-primary" />}
            title="Relaxation Games"
            description="Engage with interactive games designed to reduce stress, improve focus, and promote mindfulness."
            href="/games"
          />
          <FeatureCard
            icon={<Music className="h-10 w-10 text-primary" />}
            title="Calming Music"
            description="Listen to soothing music and podcasts specially curated to support your mental wellbeing."
            href="/music"
          />
          <FeatureCard
            icon={<MessageCircle className="h-10 w-10 text-primary" />}
            title="AI Support Chatbot"
            description="Chat with our AI assistant for immediate support, breathing exercises, and helpful resources."
            href="/chat"
          />
          <FeatureCard
            icon={<Users className="h-10 w-10 text-primary" />}
            title="Community Support"
            description="Connect with peers in a safe, moderated space to share experiences and support each other."
            href="/community"
          />
          <FeatureCard
            icon={<Brain className="h-10 w-10 text-primary" />}
            title="Resource Center"
            description="Access curated articles, videos, and tools for anxiety, stress, depression, and more."
            href="/resources"
          />
          <FeatureCard
            icon={<Sparkles className="h-10 w-10 text-primary" />}
            title="Personalized Recommendations"
            description="Receive tailored wellness suggestions based on your mood patterns and journal entries."
            href="/recommendations"
          />
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-12 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-950/30 dark:to-blue-950/30 rounded-xl p-8">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-4">Student Experiences</h2>
          <p className="text-muted-foreground max-w-[800px] mx-auto">
            Hear from students who have found support through our platform.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <TestimonialCard
            quote="The mood tracker helped me identify patterns in my anxiety that I never noticed before. Now I can take proactive steps when I see the warning signs."
            name="Alex, 20"
            program="Computer Science"
          />
          <TestimonialCard
            quote="Journaling with the sentiment analysis has been eye-opening. Sometimes I don't realize how negative my thoughts have become until I see it reflected back to me."
            name="Jamie, 22"
            program="Psychology"
          />
          <TestimonialCard
            quote="The relaxation games and breathing exercises have become part of my daily routine. They help me stay centered during stressful periods."
            name="Taylor, 19"
            program="Business Administration"
          />
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 text-center">
        <h2 className="text-3xl font-bold mb-4">Ready to Start Your Wellness Journey?</h2>
        <p className="text-muted-foreground max-w-[600px] mx-auto mb-8">
          Join thousands of students who are prioritizing their mental health and academic success.
        </p>
        <Button asChild size="lg">
          <Link href="/dashboard">
            Get Started Today <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  )
}

function FeatureCard({
  icon,
  title,
  description,
  href,
}: {
  icon: React.ReactNode
  title: string
  description: string
  href: string
}) {
  return (
    <Card className="transition-all hover:shadow-md hover:border-primary/50">
      <CardHeader>
        <div className="mb-2">{icon}</div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardFooter>
        <Button variant="ghost" asChild className="gap-1">
          <Link href={href}>
            Learn more <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

function TestimonialCard({
  quote,
  name,
  program,
}: {
  quote: string
  name: string
  program: string
}) {
  return (
    <Card>
      <CardContent className="pt-6">
        <div className="mb-4">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="text-primary opacity-50"
          >
            <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
            <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
          </svg>
        </div>
        <p className="mb-4 italic">{quote}</p>
        <div className="text-sm text-muted-foreground">
          <p className="font-semibold">{name}</p>
          <p>{program}</p>
        </div>
      </CardContent>
    </Card>
  )
}
