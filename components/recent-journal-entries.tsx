"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Edit2 } from "lucide-react"
import Link from "next/link"

// Sample data - in a real app, this would come from your database
const journalEntries = [
  {
    id: "1",
    date: "2023-04-15",
    title: "Midterm Stress",
    excerpt: "Today was really challenging with three exams back to back...",
    sentiment: "negative",
  },
  {
    id: "2",
    date: "2023-04-13",
    title: "Group Project Progress",
    excerpt: "Had a productive meeting with my project team today...",
    sentiment: "positive",
  },
  {
    id: "3",
    date: "2023-04-10",
    title: "Weekend Reflection",
    excerpt: "Spent some time outdoors which really helped clear my mind...",
    sentiment: "positive",
  },
]

export default function RecentJournalEntries() {
  const [entries] = useState(journalEntries)

  return (
    <div className="space-y-4">
      {entries.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">No journal entries yet.</p>
          <Button className="mt-4" asChild>
            <Link href="/journal/new">Write your first entry</Link>
          </Button>
        </div>
      ) : (
        entries.map((entry) => (
          <div key={entry.id} className="p-4 border rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium">{entry.title}</h3>
                <div className="flex items-center text-sm text-muted-foreground">
                  <CalendarIcon className="mr-1 h-3 w-3" />
                  {new Date(entry.date).toLocaleDateString()}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge
                  variant={entry.sentiment === "positive" ? "outline" : "destructive"}
                  className={
                    entry.sentiment === "positive"
                      ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100 hover:bg-green-100 dark:hover:bg-green-900"
                      : ""
                  }
                >
                  {entry.sentiment === "positive" ? "Positive" : "Negative"}
                </Badge>
                <Button variant="ghost" size="icon" asChild>
                  <Link href={`/journal/${entry.id}`}>
                    <Edit2 className="h-4 w-4" />
                    <span className="sr-only">Edit</span>
                  </Link>
                </Button>
              </div>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2">{entry.excerpt}</p>
          </div>
        ))
      )}
    </div>
  )
}
