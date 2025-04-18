"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Edit2, Trash2 } from "lucide-react"
import Link from "next/link"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

// Sample data - in a real app, this would come from your database
const journalEntriesData = [
  {
    id: "1",
    date: "2023-04-15",
    title: "Midterm Stress",
    excerpt:
      "Today was really challenging with three exams back to back. I felt overwhelmed during my calculus exam, but I think I managed to answer most questions correctly. I need to work on my test anxiety and time management.",
    sentiment: "negative",
    tags: ["school", "stress", "exams"],
  },
  {
    id: "2",
    date: "2023-04-13",
    title: "Group Project Progress",
    excerpt:
      "Had a productive meeting with my project team today. We finally agreed on the project scope and divided tasks. I'm excited about the research part I'll be handling. It feels good to make progress after weeks of uncertainty.",
    sentiment: "positive",
    tags: ["school", "teamwork", "progress"],
  },
  {
    id: "3",
    date: "2023-04-10",
    title: "Weekend Reflection",
    excerpt:
      "Spent some time outdoors which really helped clear my mind. The hiking trail was beautiful and I met some interesting people along the way. I should make outdoor activities a regular part of my routine to manage stress better.",
    sentiment: "positive",
    tags: ["self-care", "outdoors", "weekend"],
  },
  {
    id: "4",
    date: "2023-04-07",
    title: "Roommate Conflict",
    excerpt:
      "Had another argument with my roommate about cleaning responsibilities. I'm frustrated that we keep having the same conversation. Need to find a better way to communicate or consider other living arrangements for next semester.",
    sentiment: "negative",
    tags: ["conflict", "housing", "stress"],
  },
  {
    id: "5",
    date: "2023-04-05",
    title: "Career Fair Success",
    excerpt:
      "Attended the campus career fair and made some great connections. Two companies seemed interested in my resume and asked me to apply for their summer internships. Feeling hopeful about job prospects after graduation.",
    sentiment: "positive",
    tags: ["career", "networking", "future"],
  },
]

export default function JournalEntryList() {
  const [entries, setEntries] = useState(journalEntriesData)
  const [entryToDelete, setEntryToDelete] = useState<string | null>(null)

  const handleDelete = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id))
    setEntryToDelete(null)
  }

  return (
    <div className="space-y-6">
      {entries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground">No journal entries yet.</p>
          <Button className="mt-4" asChild>
            <Link href="/journal/new">Write your first entry</Link>
          </Button>
        </div>
      ) : (
        entries.map((entry) => (
          <div key={entry.id} className="p-6 border rounded-lg hover:border-primary/50 transition-colors">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-xl font-medium">{entry.title}</h3>
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
                <AlertDialog open={entryToDelete === entry.id} onOpenChange={(open) => !open && setEntryToDelete(null)}>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="icon" onClick={() => setEntryToDelete(entry.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This will permanently delete this journal entry. This action cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction onClick={() => handleDelete(entry.id)}>Delete</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
            <p className="text-muted-foreground mb-3">{entry.excerpt}</p>
            <div className="flex flex-wrap gap-2">
              {entry.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        ))
      )}
    </div>
  )
}
