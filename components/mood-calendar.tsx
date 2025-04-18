"use client"

import { useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"

// Sample data - in a real app, this would come from your database
const moodData = {
  "2023-04-01": 4,
  "2023-04-02": 3,
  "2023-04-03": 5,
  "2023-04-04": 2,
  "2023-04-05": 3,
  "2023-04-06": 4,
  "2023-04-07": 4,
  "2023-04-08": 5,
  "2023-04-09": 3,
  "2023-04-10": 2,
  "2023-04-11": 3,
  "2023-04-12": 4,
  "2023-04-13": 5,
  "2023-04-14": 4,
  "2023-04-15": 3,
}

export default function MoodCalendar() {
  const [date, setDate] = useState<Date | undefined>(new Date())

  // Function to get mood color based on mood value (1-5)
  const getMoodColor = (date: Date) => {
    const dateString = date.toISOString().split("T")[0]
    const mood = moodData[dateString]

    if (!mood) return ""

    if (mood === 5) return "bg-green-500/20 text-green-700 dark:text-green-300"
    if (mood === 4) return "bg-green-300/20 text-green-600 dark:text-green-400"
    if (mood === 3) return "bg-yellow-300/20 text-yellow-700 dark:text-yellow-300"
    if (mood === 2) return "bg-orange-300/20 text-orange-700 dark:text-orange-300"
    if (mood === 1) return "bg-red-300/20 text-red-700 dark:text-red-300"

    return ""
  }

  return (
    <div className="flex justify-center p-4">
      <Calendar
        mode="single"
        selected={date}
        onSelect={setDate}
        className="rounded-md border"
        modifiers={{
          booked: (date) => {
            const dateString = date.toISOString().split("T")[0]
            return dateString in moodData
          },
        }}
        modifiersClassNames={{
          booked: "font-bold",
        }}
        components={{
          DayContent: ({ date }) => {
            const dateString = date.toISOString().split("T")[0]
            const hasMood = dateString in moodData

            return (
              <div className="relative h-9 w-9 p-0 flex items-center justify-center">
                <div
                  className={cn("h-7 w-7 rounded-full flex items-center justify-center", hasMood && getMoodColor(date))}
                >
                  {date.getDate()}
                </div>
              </div>
            )
          },
        }}
      />
    </div>
  )
}
