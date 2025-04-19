import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { analyzeSentiment } from "@/lib/ai"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { content } = await req.json()

    if (!content) {
      return NextResponse.json({ error: "Content is required" }, { status: 400 })
    }

    // Analyze sentiment using AI
    const sentimentResult = await analyzeSentiment(content)

    return NextResponse.json({
      sentiment: sentimentResult.sentiment,
      score: sentimentResult.score,
    })
  } catch (error) {
    console.error("Error analyzing sentiment:", error)
    return NextResponse.json({ error: "Failed to analyze sentiment" }, { status: 500 })
  }
}
