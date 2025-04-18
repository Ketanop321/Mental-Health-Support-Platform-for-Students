import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ExternalLink } from "lucide-react"
import Link from "next/link"

export default function VideoCard({ video }: { video: any }) {
  if (!video || !video.snippet) {
    return null
  }

  const { title, description, thumbnails, channelTitle, publishedAt } = video.snippet
  const videoId = video.id.videoId

  // Format the published date
  const formattedDate = new Date(publishedAt).toLocaleDateString()

  return (
    <Card className="overflow-hidden transition-all hover:shadow-md flex flex-col h-full">
      <div className="relative aspect-video w-full overflow-hidden">
        <img
          src={thumbnails.high?.url || thumbnails.medium?.url || thumbnails.default?.url}
          alt={title}
          className="w-full h-full object-cover transition-transform hover:scale-105"
        />
      </div>
      <CardContent className="p-4 flex-1 flex flex-col">
        <h3 className="font-semibold line-clamp-2 mb-2">{title}</h3>
        <p className="text-sm text-muted-foreground line-clamp-3 mb-3 flex-1">{description}</p>
        <div className="mt-auto">
          <p className="text-xs text-muted-foreground mb-3">
            {channelTitle} • {formattedDate}
          </p>
          <Button asChild className="w-full">
            <Link href={`https://www.youtube.com/watch?v=${videoId}`} target="_blank" rel="noopener noreferrer">
              Watch Video <ExternalLink className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}
