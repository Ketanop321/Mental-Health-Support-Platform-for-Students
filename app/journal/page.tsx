import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Plus, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import JournalEntryList from "@/components/journal-entry-list"

export default function Journal() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Journal</h1>
          <p className="text-muted-foreground">Express your thoughts and track your emotional journey.</p>
        </div>
        <Button asChild>
          <Link href="/journal/new">
            <Plus className="mr-2 h-4 w-4" /> New Entry
          </Link>
        </Button>
      </div>

      <div className="flex items-center space-x-2">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input type="search" placeholder="Search journal entries..." className="pl-8" />
        </div>
        <Button variant="outline">Filter</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Your Journal Entries</CardTitle>
          <CardDescription>Review and reflect on your past entries</CardDescription>
        </CardHeader>
        <CardContent>
          <JournalEntryList />
        </CardContent>
      </Card>
    </div>
  )
}
