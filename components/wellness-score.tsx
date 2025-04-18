"use client"

import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

export default function WellnessScore({ score }: { score: number }) {
  // Determine color based on score
  const getScoreColor = () => {
    if (score >= 80) return "text-green-500 dark:text-green-400"
    if (score >= 60) return "text-amber-500 dark:text-amber-400"
    return "text-red-500 dark:text-red-400"
  }

  // Determine progress color based on score
  const getProgressColor = () => {
    if (score >= 80) return "bg-green-500 dark:bg-green-400"
    if (score >= 60) return "bg-amber-500 dark:bg-amber-400"
    return "bg-red-500 dark:bg-red-400"
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-baseline">
        <span className="text-sm font-medium text-muted-foreground">Overall Wellness</span>
        <span className={cn("text-4xl font-bold", getScoreColor())}>{score}</span>
      </div>

      <Progress value={score} className="h-2" indicatorClassName={getProgressColor()} />

      <div className="text-sm text-muted-foreground">
        {score >= 80 ? (
          <p>You're doing great! Keep up the good work.</p>
        ) : score >= 60 ? (
          <p>You're doing okay, but there's room for improvement.</p>
        ) : (
          <p>Your wellness score is low. Consider checking our resources for support.</p>
        )}
      </div>
    </div>
  )
}
