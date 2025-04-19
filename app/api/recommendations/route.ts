import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getMoodEntriesByUser, getJournalEntriesByUser, getUserById } from "@/lib/db"
import { generateRecommendations } from "@/lib/ai"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Get user data needed for recommendations
    const recentMoods = await getMoodEntriesByUser(userId, 10)
    const recentJournals = await getJournalEntriesByUser(userId, 5)
    const user = await getUserById(userId)

    // Generate personalized recommendations
    const recommendations = await generateRecommendations({
      recentMoods,
      recentJournals,
      preferences: user?.preferences || {},
    })

    return NextResponse.json({ recommendations })
  } catch (error) {
    console.error("Error generating recommendations:", error)
    return NextResponse.json({ error: "Failed to generate recommendations" }, { status: 500 })
  }
}
