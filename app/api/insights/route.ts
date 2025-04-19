import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getMoodEntriesByUser } from "@/lib/db"
import { generateMoodInsights } from "@/lib/ai"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get user's mood data
    const moodData = await getMoodEntriesByUser(userId, 30) // Last 30 entries

    if (moodData.length < 5) {
      return NextResponse.json({
        insights: [
          {
            title: "Not Enough Data",
            description: "Continue logging your mood daily to receive personalized insights.",
          },
        ],
      })
    }

    // Generate insights based on mood data
    const insights = await generateMoodInsights(moodData)

    return NextResponse.json({ insights })
  } catch (error) {
    console.error("Error generating insights:", error)
    return NextResponse.json({ error: "Failed to generate insights" }, { status: 500 })
  }
}
