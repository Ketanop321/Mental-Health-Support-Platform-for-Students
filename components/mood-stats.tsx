"use client"

// Sample data - in a real app, this would come from your database
const moodStats = {
  averageMood: 3.8,
  mostFrequentMood: "Happy",
  lowestDay: "Wednesday",
  highestDay: "Saturday",
  streakDays: 7,
}

export default function MoodStats() {
  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Average Mood" value={moodStats.averageMood.toFixed(1)} description="out of 5" />
        <StatCard title="Most Frequent" value={moodStats.mostFrequentMood} description="mood this month" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard title="Lowest Day" value={moodStats.lowestDay} description="on average" />
        <StatCard title="Highest Day" value={moodStats.highestDay} description="on average" />
      </div>

      <StatCard
        title="Current Streak"
        value={`${moodStats.streakDays} days`}
        description="of mood tracking"
        className="mt-4"
      />
    </div>
  )
}

function StatCard({
  title,
  value,
  description,
  className,
}: {
  title: string
  value: string
  description: string
  className?: string
}) {
  return (
    <div className={`p-4 border rounded-lg ${className}`}>
      <p className="text-sm font-medium text-muted-foreground">{title}</p>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  )
}
