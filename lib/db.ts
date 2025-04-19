import clientPromise from "./mongodb"
import { ObjectId } from "mongodb"

// Database and collections
const DB_NAME = "mental_health_platform"
const COLLECTIONS = {
  users: "users",
  moodEntries: "mood_entries",
  journalEntries: "journal_entries",
  meditations: "meditations",
  favorites: "favorites",
}

// Get database connection
export async function getDb() {
  const client = await clientPromise
  return client.db(DB_NAME)
}

// User operations
export async function getUserById(userId: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.users).findOne({ _id: new ObjectId(userId) })
}

export async function getUserByEmail(email: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.users).findOne({ email })
}

export async function createUser(userData: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.users).insertOne(userData)
  return result.insertedId
}

export async function updateUser(userId: string, updateData: any) {
  const db = await getDb()
  return db.collection(COLLECTIONS.users).updateOne({ _id: new ObjectId(userId) }, { $set: updateData })
}

// Mood entry operations
export async function getMoodEntriesByUser(userId: string, limit = 30) {
  const db = await getDb()
  return db.collection(COLLECTIONS.moodEntries).find({ userId }).sort({ date: -1 }).limit(limit).toArray()
}

export async function createMoodEntry(moodData: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.moodEntries).insertOne(moodData)
  return result.insertedId
}

export async function getMoodEntryById(entryId: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.moodEntries).findOne({ _id: new ObjectId(entryId) })
}

// Journal entry operations
export async function getJournalEntriesByUser(userId: string, limit = 20) {
  const db = await getDb()
  return db.collection(COLLECTIONS.journalEntries).find({ userId }).sort({ date: -1 }).limit(limit).toArray()
}

export async function createJournalEntry(journalData: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.journalEntries).insertOne(journalData)
  return result.insertedId
}

export async function getJournalEntryById(entryId: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.journalEntries).findOne({ _id: new ObjectId(entryId) })
}

export async function updateJournalEntry(entryId: string, updateData: any) {
  const db = await getDb()
  return db.collection(COLLECTIONS.journalEntries).updateOne({ _id: new ObjectId(entryId) }, { $set: updateData })
}

export async function deleteJournalEntry(entryId: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.journalEntries).deleteOne({ _id: new ObjectId(entryId) })
}

// Favorites operations
export async function getFavoritesByUser(userId: string, type: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.favorites).find({ userId, type }).toArray()
}

export async function addFavorite(favoriteData: any) {
  const db = await getDb()
  const result = await db.collection(COLLECTIONS.favorites).insertOne(favoriteData)
  return result.insertedId
}

export async function removeFavorite(userId: string, itemId: string, type: string) {
  const db = await getDb()
  return db.collection(COLLECTIONS.favorites).deleteOne({ userId, itemId, type })
}

// Get user stats for dashboard
export async function getUserStats(userId: string) {
  const db = await getDb()

  // Get mood entries count
  const moodCount = await db.collection(COLLECTIONS.moodEntries).countDocuments({ userId })

  // Get journal entries count
  const journalCount = await db.collection(COLLECTIONS.journalEntries).countDocuments({ userId })

  // Get recent mood average
  const recentMoods = await db
    .collection(COLLECTIONS.moodEntries)
    .find({ userId })
    .sort({ date: -1 })
    .limit(7)
    .toArray()

  let moodAverage = 0
  if (recentMoods.length > 0) {
    moodAverage = recentMoods.reduce((sum, entry) => sum + entry.mood, 0) / recentMoods.length
  }

  // Get streak (consecutive days with entries)
  const streak = 0
  // Implementation would check for consecutive days

  return {
    moodCount,
    journalCount,
    moodAverage,
    streak,
    lastActive: recentMoods.length > 0 ? recentMoods[0].date : null,
  }
}
