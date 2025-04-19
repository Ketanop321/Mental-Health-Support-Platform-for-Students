import { type NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth/next"
import { authOptions } from "@/lib/auth"
import { createMoodEntry, getMoodEntriesByUser } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const entries = await getMoodEntriesByUser(userId)

    return NextResponse.json({ entries })
  } catch (error) {
    console.error("Error fetching mood entries:", error)
    return NextResponse.json({ error: "Failed to fetch mood entries" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.user.id
    const { mood, stress, notes } = await req.json()

    if (typeof mood !== "number" || typeof stress !== "number") {
      return NextResponse.json({ error: "Mood and stress values are required" }, { status: 400 })
    }

    const moodData = {
      userId,
      mood,
      stress,
      notes: notes || "",
      date: new Date(),
    }

    const entryId = await createMoodEntry(moodData)

    return NextResponse.json({
      success: true,
      entryId,
    })
  } catch (error) {
    console.error("Error creating mood entry:", error)
    return NextResponse.json({ error: "Failed to create mood entry" }, { status: 500 })
  }
}
