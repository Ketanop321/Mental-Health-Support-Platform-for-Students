import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, Video, FileText, Dumbbell } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

type Resource = {
  id: string
  title: string
  description: string
  category: string
  type: "article" | "video" | "exercise"
  imageUrl: string
  readTime?: string
  duration?: string
  timeNeeded?: string
  author?: string
  presenter?: string
}

export default function ResourceCard({ resource }: { resource: Resource }) {
  const getTypeIcon = () => {
    switch (resource.type) {
      case "article":
        return <FileText className="h-4 w-4" />
      case "video":
        return <Video className="h-4 w-4" />
      case "exercise":
        return <Dumbbell className="h-4 w-4" />
      default:
        return null
    }
  }

  const getTimeInfo = () => {
    if (resource.readTime) return resource.readTime
    if (resource.duration) return resource.duration
    if (resource.timeNeeded) return resource.timeNeeded
    return null
  }

  const getCreator = () => {
    if (resource.author) return resource.author
    if (resource.presenter) return resource.presenter
    return null
  }

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md">
      <div className="relative h-48 w-full">
        <Image src={resource.imageUrl || "/placeholder.svg"} alt={resource.title} fill className="object-cover" />
        <div className="absolute top-2 right-2">
          <Badge variant="secondary" className="capitalize">
            {resource.category}
          </Badge>
        </div>
      </div>
      <CardHeader className="p-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
          <Badge variant="outline" className="capitalize flex items-center gap-1">
            {getTypeIcon()}
            {resource.type}
          </Badge>
          {getTimeInfo() && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {getTimeInfo()}
            </span>
          )}
        </div>
        <CardTitle className="text-lg">{resource.title}</CardTitle>
        <CardDescription className="line-clamp-2">{resource.description}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        {getCreator() && <p className="text-sm text-muted-foreground">By: {getCreator()}</p>}
      </CardContent>
      <CardFooter className="p-4 pt-0">
        <Button asChild variant="ghost" className="w-full">
          <Link href={`/resources/${resource.id}`}>View Resource</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
