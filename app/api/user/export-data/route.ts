import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { getUserById, getMoodEntriesByUser, getJournalEntriesByUser, getFavoritesByUser } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id

    // Fetch all user data
    const user = await getUserById(userId)
    const moodEntries = await getMoodEntriesByUser(userId, 1000) // Get up to 1000 entries
    const journalEntries = await getJournalEntriesByUser(userId, 1000)
    const favorites = await getFavoritesByUser(userId, "all")

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    // Compile user data for export
    const userData = {
      profile: {
        name: user.name,
        email: user.email,
        bio: user.bio || "",
        createdAt: user.createdAt,
        preferences: user.preferences || {},
      },
      moodEntries,
      journalEntries,
      favorites,
      exportDate: new Date(),
    }

    return NextResponse.json(userData)
  } catch (error) {
    console.error("Error exporting user data:", error)
    return NextResponse.json({ error: "Failed to export user data" }, { status: 500 })
  }
}
