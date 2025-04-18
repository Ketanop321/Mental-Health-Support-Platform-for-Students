export async function fetchYouTubeVideos(query: string, maxResults = 6) {
  const apiKey = process.env.NEXT_PUBLIC_VITE_YOUTUBE_API_KEY || process.env.VITE_YOUTUBE_API_KEY

  if (!apiKey) {
    console.error("YouTube API key is missing")
    return []
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=${maxResults}&q=${encodeURIComponent(
        query,
      )}&type=video&key=${apiKey}`,
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()
    return data.items || []
  } catch (error) {
    console.error("Error fetching YouTube videos:", error)
    return []
  }
}
