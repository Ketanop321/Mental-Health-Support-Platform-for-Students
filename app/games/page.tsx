import type React from "react"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import Image from "next/image"
import { Brain, Wind, Palette, Gamepad2 } from "lucide-react"

export default function GamesPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Relaxation Games</h1>
        <p className="text-muted-foreground">
          Take a break with these mindful games designed to reduce stress and improve focus.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        <GameCard
          title="Breathing Exercise"
          description="Follow the animated circle to practice deep breathing and reduce anxiety."
          icon={<Wind className="h-8 w-8 text-blue-500" />}
          image="/placeholder.svg?height=200&width=400"
          href="/games/breathing"
          color="from-blue-50 to-cyan-50 dark:from-blue-950/30 dark:to-cyan-950/30"
        />

        <GameCard
          title="Color Therapy"
          description="Express yourself through colors and patterns to promote relaxation and mindfulness."
          icon={<Palette className="h-8 w-8 text-purple-500" />}
          image="/placeholder.svg?height=200&width=400"
          href="/games/color-therapy"
          color="from-purple-50 to-pink-50 dark:from-purple-950/30 dark:to-pink-950/30"
        />

        <GameCard
          title="Memory Match"
          description="Improve focus and concentration with this calming memory matching game."
          icon={<Brain className="h-8 w-8 text-green-500" />}
          image="/placeholder.svg?height=200&width=400"
          href="/games/memory"
          color="from-green-50 to-emerald-50 dark:from-green-950/30 dark:to-emerald-950/30"
        />

        <GameCard
          title="Zen Garden"
          description="Create your own digital zen garden to promote mindfulness and creativity."
          icon={<Gamepad2 className="h-8 w-8 text-amber-500" />}
          image="/placeholder.svg?height=200&width=400"
          href="/games/zen-garden"
          color="from-amber-50 to-yellow-50 dark:from-amber-950/30 dark:to-yellow-950/30"
        />
      </div>

      <Card className="bg-gradient-to-r from-indigo-50 to-purple-50 dark:from-indigo-950/30 dark:to-purple-950/30 border-none">
        <CardHeader>
          <CardTitle>Benefits of Mindful Gaming</CardTitle>
          <CardDescription>
            These games are designed with mental wellness principles to help you relax and refocus.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <h3 className="font-medium">Stress Reduction</h3>
              <p className="text-sm text-muted-foreground">
                Engaging in mindful activities can lower cortisol levels and promote a sense of calm.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Improved Focus</h3>
              <p className="text-sm text-muted-foreground">
                Simple, engaging games can help train your attention and improve concentration.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Emotional Regulation</h3>
              <p className="text-sm text-muted-foreground">
                Creative activities provide an outlet for processing emotions in a healthy way.
              </p>
            </div>
            <div className="space-y-2">
              <h3 className="font-medium">Mindfulness Practice</h3>
              <p className="text-sm text-muted-foreground">
                These games encourage present-moment awareness, a key component of mindfulness.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function GameCard({
  title,
  description,
  icon,
  image,
  href,
  color,
}: {
  title: string
  description: string
  icon: React.ReactNode
  image: string
  href: string
  color: string
}) {
  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image src={image || "/placeholder.svg"} alt={title} fill className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-4 text-white">
            <h3 className="font-bold text-xl">{title}</h3>
          </div>
        </div>
      </div>
      <div className={`bg-gradient-to-r ${color}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-4">
            <div className="mt-1">{icon}</div>
            <p className="text-sm">{description}</p>
          </div>
        </CardContent>
        <CardFooter className="px-4 pb-4 pt-0">
          <Button asChild className="w-full">
            <Link href={href}>Play Now</Link>
          </Button>
        </CardFooter>
      </div>
    </Card>
  )
}
