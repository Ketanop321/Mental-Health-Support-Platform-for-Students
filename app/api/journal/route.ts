import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createJournalEntry, getJournalEntriesByUser } from "@/lib/db"
import { analyzeSentiment } from "@/lib/ai"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const entries = await getJournalEntriesByUser(userId)

    return NextResponse.json({ entries })
  } catch (error) {
    console.error("Error fetching journal entries:", error)
    return NextResponse.json({ error: "Failed to fetch journal entries" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { title, content, tags } = await req.json()

    if (!title || !content) {
      return NextResponse.json({ error: "Title and content are required" }, { status: 400 })
    }

    // Analyze sentiment using AI
    const sentimentResult = await analyzeSentiment(content)

    const journalData = {
      userId,
      title,
      content,
      tags: tags || [],
      sentiment: sentimentResult.sentiment,
      sentimentScore: sentimentResult.score,
      date: new Date(),
    }

    const entryId = await createJournalEntry(journalData)

    return NextResponse.json({
      success: true,
      entryId,
      sentiment: sentimentResult.sentiment,
    })
  } catch (error) {
    console.error("Error creating journal entry:", error)
    return NextResponse.json({ error: "Failed to create journal entry" }, { status: 500 })
  }
}
