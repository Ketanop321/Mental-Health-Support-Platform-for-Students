import { generateText } from "ai"
import { openai } from "@ai-sdk/openai"

// Analyze sentiment of text using AI
export async function analyzeSentiment(text: string) {
  try {
    const prompt = `
      Analyze the sentiment of the following journal entry. 
      Classify it as "positive", "negative", or "neutral".
      Also provide a score from -1.0 (very negative) to 1.0 (very positive).
      Return only a JSON object with "sentiment" and "score" properties.
      
      Journal entry: "${text}"
    `

    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the JSON response
    const parsedResult = JSON.parse(result)

    return {
      sentiment: parsedResult.sentiment,
      score: parsedResult.score,
    }
  } catch (error) {
    console.error("Error analyzing sentiment:", error)
    // Default to neutral if there's an error
    return {
      sentiment: "neutral",
      score: 0,
    }
  }
}

// Generate personalized recommendations based on mood and journal data
export async function generateRecommendations(userData: any) {
  try {
    const { recentMoods, recentJournals, preferences } = userData

    // Create a prompt that includes user data
    const prompt = `
      Generate 3 personalized wellness recommendations for a student based on their recent data.
      
      Recent mood data: ${JSON.stringify(recentMoods)}
      Recent journal entries: ${JSON.stringify(recentJournals)}
      User preferences: ${JSON.stringify(preferences)}
      
      Return only a JSON array of recommendation objects, each with "title", "description", and "type" (meditation, exercise, resource, video, or game) properties.
    `

    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the JSON response
    const recommendations = JSON.parse(result)

    return recommendations
  } catch (error) {
    console.error("Error generating recommendations:", error)
    // Return default recommendations if there's an error
    return [
      {
        title: "5-Minute Breathing Exercise",
        description: "Take a short break to practice deep breathing and reduce stress.",
        type: "exercise",
      },
      {
        title: "Mindfulness Meditation",
        description: "A beginner-friendly meditation to help you stay present and focused.",
        type: "meditation",
      },
      {
        title: "Sleep Improvement Tips",
        description: "Simple strategies to improve your sleep quality and duration.",
        type: "resource",
      },
    ]
  }
}

// Generate insights from mood tracking data
export async function generateMoodInsights(moodData: any) {
  try {
    const prompt = `
      Analyze the following mood tracking data and provide 3 insights about patterns, triggers, or suggestions.
      
      Mood data: ${JSON.stringify(moodData)}
      
      Return only a JSON array of insight objects, each with "title" and "description" properties.
    `

    const { text: result } = await generateText({
      model: openai("gpt-4o"),
      prompt,
    })

    // Parse the JSON response
    const insights = JSON.parse(result)

    return insights
  } catch (error) {
    console.error("Error generating mood insights:", error)
    // Return default insights if there's an error
    return [
      {
        title: "Track Your Patterns",
        description: "Continue tracking your mood to identify patterns and triggers.",
      },
      {
        title: "Self-Care Routine",
        description: "Consider establishing a regular self-care routine to maintain emotional balance.",
      },
      {
        title: "Seek Support",
        description: "Don't hesitate to reach out for support when you notice your mood declining.",
      },
    ]
  }
}
